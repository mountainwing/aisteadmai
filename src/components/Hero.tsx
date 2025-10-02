import { useState } from "react";
import { Heart, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useHero } from "@/hooks/useHero";
import { useAuth } from "@/hooks/useAuth";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const { heroData, loading, error, updateHero } = useHero();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleEditClick = () => {
    if (heroData) {
      setEditTitle(heroData.title);
      setEditDescription(heroData.description);
      setIsEditing(true);
      setUpdateError(null);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim() && !editDescription.trim()) {
      setUpdateError('Please enter at least a title or description');
      return;
    }

    setUpdating(true);
    setUpdateError(null);

    const success = await updateHero({
      title: editTitle.trim() || undefined,
      description: editDescription.trim() || undefined
    });

    if (success) {
      setIsEditing(false);
    } else {
      setUpdateError('Failed to update hero data. Please try again.');
    }
    
    setUpdating(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditDescription('');
    setUpdateError(null);
  };

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <Heart className="w-20 h-20 mx-auto mb-6 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  const currentTitle = heroData?.title || "Will You Marry Me?";
  const currentDescription = heroData?.description || "A journey through all the moments that led us here";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>
      
      <div className="relative z-10 text-center px-4 animate-fade-in max-w-4xl mx-auto">
        
        {error && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <Heart className="w-20 h-20 mx-auto mb-6 text-primary animate-pulse" />
        
        {isEditing ? (
          <div className="space-y-4 mb-6">
            <div>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter hero title"
                className="text-center text-2xl md:text-4xl font-serif font-bold bg-background/80 border-primary/30"
              />
            </div>
            <div>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter hero description"
                className="text-center text-lg bg-background/80 border-primary/30 resize-none"
                rows={3}
              />
            </div>
            
            {updateError && (
              <Alert className="border-destructive/50 bg-destructive/10">
                <AlertDescription className="text-destructive">
                  {updateError}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-center gap-2">
              <Button 
                onClick={handleSave}
                disabled={updating}
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
              >
                {updating ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button 
                onClick={handleCancel}
                disabled={updating}
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
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {currentTitle}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {currentDescription}
            </p>
            
            {/* Edit Content button */}
            {user?.role === 'boyfriend' && (
              <div className="flex justify-center mb-6">
                <Button 
                  onClick={handleEditClick}
                  variant="outline" 
                  size="sm" 
                  className="gap-2 bg-background/80 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Content
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
