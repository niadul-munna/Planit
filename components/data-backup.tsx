'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, Upload, Shield, AlertTriangle } from 'lucide-react';
import { useTodoStore } from '@/hooks/use-todo-store';

export function DataBackup() {
  const { allTodos } = useTodoStore();
  const [importing, setImporting] = useState(false);

  const exportData = () => {
    const data = {
      todos: allTodos,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planit-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (data.todos && Array.isArray(data.todos)) {
          // Clear existing data and import new data
          localStorage.setItem('todos', JSON.stringify(data.todos));
          window.location.reload(); // Reload to refresh the store
        } else {
          alert('Invalid backup file format');
        }
      } catch (error) {
        alert('Error reading backup file');
        console.error('Import error:', error);
      } finally {
        setImporting(false);
        event.target.value = ''; // Reset input
      }
    };

    reader.readAsText(file);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Data Backup
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="bg-amber-500/20 border border-amber-400/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-300 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-100">
              <p className="font-medium mb-1">Data Storage Notice</p>
              <p>
                Your tasks are stored locally in your browser. Regular backups are recommended for
                work data.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={exportData}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Backup ({allTodos.length} tasks)
          </Button>

          <div className="relative">
            <Input
              type="file"
              accept=".json"
              onChange={importData}
              disabled={importing}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Button
              variant="outline"
              className="w-full text-black border-white/20 hover:bg-white/10"
              size="sm"
              disabled={importing}
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? 'Importing...' : 'Import Backup'}
            </Button>
          </div>
        </div>

        <div className="text-xs text-blue-200/60 space-y-1">
          <p>• Export creates a JSON file with all your tasks</p>
          <p>• Import will replace all current tasks</p>
          <p>• Keep backups in cloud storage for safety</p>
        </div>
      </CardContent>
    </Card>
  );
}
