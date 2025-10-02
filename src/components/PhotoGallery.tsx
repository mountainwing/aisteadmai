import { useState, useRef } from "react";
import { Upload, X, Play, Heart, Edit3, Trash2, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useMedia } from "@/hooks/useMedia";
import { useAuth } from "@/hooks/useAuth";

interface PhotoGalleryProps {
  isEditMode?: boolean;
}

const PhotoGallery = ({ isEditMode = false }: PhotoGalleryProps) => {
  const { mediaItems, loading, error, uploadMedia, deleteMedia, updateCaption } = useMedia();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [newCaption, setNewCaption] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image or video file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const success = await uploadMedia(file);
    setUploading(false);

    if (success) {
      toast({
        title: "Media uploaded",
        description: `${isImage ? 'Image' : 'Video'} has been added to your gallery.`,
      });
    } else {
      toast({
        title: "Upload failed",
        description: error || "Failed to upload media. Please try again.",
        variant: "destructive",
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveMedia = async (id: string) => {
    const success = await deleteMedia(id);
    
    if (success) {
      toast({
        title: "Media removed",
        description: "The media item has been removed from your gallery.",
      });
    } else {
      toast({
        title: "Delete failed",
        description: error || "Failed to delete media. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCaption = (id: string, currentCaption?: string) => {
    setEditingCaption(id);
    setNewCaption(currentCaption || '');
  };

  const handleSaveCaption = async (id: string) => {
    const success = await updateCaption(id, newCaption);
    
    if (success) {
      setEditingCaption(null);
      setNewCaption('');
      toast({
        title: "Caption updated",
        description: "The caption has been updated successfully.",
      });
    } else {
      toast({
        title: "Update failed",
        description: error || "Failed to update caption. Please try again.",
        variant: "destructive",
      });
    }
  };

  const canDeleteOrEdit = (item: { uploadedBy: string }) => {
    return user && (user.username === item.uploadedBy || user.role === 'boyfriend');
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Our Beautiful Memories
            </h2>
            <p className="text-lg text-muted-foreground">Loading our precious moments...</p>
          </div>
          <div className="flex justify-center">
            <Heart className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Our Beautiful Memories
          </h2>
          <p className="text-lg text-muted-foreground">
            Every picture tells our story
          </p>
        </div>

        {/* Horizontal Scrolling Gallery */}
        {mediaItems.length > 0 && (
          <div className="relative">
            {/* Scroll Navigation */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollLeft}
                className="bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background/90"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollRight}
                className="bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background/90"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 px-8 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {mediaItems.map((item, index) => (
                <Card 
                  key={item._id} 
                  className="group relative flex-none w-64 h-80 overflow-hidden animate-fade-in hover:shadow-[0_20px_40px_-15px_hsl(340_75%_55%/0.3)] transition-all duration-300"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-0 h-full relative">
                    {/* Media Content */}
                    <div className="h-4/5 relative overflow-hidden">
                      {item.type === 'image' ? (
                        <img 
                          src={`${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'}${item.url}`}
                          alt={item.caption || "Memory"} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video 
                            src={`${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'}${item.url}`}
                            className="w-full h-full object-cover"
                            controls
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 group-hover:bg-black/0 transition-colors">
                            <Play className="w-12 h-12 text-white opacity-80" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Caption Area */}
                    <div className="h-1/5 p-3 bg-background/95 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.uploadedBy}
                        </Badge>
                        {canDeleteOrEdit(item) && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCaption(item._id, item.caption)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMedia(item._id)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {editingCaption === item._id ? (
                        <div className="flex gap-1">
                          <Input
                            value={newCaption}
                            onChange={(e) => setNewCaption(e.target.value)}
                            className="h-6 text-xs"
                            placeholder="Add a caption..."
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveCaption(item._id)}
                            className="h-6 w-6 p-0"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground truncate">
                          {item.caption || "No caption"}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upload Section - Available to both users */}
        <div className="text-center mt-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            variant="outline"
            size="lg"
            className="gap-2 border-primary/30 hover:bg-primary/10"
          >
            <Upload className="w-5 h-5" />
            {uploading ? 'Uploading...' : 'Add Memory'}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Share photos & videos (max 50MB each)
          </p>
        </div>

        {/* Empty State */}
        {mediaItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No memories yet</h3>
            <p className="text-muted-foreground">
              Start creating beautiful memories by uploading your first photo or video!
            </p>
          </div>
        )}
      </div>


    </section>
  );
};

export default PhotoGallery;
