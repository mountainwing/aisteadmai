import { useState } from "react";
import { Heart, Plus, X, Edit, Check, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useReasons } from "@/hooks/useReasons";
import { useReasonHeader } from "@/hooks/useReasonHeader";

interface ReasonsSectionProps {
  isEditMode?: boolean;
}

const ReasonsSection = ({ isEditMode = false }: ReasonsSectionProps) => {
  const { user } = useAuth();
  const {
    reasons,
    isLoading,
    createReason,
    updateReason,
    deleteReason,
    isCreating,
    isUpdating,
    isDeleting
  } = useReasons();
  
  const {
    reasonHeaderData,
    loading: headerLoading,
    updateReasonHeader,
    isUpdating: isUpdatingHeader
  } = useReasonHeader();

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  
  // Header editing state
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editHeaderTitle, setEditHeaderTitle] = useState("");
  const [editHeaderSubtitle, setEditHeaderSubtitle] = useState("");
  const [headerUpdateError, setHeaderUpdateError] = useState<string | null>(null);

  const handleAdd = () => {
    if (newTitle.trim() && newDescription.trim() && user) {
      createReason({
        title: newTitle,
        description: newDescription,
        createdBy: user.role
      });
      setNewTitle("");
      setNewDescription("");
      setIsAdding(false);
    }
  };

  const handleRemove = (id: string) => {
    if (user) {
      deleteReason({
        id,
        deletedBy: user.role
      });
    }
  };

  const handleEdit = (reason: { _id: string; title: string; description: string }) => {
    setEditingId(reason._id);
    setEditTitle(reason.title);
    setEditDescription(reason.description);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim() && editDescription.trim() && user) {
      updateReason({
        id: editingId,
        title: editTitle,
        description: editDescription,
        updatedBy: user.role
      });
      setEditingId(null);
      setEditTitle("");
      setEditDescription("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('reasons-scroll-container');
    if (container) {
      const scrollAmount = 320; // Width of a card plus gap
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleEditHeader = () => {
    if (reasonHeaderData) {
      setEditHeaderTitle(reasonHeaderData.title || "");
      setEditHeaderSubtitle(reasonHeaderData.subtitle || "");
      setIsEditingHeader(true);
      setHeaderUpdateError(null);
    }
  };

  const handleSaveHeader = async () => {
    if (!editHeaderTitle.trim() && !editHeaderSubtitle.trim()) {
      setHeaderUpdateError('Please enter at least a title or subtitle');
      return;
    }

    if (!user) {
      setHeaderUpdateError('User authentication required');
      return;
    }

    setHeaderUpdateError(null);
    const success = await updateReasonHeader({
      title: editHeaderTitle.trim() || undefined,
      subtitle: editHeaderSubtitle.trim() || undefined,
      updatedBy: user.role
    });

    if (success) {
      setIsEditingHeader(false);
      setEditHeaderTitle("");
      setEditHeaderSubtitle("");
    } else {
      setHeaderUpdateError('Failed to update header. Please try again.');
    }
  };

  const handleCancelHeaderEdit = () => {
    setIsEditingHeader(false);
    setEditHeaderTitle("");
    setEditHeaderSubtitle("");
    setHeaderUpdateError(null);
  };

  if (isLoading || headerLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Why You Should Be With Me Forever
            </h2>
            <p className="text-lg text-muted-foreground">
              Loading our precious reasons...
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentTitle = reasonHeaderData?.title || "Why You Should Be With Me Forever";
  const currentSubtitle = reasonHeaderData?.subtitle || "Here are just a few of the infinite reasons";

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          {isEditingHeader ? (
            <div className="space-y-4 mb-6">
              <div>
                <Input
                  value={editHeaderTitle}
                  onChange={(e) => setEditHeaderTitle(e.target.value)}
                  placeholder="Enter section title"
                  className="text-center text-2xl md:text-4xl font-serif font-bold bg-background/80 border-primary/30"
                />
              </div>
              <div>
                <Input
                  value={editHeaderSubtitle}
                  onChange={(e) => setEditHeaderSubtitle(e.target.value)}
                  placeholder="Enter section subtitle"
                  className="text-center text-lg bg-background/80 border-primary/30"
                />
              </div>
              
              {headerUpdateError && (
                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertDescription className="text-destructive">
                    {headerUpdateError}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-center gap-2">
                <Button 
                  onClick={handleSaveHeader}
                  disabled={isUpdatingHeader}
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUpdatingHeader ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleCancelHeaderEdit}
                  disabled={isUpdatingHeader}
                  variant="outline" 
                  size="sm" 
                  className="bg-background/80"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {currentTitle}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {currentSubtitle}
              </p>
              
              {/* Edit Header button */}
              {user?.role === 'boyfriend' && (
                <div className="flex justify-center mb-6">
                  <Button 
                    onClick={handleEditHeader}
                    variant="outline" 
                    size="sm" 
                    className="gap-2 bg-background/80 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Header
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Horizontal scrolling container */}
        <div className="relative">
          {/* Navigation buttons */}
          {reasons.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm"
                onClick={() => scrollContainer('left')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm"
                onClick={() => scrollContainer('right')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Scrollable reasons container */}
          <div
            id="reasons-scroll-container"
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-8 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reasons.map((reason: { _id: string; title: string; description: string }, index: number) => (
              <Card 
                key={reason._id} 
                className="group hover:shadow-[0_20px_40px_-15px_hsl(340_75%_55%/0.3)] transition-all duration-300 hover:scale-105 animate-fade-in flex-shrink-0 w-80"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6 relative h-full">
                  {user?.role === 'boyfriend' && !editingId && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => handleEdit(reason)}
                        className="p-1 hover:bg-primary/10 rounded"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleRemove(reason._id)}
                        className="p-1 hover:bg-destructive/10 rounded"
                        disabled={isDeleting}
                      >
                        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  )}

                  {editingId === reason._id ? (
                    <div className="space-y-4">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Reason title..."
                        className="text-xl font-semibold"
                      />
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Describe this reason..."
                        rows={4}
                        className="resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEdit}
                          size="sm"
                          variant="romantic"
                          className="flex-1"
                          disabled={isUpdating}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          size="sm"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Heart className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                      <p className="text-muted-foreground">{reason.description}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Add new reason card */}
            {user?.role === 'boyfriend' && (
              <Card className="flex-shrink-0 w-80 border-dashed border-2">
                <CardContent className="pt-6 h-full flex flex-col justify-center items-center">
                  {isAdding ? (
                    <div className="w-full space-y-4">
                      <Input
                        placeholder="Reason title..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <Textarea
                        placeholder="Describe this reason..."
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAdd}
                          variant="romantic"
                          className="flex-1"
                          disabled={isCreating}
                        >
                          Add Reason
                        </Button>
                        <Button
                          onClick={() => setIsAdding(false)}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setIsAdding(true)}
                      variant="outline"
                      className="gap-2 h-auto py-8"
                    >
                      <Plus className="w-6 h-6" />
                      <div>
                        <div className="font-semibold">Add Another Reason</div>
                        <div className="text-sm text-muted-foreground">Share more love</div>
                      </div>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReasonsSection;
