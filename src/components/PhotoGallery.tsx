import { useState, useRef } from "react";
import { Upload, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
}

const PhotoGallery = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setMedia(prev => [...prev, {
              id: Date.now().toString() + Math.random(),
              url: event.target.result as string,
              type: file.type.startsWith('image/') ? 'image' : 'video',
            }]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload only images or videos",
          variant: "destructive",
        });
      }
    });
  };

  const handleRemove = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Our Beautiful Memories
          </h2>
          <p className="text-lg text-muted-foreground">
            Every picture tells our story
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {media.map((item, index) => (
            <Card 
              key={item.id} 
              className="group relative overflow-hidden aspect-square animate-fade-in hover:shadow-[0_20px_40px_-15px_hsl(340_75%_55%/0.3)] transition-all duration-300"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-0 h-full">
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt="Memory" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video 
                      src={item.url} 
                      className="w-full h-full object-cover"
                      controls
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                      <Play className="w-12 h-12 text-white opacity-80" />
                    </div>
                  </div>
                )}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="romantic"
            size="lg"
            className="gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Photos & Videos
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Upload images or MP4 videos
          </p>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
