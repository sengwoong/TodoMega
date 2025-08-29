import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, deleteUser } from 'back/user';
// Users 관련 React Query 훅 모음
// - 페이지는 이 훅만 사용하고, 실제 API 구현은 back/*에 숨겨집니다.

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


