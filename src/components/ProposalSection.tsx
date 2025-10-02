import { useState } from "react";
import { Heart, Sparkles, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProposal, useUpdateProposal } from "@/hooks/useProposal";
import confetti from "canvas-confetti";

const ProposalSection = () => {
  const [answered, setAnswered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editQuestion, setEditQuestion] = useState('');
  const [editButtonText, setEditButtonText] = useState('');
  const [editSuccessTitle, setEditSuccessTitle] = useState('');
  const [editSuccessMessage, setEditSuccessMessage] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { data: proposalData, isLoading } = useProposal();
  const updateProposalMutation = useUpdateProposal();

  const handleYes = () => {
    setAnswered(true);
    
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#E879A7', '#B87BDB', '#F8C8DC'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#E879A7', '#B87BDB', '#F8C8DC'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    toast({
      title: "💕 She said YES! 💕",
      description: "This is the beginning of forever!",
    });
  };

  const handleEditClick = () => {
    if (proposalData) {
      setEditTitle(proposalData.title);
      setEditQuestion(proposalData.question);
      setEditButtonText(proposalData.buttonText);
      setEditSuccessTitle(proposalData.successTitle);
      setEditSuccessMessage(proposalData.successMessage);
      setIsEditing(true);
      setUpdateError(null);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim() && !editQuestion.trim()) {
      setUpdateError('Please enter at least a title or question');
      return;
    }

    setUpdating(true);
    setUpdateError(null);

    try {
      await updateProposalMutation.mutateAsync({
        title: editTitle.trim(),
        question: editQuestion.trim(),
        buttonText: editButtonText.trim(),
        successTitle: editSuccessTitle.trim(),
        successMessage: editSuccessMessage.trim()
      });
      setIsEditing(false);
      toast({
        title: "Proposal Updated",
        description: "Your proposal content has been saved successfully!",
      });
    } catch (error) {
      setUpdateError('Failed to save proposal content. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditQuestion('');
    setEditButtonText('');
    setEditSuccessTitle('');
    setEditSuccessMessage('');
    setUpdateError(null);
  };

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20" />
      
      <div className="relative z-10 text-center max-w-3xl mx-auto animate-fade-in">
        <Sparkles className="w-16 h-16 mx-auto mb-6 text-accent animate-pulse" />
        

        
        {updateError && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertDescription className="text-destructive">
              {updateError}
            </AlertDescription>
          </Alert>
        )}
        
        {isEditing ? (
          <div className="space-y-4 mb-6">
            <div>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter proposal title"
                className="text-center text-2xl md:text-4xl font-serif font-bold bg-background/80 border-primary/30"
              />
            </div>
            <div>
              <Textarea
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                placeholder="Enter your proposal question"
                className="text-center text-lg bg-background/80 border-primary/30 resize-none"
                rows={3}
              />
            </div>
            <div>
              <Input
                value={editButtonText}
                onChange={(e) => setEditButtonText(e.target.value)}
                placeholder="Enter button text"
                className="text-center text-lg bg-background/80 border-primary/30"
              />
            </div>
            <div>
              <Input
                value={editSuccessTitle}
                onChange={(e) => setEditSuccessTitle(e.target.value)}
                placeholder="Enter success title"
                className="text-center text-lg bg-background/80 border-primary/30"
              />
            </div>
            <div>
              <Textarea
                value={editSuccessMessage}
                onChange={(e) => setEditSuccessMessage(e.target.value)}
                placeholder="Enter success message"
                className="text-center text-lg bg-background/80 border-primary/30 resize-none"
                rows={2}
              />
            </div>
            
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
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {proposalData?.title || "So, My Love..."}
            </h2>
            
            {!answered ? (
              <>
                <p className="text-2xl md:text-3xl mb-12 text-foreground">
                  {proposalData?.question || "Will you make me the happiest person alive and marry me?"}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Button
                    onClick={handleYes}
                    variant="romantic"
                    size="lg"
                    className="text-xl px-12 py-8 gap-3 animate-pulse"
                  >
                    <Heart className="w-6 h-6 fill-current" />
                    {proposalData?.buttonText || "Yes! Forever & Always"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-6 animate-scale-in mb-8">
                <p className="text-3xl md:text-4xl font-serif text-primary">
                  {proposalData?.successTitle || "💍 Forever Starts Now 💍"}
                </p>
                <p className="text-xl text-muted-foreground">
                  {proposalData?.successMessage || "You've just made all my dreams come true"}
                </p>
                <div className="flex justify-center gap-2 pt-6">
                  <Heart className="w-8 h-8 text-primary fill-current animate-pulse" />
                  <Heart className="w-8 h-8 text-accent fill-current animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <Heart className="w-8 h-8 text-primary fill-current animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            
            {/* Edit Proposal button */}
            {user?.role === 'boyfriend' && (
              <div className="flex justify-center">
                <Button 
                  onClick={handleEditClick}
                  variant="outline" 
                  size="sm" 
                  className="gap-2 bg-background/80 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Proposal
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProposalSection;
