import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const ProposalSection = () => {
  const [answered, setAnswered] = useState(false);

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

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20" />
      
      <div className="relative z-10 text-center max-w-3xl mx-auto animate-fade-in">
        <Sparkles className="w-16 h-16 mx-auto mb-6 text-accent animate-pulse" />
        
        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          So, My Love...
        </h2>
        
        {!answered ? (
          <>
            <p className="text-2xl md:text-3xl mb-12 text-foreground">
              Will you make me the happiest person alive and marry me?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleYes}
                variant="romantic"
                size="lg"
                className="text-xl px-12 py-8 gap-3 animate-pulse"
              >
                <Heart className="w-6 h-6 fill-current" />
                Yes! Forever & Always
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-scale-in">
            <p className="text-3xl md:text-4xl font-serif text-primary">
              💍 Forever Starts Now 💍
            </p>
            <p className="text-xl text-muted-foreground">
              You've just made all my dreams come true
            </p>
            <div className="flex justify-center gap-2 pt-6">
              <Heart className="w-8 h-8 text-primary fill-current animate-pulse" />
              <Heart className="w-8 h-8 text-accent fill-current animate-pulse" style={{ animationDelay: '0.2s' }} />
              <Heart className="w-8 h-8 text-primary fill-current animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProposalSection;
