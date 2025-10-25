'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TodoItem } from './todo-item';
import { Todo } from '@/types/todo';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableTodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  isDragDisabled?: boolean;
}

export function DraggableTodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
  isDragDisabled = false,
}: DraggableTodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
    disabled: isDragDisabled || todo.completed,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group',
        isDragging && 'z-50 rotate-3 scale-105',
        (isDragDisabled || todo.completed) && 'cursor-default',
      )}
    >
      {/* Drag Handle */}
      {!isDragDisabled && !todo.completed && (
        <div
          {...attributes}
          {...listeners}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-white/10 hover:bg-white/20"
        >
          <GripVertical className="h-4 w-4 text-blue-200" />
        </div>
      )}

      {/* Todo Item with padding for drag handle */}
      <div className={cn(!isDragDisabled && !todo.completed && 'pl-8')}>
        <TodoItem todo={todo} onToggle={onToggle} onUpdate={onUpdate} onDelete={onDelete} />
      </div>
    </div>
  );
}
