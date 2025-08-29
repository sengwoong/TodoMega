import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, createTodo, updateTodo, deleteTodo, searchTodos } from 'back/todo';
// Todos 관련 React Query 훅 모음
// - 페이지에서 API 세부 구현을 몰라도 이 훅만 사용하면 됩니다.

export function useTodosQuery() {
  return useQuery({ queryKey: ['todos'], queryFn: getTodos });
}

export function useCreateTodoMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTodo,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      options.onSuccess && options.onSuccess(...args);
    },
    onError: options.onError,
  });
}

export function useUpdateTodoMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, partial }) => updateTodo(id, partial),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      options.onSuccess && options.onSuccess(...args);
    },
    onError: options.onError,
  });
}

export function useDeleteTodoMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      options.onSuccess && options.onSuccess(...args);
    },
    onError: options.onError,
  });
}

export function useTodosSearch(params, options = {}) {
  // params: { q, username, completed }
  return useQuery({
    queryKey: ['todos', 'search', params],
    queryFn: () => searchTodos(params || {}),
    enabled: options.enabled !== undefined ? options.enabled : true,
  });
}


