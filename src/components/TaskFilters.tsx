import React, { memo, useCallback } from 'react';
import { Priority } from '@/types/task';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface TaskFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  priorityFilter: Priority | 'all';
  onPriorityChange: (value: Priority | 'all') => void;
}

export const TaskFilters = memo(({ 
  searchTerm, 
  onSearchChange, 
  priorityFilter, 
  onPriorityChange 
}: TaskFiltersProps) => {
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card/50 rounded-lg border border-border/50 backdrop-blur-sm">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="חפש פרויקטים, לקוחות או תיאורים..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pr-10"
        />
      </div>
      
      <div className="flex items-center gap-2 min-w-fit">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={priorityFilter} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="סנן לפי עדיפות" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הרמות</SelectItem>
            <SelectItem value="low">עדיפות נמוכה</SelectItem>
            <SelectItem value="medium">עדיפות בינונית</SelectItem>
            <SelectItem value="high">עדיפות גבוהה</SelectItem>
            <SelectItem value="urgent">דחוף</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

TaskFilters.displayName = 'TaskFilters';
export default TaskFilters;