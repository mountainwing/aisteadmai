import { Heart, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.jpg';

const Unauthorized = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
      </div>
      
      <div className="relative z-10 w-full max-w-md p-6 animate-fade-in">
        <div className="text-center mb-8">
          <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-serif font-bold mb-2 text-muted-foreground">
            Access Restricted
          </h1>
        </div>

        <Card className="backdrop-blur-sm bg-background/90 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Sweet {user?.role}
            </CardTitle>
            <CardDescription>
              This area is reserved for special editing privileges
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You can enjoy our beautiful love story, but editing is reserved for your beloved boyfriend! 💕
            </p>
            
            <div className="space-y-2">
              <Button 
                onClick={handleGoHome}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80"
              >
                View Our Love Story
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full border-primary/30 hover:bg-primary/10"
              >
                Switch Account
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Made with love 💕</p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;