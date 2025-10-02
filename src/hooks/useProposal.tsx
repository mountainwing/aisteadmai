import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

interface ProposalData {
  _id?: string;
  title: string;
  question: string;
  buttonText: string;
  successTitle: string;
  successMessage: string;
}

type ProposalUpdateData = Omit<ProposalData, '_id'>;

const fetchProposal = async (): Promise<ProposalData> => {
  const response = await fetch(`${API_BASE_URL}/proposal`);
  if (!response.ok) {
    throw new Error('Failed to fetch proposal data');
  }
  return response.json();
};

const updateProposal = async (data: ProposalUpdateData): Promise<ProposalData> => {
  const response = await fetch(`${API_BASE_URL}/proposal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update proposal');
  }
  
  return response.json();
};

export const useProposal = () => {
  return useQuery({
    queryKey: ['proposal'],
    queryFn: fetchProposal,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal'] });
    },
  });
};