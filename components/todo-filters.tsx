'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, CheckCircle2, Circle, List } from 'lucide-react';
import { TodoFilter, TodoSort } from '@/types/todo';

interface TodoFiltersProps {
  filter: TodoFilter;
  sort: TodoSort;
  stats: { total: number; active: number; completed: number };
  onFilterChange: (filter: TodoFilter) => void;
  onSortChange: (sort: TodoSort) => void;
  onClearCompleted: () => void;
}

export function TodoFilters({
  filter,
  sort,
  stats,
  onFilterChange,
  onSortChange,
  onClearCompleted,
}: TodoFiltersProps) {
  const filterOptions: { value: TodoFilter; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All', icon: <List className="h-3 w-3 md:h-4 md:w-4" /> },
    { value: 'active', label: 'Active', icon: <Circle className="h-3 w-3 md:h-4 md:w-4" /> },
    {
      value: 'completed',
      label: 'Completed',
      icon: <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />,
    },
  ];

  const sortOptions: { value: TodoSort; label: string }[] = [
    { value: 'created', label: 'Date Created' },
    { value: 'priority', label: 'Priority' },
    { value: 'alphabetical', label: 'Alphabetical' },
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="text-base md:text-lg font-semibold text-white">
          Filters & Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <div className="text-center p-3 bg-white/10 rounded-lg border border-white/10">
            <div className="text-lg md:text-xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-blue-200">Total</div>
          </div>
          <div className="text-center p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
            <div className="text-lg md:text-xl font-bold text-blue-300">{stats.active}</div>
            <div className="text-xs text-blue-200">Active</div>
          </div>
          <div className="text-center p-3 bg-green-500/20 rounded-lg border border-green-400/30">
            <div className="text-lg md:text-xl font-bold text-green-300">{stats.completed}</div>
            <div className="text-xs text-green-200">Done</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-100">Show</label>
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange(option.value)}
                className="flex items-center justify-center gap-1 text-xs md:text-sm px-2 md:px-3 py-2 h-auto min-h-[44px] relative overflow-hidden"
              >
                <span className="shrink-0">{option.icon}</span>
                <span className="text-center leading-tight">{option.label}</span>
                {option.value === 'active' && stats.active > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs px-1 py-0 shrink-0">
                    {stats.active}
                  </Badge>
                )}
                {option.value === 'completed' && stats.completed > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs px-1 py-0 shrink-0">
                    {stats.completed}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-100">Sort by</label>
          <Select value={sort} onValueChange={(value: TodoSort) => onSortChange(value)}>
            <SelectTrigger className="text-sm bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-sm">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {sort === 'created' && (
            <p className="text-xs text-blue-200/60 flex items-center gap-1">
              <span>💡</span>
              Drag active tasks to reorder them
            </p>
          )}
        </div>

        {/* Clear Completed */}
        {stats.completed > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearCompleted}
            className="w-full text-destructive hover:text-destructive text-xs md:text-sm"
          >
            <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-2" />
            Clear Completed ({stats.completed})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
