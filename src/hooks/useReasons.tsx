import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

// API functions
const fetchReasons = async () => {
  const response = await fetch(`${API_BASE_URL}/reasons`);
  if (!response.ok) {
    throw new Error(`Failed to fetch reasons: ${response.statusText}`);
  }
  return response.json();
};

const createReason = async ({ title, description }) => {
  const response = await fetch(`${API_BASE_URL}/reasons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create reason');
  }

  return response.json();
};

const updateReason = async ({ id, title, description }) => {
  const response = await fetch(`${API_BASE_URL}/reasons`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, title, description }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update reason');
  }

  return response.json();
};

const deleteReason = async ({ id }) => {
  const response = await fetch(`${API_BASE_URL}/reasons`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete reason');
  }

  return response.json();
};

const reorderReasons = async ({ newOrder }) => {
  const response = await fetch(`${API_BASE_URL}/reasons/reorder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newOrder }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reorder reasons');
  }

  return response.json();
};

// Hook
export const useReasons = () => {
  const queryClient = useQueryClient();

  // Query
  const {
    data: reasons = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['reasons'],
    queryFn: fetchReasons,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations
  const createReasonMutation = useMutation({
    mutationFn: createReason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reasons'] });
    },
    onError: (error) => {
      console.error('Error creating reason:', error);
    },
  });

  const updateReasonMutation = useMutation({
    mutationFn: updateReason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reasons'] });
    },
    onError: (error) => {
      console.error('Error updating reason:', error);
    },
  });

  const deleteReasonMutation = useMutation({
    mutationFn: deleteReason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reasons'] });
    },
    onError: (error) => {
      console.error('Error deleting reason:', error);
    },
  });

  const reorderReasonMutation = useMutation({
    mutationFn: reorderReasons,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reasons'] });
    },
    onError: (error) => {
      console.error('Error reordering reasons:', error);
    },
  });

  return {
    // Data
    reasons,
    isLoading,
    error,
    
    // Actions
    refetch,
    
    // Mutations
    createReason: createReasonMutation.mutate,
    updateReason: updateReasonMutation.mutate,
    deleteReason: deleteReasonMutation.mutate,
    reorderReason: reorderReasonMutation.mutate,
    
    // Async mutations (for awaiting results)
    createReasonAsync: createReasonMutation.mutateAsync,
    updateReasonAsync: updateReasonMutation.mutateAsync,
    deleteReasonAsync: deleteReasonMutation.mutateAsync,
    reorderReasonAsync: reorderReasonMutation.mutateAsync,
    
    // Mutation states
    isCreating: createReasonMutation.isPending,
    isUpdating: updateReasonMutation.isPending,
    isDeleting: deleteReasonMutation.isPending,
    isReordering: reorderReasonMutation.isPending,
  };
};