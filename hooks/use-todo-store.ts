'use client';

import { useState, useEffect } from 'react';
import { todoStore } from '@/lib/todo-store';
import { Todo, TodoFilter, TodoSort } from '@/types/todo';

export function useTodoStore() {
  const [todos, setTodos] = useState<Todo[]>(() => todoStore.getTodos());
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sort, setSort] = useState<TodoSort>('created');

  useEffect(() => {
    const updateTodos = () => {
      setTodos(todoStore.getTodos());
    };

    const unsubscribe = todoStore.subscribe(updateTodos);

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredTodos = todoStore.getFilteredTodos(filter, sort);
  const stats = todoStore.getStats();

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    sort,
    stats,
    setFilter,
    setSort,
    addTodo: todoStore.addTodo.bind(todoStore),
    updateTodo: todoStore.updateTodo.bind(todoStore),
    deleteTodo: todoStore.deleteTodo.bind(todoStore),
    toggleTodo: todoStore.toggleTodo.bind(todoStore),
    clearCompleted: todoStore.clearCompleted.bind(todoStore),
    reorderTodos: todoStore.reorderTodos.bind(todoStore),
  };
}
