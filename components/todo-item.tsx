'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, Edit3, Save, X, AlertCircle, Circle, Minus, Calendar } from 'lucide-react';
import { Todo } from '@/types/todo';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleSave = () => {
    if (!editTitle.trim()) return;

    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const priorityConfig = {
    low: {
      icon: <Minus className="h-3 w-3" />,
      color: 'bg-green-500/20 text-green-300 border-green-400/30',
      label: 'Low',
    },
    medium: {
      icon: <Circle className="h-3 w-3" />,
      color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
      label: 'Medium',
    },
    high: {
      icon: <AlertCircle className="h-3 w-3" />,
      color: 'bg-red-500/20 text-red-300 border-red-400/30',
      label: 'High',
    },
  };

  const priorityOptions: {
    value: Todo['priority'];
    label: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      value: 'low',
      label: 'Low',
      icon: <Minus className="h-3 w-3" />,
      color: 'bg-green-500/20 text-green-300 border-green-400/30 hover:bg-green-500/30',
    },
    {
      value: 'medium',
      label: 'Medium',
      icon: <Circle className="h-3 w-3" />,
      color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30 hover:bg-yellow-500/30',
    },
    {
      value: 'high',
      label: 'High',
      icon: <AlertCircle className="h-3 w-3" />,
      color: 'bg-red-500/20 text-red-300 border-red-400/30 hover:bg-red-500/30',
    },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-lg bg-white/10 backdrop-blur-md border-white/20 shadow-xl',
        todo.completed && 'opacity-60',
      )}
    >
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start gap-2 md:gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
            className="mt-1 shrink-0"
          />

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2 md:space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-medium text-sm md:text-base"
                  placeholder="Todo title"
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="min-h-[50px] md:min-h-[60px] resize-none text-sm md:text-base"
                />
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {priorityOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant="secondary"
                      className={`cursor-pointer transition-colors text-xs px-2 py-1 ${
                        editPriority === option.value ? option.color : 'hover:bg-gray-200'
                      }`}
                      onClick={() => setEditPriority(option.value)}
                    >
                      {option.icon}
                      <span className="ml-1">{option.label}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1 md:space-y-2">
                <div className="flex items-start gap-2 flex-wrap">
                  <h3
                    className={cn(
                      'font-medium text-sm md:text-base leading-relaxed flex-1 text-white',
                      todo.completed && 'line-through text-blue-200/60',
                    )}
                  >
                    {todo.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={cn('text-xs shrink-0', priorityConfig[todo.priority].color)}
                  >
                    {priorityConfig[todo.priority].icon}
                    <span className="ml-1">{priorityConfig[todo.priority].label}</span>
                  </Badge>
                </div>

                {todo.description && (
                  <p
                    className={cn(
                      'text-xs md:text-sm text-blue-100/80 leading-relaxed',
                      todo.completed && 'line-through text-blue-200/50',
                    )}
                  >
                    {todo.description}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-blue-200/60">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>Created {formatDate(todo.createdAt)}</span>
                  </div>
                  {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
                    <div className="sm:border-l sm:pl-4">Updated {formatDate(todo.updatedAt)}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  disabled={!editTitle.trim()}
                  className="h-8 w-8 p-0"
                >
                  <Save className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0">
                  <X className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  disabled={todo.completed}
                  className="h-8 w-8 p-0"
                >
                  <Edit3 className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-base md:text-lg">Delete Todo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete &ldquo;{todo.title}&rdquo;? This action
                        cannot be undone.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <DialogTrigger asChild>
                          <Button variant="outline" className="text-sm">
                            Cancel
                          </Button>
                        </DialogTrigger>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            onClick={() => onDelete(todo.id)}
                            className="text-sm"
                          >
                            Delete
                          </Button>
                        </DialogTrigger>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
