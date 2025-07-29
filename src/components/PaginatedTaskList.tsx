import React, { useState, useMemo, useCallback, memo } from 'react';
import { Task, Priority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { ProjectCard } from './ProjectCard';

interface PaginatedTaskListProps {
  tasks: Task[];
  filteredTasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  searchTerm: string;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const PaginatedTaskList = memo(({ 
  tasks, 
  filteredTasks, 
  onUpdateTask, 
  onDeleteTask, 
  searchTerm 
}: PaginatedTaskListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredTasks.length, searchTerm]);

  const { paginatedTasks, totalPages, startIndex, endIndex } = useMemo(() => {
    const total = Math.ceil(filteredTasks.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, filteredTasks.length);
    const paginated = filteredTasks.slice(start, end);

    return {
      paginatedTasks: paginated,
      totalPages: total,
      startIndex: start + 1,
      endIndex: end
    };
  }, [filteredTasks, currentPage, pageSize]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    // Scroll to top of list smoothly
    requestAnimationFrame(() => {
      const element = document.querySelector('[data-task-list]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, [totalPages]);

  const handlePageSizeChange = useCallback((newSize: string) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  }, []);

  const handleEdit = useCallback((taskId: string) => {
    setEditingId(taskId);
  }, []);

  const handleSave = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
  }, []);

  if (filteredTasks.length === 0) {
    if (searchTerm) {
      return (
        <div className="text-center py-12 animate-fade-in">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">אין תוצאות</h3>
          <p className="text-muted-foreground">לא נמצאו פרויקטים התואמים לחיפוש "{searchTerm}"</p>
        </div>
      );
    }
    
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">אין פרויקטים</h3>
        <p className="text-muted-foreground">התחל על ידי יצירת פרויקט חדש</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Info */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          מציג {startIndex}-{endIndex} מתוך {filteredTasks.length} פרויקטים
        </span>
        <div className="flex items-center gap-2">
          <span>פרויקטים בעמוד:</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map(size => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-6" dir="rtl" data-task-list>
        {paginatedTasks.map((task) => (
          <ProjectCard
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            isEditing={editingId === task.id}
            onEdit={() => handleEdit(task.id)}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {/* Show page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="h-8 w-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
});

PaginatedTaskList.displayName = 'PaginatedTaskList';