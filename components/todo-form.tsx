'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertCircle, Circle, Minus } from 'lucide-react';
import { Todo } from '@/types/todo';

interface TodoFormProps {
  onSubmit: (title: string, description?: string, priority?: Todo['priority']) => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('medium');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit(title, description || undefined, priority);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setIsExpanded(false);
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

  return (
    <Card className="w-full bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="text-base md:text-lg font-semibold text-white">
          Add New Todo
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-blue-100">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to done?"
              className="w-full text-sm md:text-base bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-blue-400 focus:ring-blue-400/20"
            />
          </div>

          {isExpanded && (
            <>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-blue-100">
                  Description (optional)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details..."
                  className="min-h-[60px] md:min-h-[80px] resize-none text-sm md:text-base bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-blue-100">Priority</Label>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {priorityOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant="secondary"
                      className={`cursor-pointer transition-colors text-xs md:text-sm px-2 py-1 ${
                        priority === option.value ? option.color : 'hover:bg-gray-200'
                      }`}
                      onClick={() => setPriority(option.value)}
                    >
                      {option.icon}
                      <span className="ml-1">{option.label}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              <Plus className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              Add Task
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm md:text-base bg-white/10 border-white/20 text-blue-100 hover:bg-white/20"
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
