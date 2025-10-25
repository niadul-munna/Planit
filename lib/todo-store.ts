'use client';

import { Todo, TodoFilter, TodoSort } from '@/types/todo';

class TodoStore {
  private todos: Todo[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('todos', JSON.stringify(this.todos));
      // Auto-backup with timestamp (keep last 5 backups)
      this.createAutoBackup();
    }
  }

  private createAutoBackup() {
    if (typeof window !== 'undefined') {
      const backupKey = `todos_backup_${Date.now()}`;
      const backupData = {
        todos: this.todos,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(backupKey, JSON.stringify(backupData));

      // Clean old backups (keep only last 5)
      const allKeys = Object.keys(localStorage);
      const backupKeys = allKeys
        .filter(key => key.startsWith('todos_backup_'))
        .sort()
        .reverse();

      // Remove old backups beyond the 5 most recent
      backupKeys.slice(5).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('todos');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.todos = parsed.map((todo: Omit<Todo, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string }) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            updatedAt: new Date(todo.updatedAt),
          }));
        } catch (error) {
          console.error('Failed to load todos from storage:', error);
        }
      }
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getTodos() {
    return [...this.todos];
  }

  addTodo(title: string, description?: string, priority: Todo['priority'] = 'medium') {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim(),
      completed: false,
      priority,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.todos.unshift(todo);
    this.saveToStorage();
    this.notify();
    return todo;
  }

  updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;

    this.todos[index] = {
      ...this.todos[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.saveToStorage();
    this.notify();
    return this.todos[index];
  }

  deleteTodo(id: string) {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;

    this.todos.splice(index, 1);
    this.saveToStorage();
    this.notify();
    return true;
  }

  toggleTodo(id: string) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return null;

    return this.updateTodo(id, { completed: !todo.completed });
  }

  clearCompleted() {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter(todo => !todo.completed);

    if (this.todos.length !== initialLength) {
      this.saveToStorage();
      this.notify();
    }

    return initialLength - this.todos.length;
  }

  getFilteredTodos(filter: TodoFilter, sort: TodoSort = 'created') {
    let filtered = [...this.todos];

    // Apply filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      // 'all' shows everything
    }

    // Apply sort
    switch (sort) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1; // Completed items go to bottom
          }
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        break;
      case 'alphabetical':
        filtered.sort((a, b) => {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          return a.title.localeCompare(b.title);
        });
        break;
      case 'created':
      default:
        filtered.sort((a, b) => {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
        break;
    }

    return filtered;
  }

  reorderTodos(activeId: string, overId: string) {
    const oldIndex = this.todos.findIndex(todo => todo.id === activeId);
    const newIndex = this.todos.findIndex(todo => todo.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    // Create a new array with the reordered items
    const newTodos = [...this.todos];
    const [movedTodo] = newTodos.splice(oldIndex, 1);
    newTodos.splice(newIndex, 0, movedTodo);

    this.todos = newTodos;
    this.saveToStorage();
    this.notify();
  }

  getStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(todo => todo.completed).length;
    const active = total - completed;

    return { total, completed, active };
  }
}

export const todoStore = new TodoStore();
