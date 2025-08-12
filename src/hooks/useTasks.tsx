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
    mutationFn: ({ taskId, newColumn, newOrder }: { taskId: number; newColumn: Column; newOrder: number }) =>
      taskApi.moveTask(taskId, newColumn, newOrder),
    onMutate: async (variables) => {
      const { taskId, newColumn, newOrder } = variables;

      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previous = queryClient.getQueryData<Task[]>(['tasks']);

      const optimistic = reorderTasksLocally(previous, taskId, newColumn, newOrder);
      queryClient.setQueryData(['tasks'], optimistic);

      return { previous };
    },
    onError: (err, variables, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(['tasks'], context.previous);
      }
    },
    onSuccess: (data, variables, context) => {
      // If server returned authoritative tasks (like /reorder), set it directly
      if (Array.isArray(data)) {
        queryClient.setQueryData(['tasks'], data);
        return;
      }
      // Otherwise, invalidate to refetch authoritative data
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onSettled: () => {
      // Ensure canonical data after everything
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

  function reorderTasksLocally(tasks: Task[] | undefined, taskId: number, newColumn: Column, newOrder: number): Task[] | undefined {
  if (!tasks) return tasks;
  
  const items = tasks.map(t => ({ ...t }));// deep copy
  const moving = items.find(t => t.id === taskId);
  if (!moving) return items;

  const oldColumn = moving.column;
  const oldOrder = moving.order;

  let remaining = items.filter(t => t.id !== taskId);// remove moving task

  if (oldColumn === newColumn) {
    remaining.forEach(t => {
      if (t.column !== newColumn) return;
      if (newOrder > oldOrder) {
        if (t.order > oldOrder && t.order <= newOrder) t.order -= 1;
      } else {
        if (t.order >= newOrder && t.order < oldOrder) t.order += 1;
      }
    });
  } else {
    remaining.forEach(t => {
      if (t.column === oldColumn && t.order > oldOrder) t.order -= 1;
      if (t.column === newColumn && t.order >= newOrder) t.order += 1;
    });
  }

  const updatedMoving = { ...moving, column: newColumn, order: newOrder };
  remaining.push(updatedMoving);

  // Normalize per-column orders to 0..n-1
  const cols: Column[] = ['backlog', 'in-progress', 'review', 'done'];
  const normalized: Task[] = [];
  cols.forEach(col => {
    const colTasks = remaining
      .filter(t => t.column === col)
      .sort((a, b) => a.order - b.order)
      .map((t, i) => ({ ...t, order: i }));
    normalized.push(...colTasks);
  });

  return normalized;
}
