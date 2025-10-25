'use client';

import { TodoForm } from './todo-form';
import { TodoList } from './todo-list';
import { TodoFilters } from './todo-filters';
import { PWAInstall } from './pwa-install';
import { ServiceWorkerRegistration } from './service-worker';
import { useTodoStore } from '@/hooks/use-todo-store';
import { CheckSquare } from 'lucide-react';

export function TodoApp() {
  const {
    todos,
    filter,
    sort,
    stats,
    setFilter,
    setSort,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    reorderTodos,
  } = useTodoStore();

  return (
    <>
      <ServiceWorkerRegistration />
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 smooth-scroll">
        <div className="container mx-auto px-4 py-6 max-w-7xl safe-area-inset">
          {/* Header */}
          <div className="text-center py-6 md:py-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <div className="p-3 md:p-4 bg-blue-500 rounded-2xl shadow-lg">
                <CheckSquare className="h-8 w-8 md:h-8 md:w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white">Planit</h1>
            </div>
            <p className="text-base md:text-xl text-blue-100 max-w-3xl mx-auto px-4 leading-relaxed">
              Stay organized and productive with our beautiful, feature-rich task application. Add,
              edit, prioritize, and track your tasks with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-4 md:space-y-6">
              <TodoForm onSubmit={addTodo} />
              <TodoFilters
                filter={filter}
                sort={sort}
                stats={stats}
                onFilterChange={setFilter}
                onSortChange={setSort}
                onClearCompleted={clearCompleted}
              />
            </div>

            {/* Main Content */}
            <div className="xl:col-span-3">
              <TodoList
                todos={todos}
                onToggle={toggleTodo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
                onReorder={reorderTodos}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center py-6 md:py-8 text-xs md:text-sm text-blue-300/60">
            <p>Built with Next.js, TypeScript, and Shadcn/ui</p>
          </footer>
        </div>
      </div>
      <PWAInstall />
    </>
  );
}
