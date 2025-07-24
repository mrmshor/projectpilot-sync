import { useState } from 'react';
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
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskTableProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

type SortField = keyof Task;
type SortDirection = 'asc' | 'desc';

export const TaskTable = ({ tasks, onUpdateTask, onDeleteTask }: TaskTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredTasks = sortedTasks.filter(task =>
    task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.projectDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
  };

  const handleSave = () => {
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleFieldUpdate = (taskId: string, field: string, value: any) => {
    onUpdateTask(taskId, { [field]: value });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  const getStatusColor = (status: WorkStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'on_hold': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'not_started': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const openFolder = (path?: string) => {
    if (path) {
      // In a real app, this would use native file system APIs
      alert(`Would open folder: ${path}`);
    }
  };

  const makePhoneCall = (phone?: string) => {
    if (phone) {
      window.open(`tel:${phone}`);
    }
  };

  const sendWhatsApp = (phone?: string) => {
    if (phone) {
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}`);
    }
  };

  const sendEmail = (email?: string) => {
    if (email) {
      window.open(`mailto:${email}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="חפש פרויקטים, לקוחות או תיאורים..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
          dir="rtl"
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block" dir="rtl">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-right p-4 font-medium">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('projectName')}>
                        שם הפרויקט <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                     <th className="text-right p-4 font-medium">תיאור</th>
                     <th className="text-right p-4 font-medium">משימות</th>
                    <th className="text-right p-4 font-medium">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('clientName')}>
                        לקוח <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                    <th className="text-right p-4 font-medium">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('workStatus')}>
                        סטטוס <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                    <th className="text-right p-4 font-medium">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('priority')}>
                        עדיפות <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                    <th className="text-right p-4 font-medium">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('price')}>
                        מחיר <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                    <th className="text-right p-4 font-medium">תשלום</th>
                    <th className="text-right p-4 font-medium">הושלם</th>
                    <th className="text-right p-4 font-medium">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="border-t hover:bg-muted/25">
                      {/* Project Name */}
                      <td className="p-4">
                        {editingId === task.id ? (
                          <Input
                            value={task.projectName}
                            onChange={(e) => handleFieldUpdate(task.id, 'projectName', e.target.value)}
                            className="w-full"
                          />
                        ) : (
                          <div className="font-medium">{task.projectName}</div>
                        )}
                      </td>

                      {/* Description */}
                      <td className="p-4 max-w-xs">
                        {editingId === task.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={task.projectDescription}
                              onChange={(e) => handleFieldUpdate(task.id, 'projectDescription', e.target.value)}
                              rows={2}
                            />
                            <Input
                              placeholder="נתיב תיקייה (אופציונלי)"
                              value={task.folderPath || ''}
                              onChange={(e) => handleFieldUpdate(task.id, 'folderPath', e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-sm line-clamp-2">{task.projectDescription}</p>
                            {task.folderPath && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openFolder(task.folderPath)}
                                className="p-0 h-auto text-primary hover:text-primary/80"
                              >
                                <FolderOpen className="h-3 w-3 ml-1" />
                                פתח תיקייה
                              </Button>
                            )}
                          </div>
                        )}
                       </td>

                       {/* Tasks */}
                       <td className="p-4">
                         <TaskListDialog
                           tasks={task.tasks}
                           onUpdateTasks={(tasks) => handleFieldUpdate(task.id, 'tasks', tasks)}
                           projectName={task.projectName}
                         />
                       </td>

                       {/* Client */}
                      <td className="p-4">
                        {editingId === task.id ? (
                          <div className="space-y-2">
                            <Input
                              placeholder="שם הלקוח"
                              value={task.clientName}
                              onChange={(e) => handleFieldUpdate(task.id, 'clientName', e.target.value)}
                            />
                            <Input
                              placeholder="טלפון (אופציונלי)"
                              value={task.clientPhone || ''}
                              onChange={(e) => handleFieldUpdate(task.id, 'clientPhone', e.target.value)}
                            />
                            <Input
                              placeholder="אימייל (אופציונלי)"
                              value={task.clientEmail || ''}
                              onChange={(e) => handleFieldUpdate(task.id, 'clientEmail', e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="font-medium">{task.clientName}</div>
                            <div className="flex gap-1">
                              {task.clientPhone && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => makePhoneCall(task.clientPhone)}
                                  className="p-1 h-auto"
                                >
                                  <Phone className="h-3 w-3" />
                                </Button>
                              )}
                              {task.clientPhone && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => sendWhatsApp(task.clientPhone)}
                                  className="p-1 h-auto"
                                >
                                  <MessageCircle className="h-3 w-3" />
                                </Button>
                              )}
                              {task.clientEmail && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => sendEmail(task.clientEmail)}
                                  className="p-1 h-auto"
                                >
                                  <Mail className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Work Status */}
                      <td className="p-4">
                        {editingId === task.id ? (
                          <Select
                            value={task.workStatus}
                            onValueChange={(value) => handleFieldUpdate(task.id, 'workStatus', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(WORK_STATUS_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={getStatusColor(task.workStatus)}>
                            {WORK_STATUS_LABELS[task.workStatus]}
                          </Badge>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="p-4">
                        {editingId === task.id ? (
                          <Select
                            value={task.priority}
                            onValueChange={(value) => handleFieldUpdate(task.id, 'priority', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={getPriorityColor(task.priority)}>
                            {PRIORITY_LABELS[task.priority]}
                          </Badge>
                        )}
                      </td>

                      {/* Price */}
                      <td className="p-4">
                        {editingId === task.id ? (
                          <div className="flex gap-1">
                            <Select
                              value={task.currency}
                              onValueChange={(value) => handleFieldUpdate(task.id, 'currency', value)}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CURRENCIES.map((currency) => (
                                  <SelectItem key={currency} value={currency}>
                                    {currency}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              value={task.price}
                              onChange={(e) => handleFieldUpdate(task.id, 'price', parseFloat(e.target.value) || 0)}
                              className="w-24"
                            />
                          </div>
                        ) : (
                          <div className="font-medium">
                            {task.currency} {task.price.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Payment Status */}
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={task.isPaid}
                            onCheckedChange={(checked) => handleFieldUpdate(task.id, 'isPaid', checked)}
                          />
                          <span className={cn("text-sm", task.isPaid ? "text-green-600" : "text-red-600")}>
                            {task.isPaid ? 'שולם' : 'לא שולם'}
                          </span>
                        </div>
                      </td>

                      {/* Completion Status */}
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={task.isCompleted}
                            onCheckedChange={(checked) => handleFieldUpdate(task.id, 'isCompleted', checked)}
                          />
                          <span className={cn("text-sm", task.isCompleted ? "text-green-600" : "text-orange-600")}>
                            {task.isCompleted ? 'הושלם' : 'לא הושלם'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex gap-1">
                          {editingId === task.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSave}
                                className="p-1 h-auto"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancel}
                                className="p-1 h-auto"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(task)}
                                className="p-1 h-auto"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1 h-auto text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{task.projectName}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(task)}
                    className="p-1 h-auto"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 h-auto text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{task.projectDescription}</p>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">{task.clientName}</span>
                <div className="flex gap-1">
                  {task.clientPhone && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => makePhoneCall(task.clientPhone)}
                      className="p-1 h-auto"
                    >
                      <Phone className="h-3 w-3" />
                    </Button>
                  )}
                  {task.clientPhone && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendWhatsApp(task.clientPhone)}
                      className="p-1 h-auto"
                    >
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  )}
                  {task.clientEmail && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendEmail(task.clientEmail)}
                      className="p-1 h-auto"
                    >
                      <Mail className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(task.workStatus)}>
                  {WORK_STATUS_LABELS[task.workStatus]}
                </Badge>
                <Badge className={getPriorityColor(task.priority)}>
                  {PRIORITY_LABELS[task.priority]}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {task.currency} {task.price.toLocaleString()}
                </span>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-1">
                    <Checkbox
                      checked={task.isPaid}
                      onCheckedChange={(checked) => handleFieldUpdate(task.id, 'isPaid', checked)}
                    />
                    <span className={cn("text-xs", task.isPaid ? "text-green-600" : "text-red-600")}>
                      {task.isPaid ? 'שולם' : 'לא שולם'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Checkbox
                      checked={task.isCompleted}
                      onCheckedChange={(checked) => handleFieldUpdate(task.id, 'isCompleted', checked)}
                    />
                    <span className={cn("text-xs", task.isCompleted ? "text-green-600" : "text-orange-600")}>
                      {task.isCompleted ? 'הושלם' : 'לא הושלם'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? 'אין משימות המתאימות לחיפוש.' : 'אין משימות עדיין. צור את הפרויקט הראשון שלך!'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};