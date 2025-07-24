export type Column = 'backlog' | 'in-progress' | 'review' | 'done';

export interface CurrentPage {
  backlog: number;
  'in-progress': number;
  review: number;
  done: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  column: Column;
  order: number;
}

export interface TaskUpdates {
  title?: string;
  description?: string;
  column?: Column;
  order?: number;
}

export type NewTaskInput = {
  title: string;
  description: string;
};