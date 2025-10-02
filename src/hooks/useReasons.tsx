import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:3001/api';

// API functions
const fetchReasons = async () => {
  const response = await fetch(`${API_BASE_URL}/reasons`);
  if (!response.ok) {
    throw new Error(`Failed to fetch reasons: ${response.statusText}`);
  }
  return response.json();
};

const createReason = async ({ title, description, createdBy }) => {
  const response = await fetch(`${API_BASE_URL}/reasons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description, createdBy }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create reason');
  }

  return response.json();
};

const updateReason = async ({ id, title, description, updatedBy }) => {
  const response = await fetch(`${API_BASE_URL}/reasons/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description, updatedBy }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update reason');
  }

  return response.json();
};

const deleteReason = async ({ id, deletedBy }) => {
  const response = await fetch(`${API_BASE_URL}/reasons/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deletedBy }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete reason');
  }

  return response.json();
};

const reorderReason = async ({ id, newOrder, updatedBy }) => {
  const response = await fetch(`${API_BASE_URL}/reasons/reorder/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newOrder, updatedBy }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reorder reason');
  }

  return response.json();
};

// Hook
export const useReasons = () => {
  const queryClient = useQueryClient();

  // Query for fetching all reasons
  const {
    data: reasons = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['reasons'],
    queryFn: fetchReasons,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in newer versions)
  });

  // Mutation for creating a reason
  const createReasonMutation = useMutation({
    mutationFn: createReason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reasons'] });
    },
    onError: (error) => {
      console.error('Error creating reason:', error);
    },
  });

  // Mutation for updating a reason
  const updateReasonMutation = useMutation({
    mutationFn: updateReason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reasons'] });
    },
    onError: (error) => {
      console.error('Error updating reason:', error);
    },
  });

  // Mutation for deleting a reason
  const deleteReasonMutation = useMutation({
    mutationFn: deleteReason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reasons'] });
    },
    onError: (error) => {
      console.error('Error deleting reason:', error);
    },
  });

  // Mutation for reordering reasons
  const reorderReasonMutation = useMutation({
    mutationFn: reorderReason,
    onSuccess: (data) => {
      // Update the cache with the new order
      queryClient.setQueryData(['reasons'], data.data);
    },
    onError: (error) => {
      console.error('Error reordering reason:', error);
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['reasons'] });
    },
  });

  return {
    // Data
    reasons,
    isLoading,
    error,

    // Functions
    refetchReasons: refetch,

    // Mutations
    createReason: createReasonMutation.mutate,
    createReasonAsync: createReasonMutation.mutateAsync,
    isCreating: createReasonMutation.isPending,
    createError: createReasonMutation.error,

    updateReason: updateReasonMutation.mutate,
    updateReasonAsync: updateReasonMutation.mutateAsync,
    isUpdating: updateReasonMutation.isPending,
    updateError: updateReasonMutation.error,

    deleteReason: deleteReasonMutation.mutate,
    deleteReasonAsync: deleteReasonMutation.mutateAsync,
    isDeleting: deleteReasonMutation.isPending,
    deleteError: deleteReasonMutation.error,

    reorderReason: reorderReasonMutation.mutate,
    reorderReasonAsync: reorderReasonMutation.mutateAsync,
    isReordering: reorderReasonMutation.isPending,
    reorderError: reorderReasonMutation.error,

    // Combined loading state
    isLoadingAny: isLoading || 
                  createReasonMutation.isPending || 
                  updateReasonMutation.isPending || 
                  deleteReasonMutation.isPending ||
                  reorderReasonMutation.isPending,
  };
};