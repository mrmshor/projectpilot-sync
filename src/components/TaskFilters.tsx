import React, { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Priority } from '@/types/task';
import { Search, Filter } from 'lucide-react';

interface TaskFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  priorityFilter: Priority | 'all';
  onPriorityChange: (value: Priority | 'all') => void;
}

const TaskFilters = memo(({ 
  searchTerm, 
  onSearchChange, 
  priorityFilter, 
  onPriorityChange 
}: TaskFiltersProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
        <Input
          placeholder="חפש פרויקטים, לקוחות או תיאורים..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-4 h-12 border-2 border-primary/20 focus:border-primary/40 bg-accent/5 shadow-soft"
          dir="rtl"
        />
      </div>
      <div className="w-48">
        <Select value={priorityFilter} onValueChange={onPriorityChange}>
          <SelectTrigger className="h-12">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="סנן לפי דחיפות" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הדחיפויות</SelectItem>
            <SelectItem value="high">גבוהה</SelectItem>
            <SelectItem value="medium">בינונית</SelectItem>
            <SelectItem value="low">נמוכה</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

TaskFilters.displayName = 'TaskFilters';

export default TaskFilters;