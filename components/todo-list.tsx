'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableTodoItem } from './draggable-todo-item';
import { Todo } from '@/types/todo';
import { CheckCircle2, ListTodo } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
}

export function TodoList({ todos, onToggle, onUpdate, onDelete, onReorder }: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center px-4">
        <div className="rounded-full bg-white/10 p-4 md:p-6 mb-4">
          <ListTodo className="h-8 w-8 md:h-12 md:w-12 text-blue-200" />
        </div>
        <h3 className="text-base md:text-lg font-semibold mb-2 text-white">No tasks yet</h3>
        <p className="text-sm md:text-base text-blue-100/80 max-w-sm">
          Get started by adding your first task above. Stay organized and productive!
        </p>
      </div>
    );
  }

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Active Todos - Draggable */}
      {activeTodos.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={activeTodos.map((todo) => todo.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 md:space-y-3">
              {activeTodos.map((todo) => (
                <DraggableTodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Completed Todos - Non-draggable */}
      {completedTodos.length > 0 && (
        <div className="space-y-2 md:space-y-3">
          {activeTodos.length > 0 && (
            <div className="flex items-center gap-2 pt-3 md:pt-4 border-t border-white/10">
              <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
              <span className="text-sm font-medium text-blue-100/80">
                Completed ({completedTodos.length})
              </span>
            </div>
          )}
          {completedTodos.map((todo) => (
            <DraggableTodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isDragDisabled={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
