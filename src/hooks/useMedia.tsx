import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface MediaItem {
  _id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  type: 'image' | 'video';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  caption?: string;
}

interface UseMediaReturn {
  mediaItems: MediaItem[];
  loading: boolean;
  error: string | null;
  uploadMedia: (file: File, caption?: string) => Promise<boolean>;
  deleteMedia: (id: string) => Promise<boolean>;
  updateCaption: (id: string, caption: string) => Promise<boolean>;
  refreshMedia: () => Promise<void>;
}

const API_BASE_URL = 'http://localhost:3001/api';

export const useMedia = (): UseMediaReturn => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/media`);
      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.statusText}`);
      }
      
      const data = await response.json();
      setMediaItems(data);
    } catch (err) {
      console.error('Error fetching media:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch media');
      setMediaItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadMedia = async (file: File, caption?: string): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to upload media');
      return false;
    }

    try {
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadedBy', user.username);
      if (caption) {
        formData.append('caption', caption);
      }

      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to upload media: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Add new media item to the beginning of the list
      setMediaItems(prev => [result.data, ...prev]);
      return true;
    } catch (err) {
      console.error('Error uploading media:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload media');
      return false;
    }
  };

  const deleteMedia = async (id: string): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to delete media');
      return false;
    }

    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete media: ${response.statusText}`);
      }

      // Remove the deleted item from the list
      setMediaItems(prev => prev.filter(item => item._id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting media:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete media');
      return false;
    }
  };

  const updateCaption = async (id: string, caption: string): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to update captions');
      return false;
    }

    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/media/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caption, username: user.username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update caption: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Update the item in the list
      setMediaItems(prev => 
        prev.map(item => item._id === id ? result.data : item)
      );
      return true;
    } catch (err) {
      console.error('Error updating caption:', err);
      setError(err instanceof Error ? err.message : 'Failed to update caption');
      return false;
    }
  };

  const refreshMedia = async () => {
    await fetchMedia();
  };

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return {
    mediaItems,
    loading,
    error,
    uploadMedia,
    deleteMedia,
    updateCaption,
    refreshMedia
  };
};