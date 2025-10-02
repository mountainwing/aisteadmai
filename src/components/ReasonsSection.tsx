import { useState } from "react";
import { Heart, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Reason {
  id: string;
  title: string;
  description: string;
}

const ReasonsSection = () => {
  const [reasons, setReasons] = useState<Reason[]>([
    {
      id: "1",
      title: "Your Beautiful Smile",
      description: "Every day starts better when I see your smile. It lights up my world.",
    },
    {
      id: "2",
      title: "Your Kind Heart",
      description: "The way you care for others and spread love makes me fall for you more each day.",
    },
    {
      id: "3",
      title: "Our Adventures",
      description: "Every moment with you is an adventure I never want to end.",
    },
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAdd = () => {
    if (newTitle.trim() && newDescription.trim()) {
      setReasons([
        ...reasons,
        {
          id: Date.now().toString(),
          title: newTitle,
          description: newDescription,
        },
      ]);
      setNewTitle("");
      setNewDescription("");
      setIsAdding(false);
    }
  };

  const handleRemove = (id: string) => {
    setReasons(reasons.filter(r => r.id !== id));
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Why You Should Be With Me Forever
          </h2>
          <p className="text-lg text-muted-foreground">
            Here are just a few of the infinite reasons
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reasons.map((reason, index) => (
            <Card 
              key={reason.id} 
              className="group hover:shadow-[0_20px_40px_-15px_hsl(340_75%_55%/0.3)] transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6 relative">
                <button
                  onClick={() => handleRemove(reason.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
                <Heart className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {isAdding ? (
          <Card className="max-w-2xl mx-auto animate-scale-in">
            <CardContent className="pt-6 space-y-4">
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
              />
              <div className="flex gap-2">
                <Button onClick={handleAdd} variant="romantic" className="flex-1">
                  Add Reason
                </Button>
                <Button onClick={() => setIsAdding(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center">
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Reason
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReasonsSection;
