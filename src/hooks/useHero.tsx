import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface HeroData {
  _id?: string;
  title: string;
  description: string;
  backgroundImage?: string | null;
  updatedAt: Date;
  createdAt: Date;
}

interface UseHeroReturn {
  heroData: HeroData | null;
  loading: boolean;
  error: string | null;
  updateHero: (data: Partial<Pick<HeroData, 'title' | 'description' | 'backgroundImage'>>) => Promise<boolean>;
  refreshHero: () => Promise<void>;
}

const API_BASE_URL = 'http://localhost:3001/api';

export const useHero = (): UseHeroReturn => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/hero`);
      if (!response.ok) {
        throw new Error(`Failed to fetch hero data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setHeroData(data);
    } catch (err) {
      console.error('Error fetching hero data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch hero data');
      
      // Set default data if API fails
      setHeroData({
        title: "Will You Marry Me?",
        description: "A journey through all the moments that led us here",
        backgroundImage: null,
        updatedAt: new Date(),
        createdAt: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  const updateHero = async (updateData: Partial<Pick<HeroData, 'title' | 'description' | 'backgroundImage'>>): Promise<boolean> => {
    // Only allow updates if user is boyfriend
    if (!user || user.role !== 'boyfriend') {
      setError('Only the boyfriend can edit hero data');
      return false;
    }

    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/hero`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update hero data: ${response.statusText}`);
      }

      const result = await response.json();
      setHeroData(result.data);
      return true;
    } catch (err) {
      console.error('Error updating hero data:', err);
      setError(err instanceof Error ? err.message : 'Failed to update hero data');
      return false;
    }
  };

  const refreshHero = async () => {
    await fetchHeroData();
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  return {
    heroData,
    loading,
    error,
    updateHero,
    refreshHero
  };
};