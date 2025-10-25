export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoSort = 'created' | 'priority' | 'alphabetical';
