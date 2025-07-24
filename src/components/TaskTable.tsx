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
import { Capacitor } from '@capacitor/core';

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
      case 'high': return 'bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-300 border border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300 border border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300 border border-green-500/20';
    }
  };

  const getStatusColor = (status: WorkStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300 border border-green-500/20';
      case 'in_progress': return 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/20';
      case 'review': return 'bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-500/20';
      case 'on_hold': return 'bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border border-orange-500/20';
      case 'not_started': return 'bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300 border border-gray-500/20';
    }
  };

  const openFolder = async (path?: string) => {
    if (path) {
      if (Capacitor.isNativePlatform()) {
        try {
          // In native app, try to open folder using system shell
          if (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android') {
            // For mobile, just show the path (folders don't work the same way)
            alert(`📁 נתיב התיקייה: ${path}\n\n💡 במובייל, נתיבי תיקיות פועלים שונה מאשר במחשב`);
          } else {
            // For desktop/electron, can potentially open folders
            alert(`📁 נתיב התיקייה: ${path}\n\n💡 באפליקציה מקורית, פתיחת תיקיות תתאפשר בעדכון עתידי`);
          }
        } catch (error) {
          console.error('Error opening folder:', error);
          alert(`❌ שגיאה בפתיחת התיקייה: ${path}`);
        }
      } else {
        // Web version - copy to clipboard with instructions
        try {
          await navigator.clipboard.writeText(path);
          const isWindows = navigator.userAgent.includes('Windows');
          const isMac = navigator.userAgent.includes('Mac');
          
          let instruction = '';
          if (isWindows) {
            instruction = 'לחץ Win+R, הדבק הנתיב ולחץ Enter';
          } else if (isMac) {
            instruction = 'לחץ Cmd+Shift+G ב-Finder, הדבק הנתיב ולחץ Enter';
          } else {
            instruction = 'פתח את מנהל הקבצים והדבק את הנתיב';
          }
          
          alert(`✅ נתיב התיקייה הועתק ללוח!\n\n📁 ${path}\n\n💡 ${instruction}\n\n🔧 לפתיחה אוטומטית של תיקיות, השתמש באפליקציה המקורית`);
        } catch (error) {
          alert(`📁 נתיב התיקייה: ${path}\n\n💡 העתק את הנתיב ופתח אותו במנהל הקבצים שלך`);
        }
      }
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
              <table className="w-full table-fixed">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-right p-4 font-medium w-[140px]">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('projectName')}>
                        שם הפרויקט <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                     <th className="text-right p-4 font-medium w-[200px]">תיאור</th>
                     <th className="text-right p-4 font-medium w-[100px]">משימות</th>
                    <th className="text-right p-4 font-medium w-[140px]">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('clientName')}>
                        לקוח <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                    <th className="text-right p-4 font-medium w-[130px]">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('workStatus')}>
                        סטטוס <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                    <th className="text-right p-4 font-medium w-[110px]">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('priority')}>
                        עדיפות <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                    <th className="text-right p-4 font-medium w-[120px]">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('price')}>
                        מחיר <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                    <th className="text-right p-4 font-medium w-[100px]">תשלום</th>
                    <th className="text-right p-4 font-medium w-[100px]">הושלם</th>
                    <th className="text-right p-4 font-medium w-[100px]">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="border-t hover:bg-muted/25">
                      {/* Project Name */}
                      <td className="p-4 w-[140px]">
                        {editingId === task.id ? (
                          <Input
                            value={task.projectName}
                            onChange={(e) => handleFieldUpdate(task.id, 'projectName', e.target.value)}
                            className="w-full"
                          />
                        ) : (
                          <div className="font-medium truncate" title={task.projectName}>{task.projectName}</div>
                        )}
                      </td>

                      {/* Description */}
                      <td className="p-4 w-[200px]">
                        {editingId === task.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={task.projectDescription}
                              onChange={(e) => handleFieldUpdate(task.id, 'projectDescription', e.target.value)}
                              rows={3}
                              className="w-full resize-none"
                              placeholder="תיאור הפרויקט..."
                            />
                            <Input
                              placeholder="נתיב תיקייה (אופציונלי)"
                              value={task.folderPath || ''}
                              onChange={(e) => handleFieldUpdate(task.id, 'folderPath', e.target.value)}
                              className="w-full"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {task.projectDescription || 'אין תיאור'}
                            </p>
                            {task.folderPath && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openFolder(task.folderPath)}
                                className="p-1 h-auto text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                              >
                                <FolderOpen className="h-3 w-3" />
                                תיקייה
                              </Button>
                            )}
                          </div>
                        )}
                       </td>

                       {/* Tasks */}
                       <td className="p-4 w-[100px]">
                         <TaskListDialog
                           tasks={task.tasks}
                           onUpdateTasks={(tasks) => handleFieldUpdate(task.id, 'tasks', tasks)}
                           projectName={task.projectName}
                         />
                       </td>

                       {/* Client */}
                      <td className="p-4 w-[140px]">
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
                      <td className="p-4 w-[130px]">
                        <Select
                          value={task.workStatus}
                          onValueChange={(value) => handleFieldUpdate(task.id, 'workStatus', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              <Badge className={cn(getStatusColor(task.workStatus), "rounded-md px-3 py-1")}>
                                {WORK_STATUS_LABELS[task.workStatus]}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="z-50 bg-popover border shadow-lg">
                            {Object.entries(WORK_STATUS_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                <Badge className={cn(getStatusColor(value as any), "rounded-md px-3 py-1")}>
                                  {label}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Priority */}
                      <td className="p-4 w-[110px]">
                        <Select
                          value={task.priority}
                          onValueChange={(value) => handleFieldUpdate(task.id, 'priority', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              <Badge className={cn(getPriorityColor(task.priority), "rounded-md px-3 py-1")}>
                                {PRIORITY_LABELS[task.priority]}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="z-50 bg-popover border shadow-lg">
                            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                <Badge className={cn(getPriorityColor(value as any), "rounded-md px-3 py-1")}>
                                  {label}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Price */}
                      <td className="p-4 w-[120px]">
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
                      <td className="p-4 w-[100px]">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={task.isPaid}
                            onCheckedChange={(checked) => handleFieldUpdate(task.id, 'isPaid', checked)}
                          />
                          <span className={cn("text-sm font-medium", task.isPaid ? "text-green-600" : "text-red-600")}>
                            {task.isPaid ? 'שולם' : 'לא שולם'}
                          </span>
                        </div>
                      </td>

                      {/* Completion Status */}
                      <td className="p-4 w-[100px]">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={task.isCompleted}
                            onCheckedChange={(checked) => handleFieldUpdate(task.id, 'isCompleted', checked)}
                          />
                          <span className={cn("text-sm font-medium", task.isCompleted ? "text-green-600" : "text-orange-600")}>
                            {task.isCompleted ? 'הושלם' : 'לא הושלם'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 w-[100px]">
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