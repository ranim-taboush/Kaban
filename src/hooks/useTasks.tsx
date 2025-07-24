import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../lib/api';
import { Task, NewTaskInput, TaskUpdates, Column } from '../types/kanbanTypes';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getTasks,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: TaskUpdates }) =>
      taskApi.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useMoveTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, newColumn, newOrder }: { 
      taskId: number; 
      newColumn: Column; 
      newOrder: number 
    }) => taskApi.moveTask(taskId, newColumn, newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};