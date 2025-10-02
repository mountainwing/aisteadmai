import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:3001/api';

// API functions
const fetchReasonHeader = async () => {
  const response = await fetch(`${API_BASE_URL}/reasonheader`);
  if (!response.ok) {
    throw new Error(`Failed to fetch reason header: ${response.statusText}`);
  }
  return response.json();
};

const updateReasonHeader = async ({ title, subtitle, updatedBy }) => {
  const response = await fetch(`${API_BASE_URL}/reasonheader`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, subtitle, updatedBy }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update reason header');
  }

  return response.json();
};

// Hook
export const useReasonHeader = () => {
  const queryClient = useQueryClient();

  // Query for fetching reason header data
  const {
    data: reasonHeaderData,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['reasonHeader'],
    queryFn: fetchReasonHeader,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation for updating reason header
  const updateReasonHeaderMutation = useMutation({
    mutationFn: updateReasonHeader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reasonHeader'] });
    },
    onError: (error) => {
      console.error('Error updating reason header:', error);
    },
  });

  const updateReasonHeaderData = async (data) => {
    try {
      await updateReasonHeaderMutation.mutateAsync(data);
      return true;
    } catch (error) {
      console.error('Failed to update reason header:', error);
      return false;
    }
  };

  return {
    // Data
    reasonHeaderData,
    loading,
    error: error?.message,

    // Functions
    updateReasonHeader: updateReasonHeaderData,
    refetchReasonHeader: refetch,

    // Loading states
    isUpdating: updateReasonHeaderMutation.isPending,
    updateError: updateReasonHeaderMutation.error,
  };
};