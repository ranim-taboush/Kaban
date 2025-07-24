import { create } from 'zustand';
import { Column, CurrentPage } from '../types/kanbanTypes';

interface TaskStoreState {
  searchTerm: string;
  currentPage: CurrentPage;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (column: Column, page: number) => void;
}

export const useTaskStore = create<TaskStoreState>((set) => ({
  searchTerm: '',
  currentPage: { backlog: 1, 'in-progress': 1, review: 1, done: 1 },
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  setCurrentPage: (column, page) =>
    set((state) => ({
      currentPage: { ...state.currentPage, [column]: page }
    })),
}));