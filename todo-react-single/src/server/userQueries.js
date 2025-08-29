import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, deleteUser } from 'back/user';

export function useUsersQuery() {
  return useQuery({ queryKey: ['users'], queryFn: getUsers });
}

export function useCreateUserMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      options.onSuccess && options.onSuccess(...args);
    },
    onError: options.onError,
  });
}

export function useDeleteUserMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      options.onSuccess && options.onSuccess(...args);
    },
    onError: options.onError,
  });
}


