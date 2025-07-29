import React, { useState, useMemo, useCallback, memo } from 'react';
import { useLocalFolders } from '../../hooks/useLocalFolders';
import { toast } from 'sonner';
import { Task, TaskItem, WorkStatus, Priority, WORK_STATUS_LABELS, PRIORITY_LABELS, CURRENCIES } from '@/types/task';
import { TaskListDialog } from '@/components/TaskListDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  FolderOpen, 
  Trash2, 
  Edit3,
  Save,
  X,
  ArrowUpDown,
  Search,
  Filter
} from '@/lib/icons';
import { cn } from '@/lib/utils';
import { Capacitor } from '@capacitor/core';

interface OptimizedTaskTableProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

type SortField = keyof Task;
type SortDirection = 'asc' | 'desc';

// Memoized task row component
const TaskRow = memo(({ 
  task, 
  editingId, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  onUpdate,
  openFolder 
}: {
  task: Task;
  editingId: string | null;
  onEdit: (id: string) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, field: keyof Task, value: any) => void;
  openFolder: (path: string) => void;
}) => {
  const isEditing = editingId === task.id;

  const handleFieldUpdate = useCallback((field: keyof Task, value: any) => {
    onUpdate(task.id, field, value);
  }, [task.id, onUpdate]);

  const handleEdit = useCallback(() => onEdit(task.id), [task.id, onEdit]);
  const handleSave = useCallback(() => onSave(task.id), [task.id, onSave]);
  const handleDelete = useCallback(() => onDelete(task.id), [task.id, onDelete]);
  const handleOpenFolder = useCallback(() => openFolder(task.folderPath), [task.folderPath, openFolder]);

  return (
    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
      <td className="p-3">
        <Checkbox
          checked={task.isCompleted}
          onCheckedChange={(checked) => handleFieldUpdate('isCompleted', checked)}
          className="apple-checkbox"
        />
      </td>
      
      <td className="p-3 font-medium text-right">
        {isEditing ? (
          <Input
            value={task.projectName}
            onChange={(e) => handleFieldUpdate('projectName', e.target.value)}
            className="h-8 text-right"
            dir="rtl"
          />
        ) : (
          <div className="text-right" dir="rtl">{task.projectName}</div>
        )}
      </td>
      
      <td className="p-3 text-right">
        {isEditing ? (
          <Input
            value={task.clientName}
            onChange={(e) => handleFieldUpdate('clientName', e.target.value)}
            className="h-8 text-right"
            dir="rtl"
          />
        ) : (
          <div className="text-right" dir="rtl">{task.clientName}</div>
        )}
      </td>
      
      <td className="p-3 text-right">
        {isEditing ? (
          <Textarea
            value={task.projectDescription || ''}
            onChange={(e) => handleFieldUpdate('projectDescription', e.target.value)}
            className="min-h-[60px] text-right resize-none"
            dir="rtl"
          />
        ) : (
          <div className="text-right max-w-xs truncate" dir="rtl" title={task.projectDescription}>
            {task.projectDescription}
          </div>
        )}
      </td>
      
      <td className="p-3">
        <div className="flex gap-2 justify-center">
          {task.phoneNumber && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`tel:${task.phoneNumber}`, '_self')}
              className="h-8 w-8 p-0 apple-button apple-hover"
              title={`התקשר ל-${task.phoneNumber}`}
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}
          {task.whatsappNumber && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`https://wa.me/${task.whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank')}
              className="h-8 w-8 p-0 apple-button apple-hover"
              title={`WhatsApp ל-${task.whatsappNumber}`}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          )}
          {task.email && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`mailto:${task.email}`, '_self')}
              className="h-8 w-8 p-0 apple-button apple-hover"
              title={`שלח מייל ל-${task.email}`}
            >
              <Mail className="h-4 w-4" />
            </Button>
          )}
          {task.folderPath && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenFolder}
              className="h-8 w-8 p-0 apple-button apple-hover"
              title="פתח תיקייה"
            >
              <FolderOpen className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
      
      <td className="p-3">
        <div className="flex gap-2 justify-center">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-8 w-8 p-0 apple-button text-green-600 hover:bg-green-50"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-8 w-8 p-0 apple-button text-gray-600 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 w-8 p-0 apple-button apple-hover"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 apple-button text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
});

TaskRow.displayName = 'TaskRow';

export const OptimizedTaskTable = memo(({ tasks, onUpdateTask, onDeleteTask }: OptimizedTaskTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  
  const { openFolder: openFolderHook } = useLocalFolders();

  // Memoized filtered and sorted tasks
  const processedTasks = useMemo(() => {
    let filtered = tasks;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.projectName.toLowerCase().includes(searchLower) ||
        task.clientName.toLowerCase().includes(searchLower) ||
        task.projectDescription?.toLowerCase().includes(searchLower)
      );
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [tasks, searchTerm, priorityFilter, sortField, sortDirection]);

  // Memoized callbacks
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleEdit = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  const handleSave = useCallback((id: string) => {
    setEditingId(null);
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleUpdate = useCallback((id: string, field: keyof Task, value: any) => {
    onUpdateTask(id, { [field]: value });
  }, [onUpdateTask]);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את המשימה?')) {
      onDeleteTask(id);
    }
  }, [onDeleteTask]);

  const openFolder = useCallback((path: string) => {
    if (!path) {
      toast.error('לא נמצא נתיב לתיקייה');
      return;
    }
    
    if (Capacitor.isNativePlatform()) {
      openFolderHook(path);
    } else {
      window.open(`folder://${path}`, '_blank');
    }
  }, [openFolderHook]);

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex gap-4 items-center justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="חיפוש משימות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-right"
              dir="rtl"
            />
          </div>
          <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Priority | 'all')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל העדיפויות</SelectItem>
              <SelectItem value="high">גבוהה</SelectItem>
              <SelectItem value="medium">בינונית</SelectItem>
              <SelectItem value="low">נמוכה</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {processedTasks.length} מתוך {tasks.length} משימות
        </div>
      </div>

      {/* Table */}
      <div className="apple-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-right font-medium">
                  <div className="flex items-center justify-center">
                    <Checkbox className="apple-checkbox" />
                  </div>
                </th>
                <th className="p-3 text-right font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('projectName')}
                    className="font-medium hover:bg-transparent"
                  >
                    שם הפרויקט
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="p-3 text-right font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('clientName')}
                    className="font-medium hover:bg-transparent"
                  >
                    שם הלקוח
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="p-3 text-right font-medium">תיאור</th>
                <th className="p-3 text-center font-medium">פעולות תקשורת</th>
                <th className="p-3 text-center font-medium">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {processedTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  editingId={editingId}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  openFolder={openFolder}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

OptimizedTaskTable.displayName = 'OptimizedTaskTable';