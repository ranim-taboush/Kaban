import axios from 'axios';
import { Task, NewTaskInput, TaskUpdates, Column } from '../types/kanbanTypes';

const API_BASE = 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskApi = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Create a new task
  createTask: async (task: NewTaskInput): Promise<Task> => {
    // Get current tasks to determine order
    const existingTasks = await taskApi.getTasks();
    const backlogTasks = existingTasks.filter(t => t.column === 'backlog');
    const maxOrder = backlogTasks.length > 0 ? Math.max(...backlogTasks.map(t => t.order)) : -1;
    
    const newTask = {
      ...task,
      column: 'backlog' as Column,
      order: maxOrder + 1
    };
    
    const response = await api.post('/tasks', newTask);
    return response.data;
  },

  // Update a task
  updateTask: async (id: number, updates: TaskUpdates): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, updates);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Move task to different column and reorder
  moveTask: async (taskId: number, newColumn: Column, newOrder: number): Promise<void> => {
    const allTasks = await taskApi.getTasks();
    const task = allTasks.find(t => t.id === taskId);
    
    if (!task) throw new Error('Task not found');

    const oldColumn = task.column;
    const oldOrder = task.order;

    if (oldColumn === newColumn) {
      const columnTasks = allTasks.filter(t => t.column === newColumn && t.id !== taskId);
      
      const updates: Promise<Task>[] = [];
      
      if (newOrder > oldOrder) {// Moving down
        columnTasks
          .filter(t => t.order > oldOrder && t.order <= newOrder)
          .forEach(t => {
            updates.push(taskApi.updateTask(t.id, { order: t.order - 1 }));
          });
      } else {// Moving up
        columnTasks
          .filter(t => t.order >= newOrder && t.order < oldOrder)
          .forEach(t => {
            updates.push(taskApi.updateTask(t.id, { order: t.order + 1 }));
          });
      }

      try {
        await Promise.all(updates);
        await taskApi.updateTask(taskId, { order: newOrder });
      } catch (error) {
        console.error("Failed to update tasks:", error);
      }
    } else { // Moving to different column
      const oldColumnTasks = allTasks.filter(t => t.column === oldColumn && t.order > oldOrder);
      const newColumnTasks = allTasks.filter(t => t.column === newColumn && t.order >= newOrder);
      
      // These are already properly typed through TypeScript inference
      const oldColumnUpdates = oldColumnTasks.map(t => 
        taskApi.updateTask(t.id, { order: t.order - 1 })
      );
      
      const newColumnUpdates = newColumnTasks.map(t => 
        taskApi.updateTask(t.id, { order: t.order + 1 })
      );
      
      await Promise.all([...oldColumnUpdates, ...newColumnUpdates]);
      await taskApi.updateTask(taskId, { column: newColumn, order: newOrder });
    }
  }
};