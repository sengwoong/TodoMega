import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, createTodo, updateTodo, deleteTodo, searchTodos } from 'back/todo';

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


