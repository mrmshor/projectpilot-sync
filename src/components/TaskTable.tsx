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
      case 'high': return 'bg-destructive/5 text-destructive border-0 font-medium';
      case 'medium': return 'bg-warning/5 text-warning border-0 font-medium';
      case 'low': return 'bg-success/5 text-success border-0 font-medium';
    }
  };

  const getStatusColor = (status: WorkStatus) => {
    switch (status) {
      case 'completed': return 'bg-success/5 text-success border-0 font-medium';
      case 'in_progress': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-0 font-medium';
      case 'review': return 'bg-info/5 text-info border-0 font-medium';
      case 'on_hold': return 'bg-warning/5 text-warning border-0 font-medium';
      case 'not_started': return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0 font-medium';
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
        <Input
          placeholder="חפש פרויקטים, לקוחות או תיאורים..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-4 h-12 border-2 border-primary/20 focus:border-primary/40 bg-accent/5 shadow-soft"
          dir="rtl"
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block" dir="rtl">
        <div className="mac-card overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 border-b-2 border-primary/20">
                  <tr>
                    <th className="text-right p-4 font-display font-semibold text-primary text-sm w-32 border-r border-border/30">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('projectName')} className="font-display text-sm text-primary hover:text-primary/80">
                        שם הפרויקט <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                     <th className="text-right p-4 font-display font-semibold text-primary text-sm w-40 border-r border-border/30">תיאור</th>
                     <th className="text-right p-4 font-display font-semibold text-white text-sm w-20 border-r border-border/30 bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">משימות</th>
                    <th className="text-right p-4 font-display font-semibold text-primary text-sm w-28 border-r border-border/30">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('clientName')} className="font-display text-sm text-primary hover:text-primary/80">
                        לקוח <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                    <th className="text-right p-4 font-display font-semibold text-primary text-sm w-36 border-r border-border/30">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('workStatus')} className="font-display text-sm text-primary hover:text-primary/80 w-full justify-center">
                        סטטוס <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                    <th className="text-right p-4 font-display font-semibold text-primary text-sm w-24 border-r border-border/30">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('priority')} className="font-display text-sm text-primary hover:text-primary/80">
                        עדיפות <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                    <th className="text-right p-4 font-display font-semibold text-primary text-sm w-24 border-r border-border/30">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('price')} className="font-display text-sm text-primary hover:text-primary/80">
                        מחיר <ArrowUpDown className="h-4 w-4 mr-1" />
                      </Button>
                    </th>
                    <th className="text-right p-4 font-display font-semibold text-primary text-sm w-20 border-r border-border/30">תשלום</th>
                    <th className="text-right p-4 font-display font-semibold text-primary text-sm w-20 border-r border-border/30">הושלם</th>
                    <th className="text-right p-4 font-display font-semibold text-primary text-sm w-24">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="border-t border-border/30 hover:bg-muted/30 transition-colors duration-200">
                      {/* Project Name */}
                      <td className="p-3 w-32">
                        {editingId === task.id ? (
                          <Input
                            value={task.projectName}
                            onChange={(e) => handleFieldUpdate(task.id, 'projectName', e.target.value)}
                            className="w-full text-xs"
                          />
                        ) : (
                          <div className="font-medium text-xs whitespace-nowrap overflow-hidden text-ellipsis" title={task.projectName}>{task.projectName}</div>
                        )}
                      </td>

                      {/* Description */}
                      <td className="p-3 w-40">
                        {editingId === task.id ? (
                          <div className="space-y-1">
                            <Textarea
                              value={task.projectDescription}
                              onChange={(e) => handleFieldUpdate(task.id, 'projectDescription', e.target.value)}
                              rows={2}
                              className="w-full resize-none text-xs"
                              placeholder="תיאור..."
                            />
                            <Input
                              placeholder="נתיב תיקייה"
                              value={task.folderPath || ''}
                              onChange={(e) => handleFieldUpdate(task.id, 'folderPath', e.target.value)}
                              className="w-full text-xs"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-xs whitespace-pre-wrap break-words line-clamp-2">
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
                       <td className="p-3 w-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-r border-border/30">
                         <TaskListDialog
                           tasks={task.tasks}
                           onUpdateTasks={(tasks) => handleFieldUpdate(task.id, 'tasks', tasks)}
                           projectName={task.projectName}
                         />
                       </td>

                       {/* Client */}
                       <td className="p-3 w-28">
                        {editingId === task.id ? (
                          <div className="space-y-1">
                            <Input
                              placeholder="שם הלקוח"
                              value={task.clientName}
                              onChange={(e) => handleFieldUpdate(task.id, 'clientName', e.target.value)}
                              className="text-xs"
                            />
                            <Input
                              placeholder="טלפון 1"
                              value={task.clientPhone || ''}
                              onChange={(e) => handleFieldUpdate(task.id, 'clientPhone', e.target.value)}
                              className="text-xs"
                            />
                            <Input
                              placeholder="טלפון 2"
                              value={task.clientPhone2 || ''}
                              onChange={(e) => handleFieldUpdate(task.id, 'clientPhone2', e.target.value)}
                              className="text-xs"
                            />
                            <Input
                              placeholder="וואטסאפ 1"
                              value={task.clientWhatsapp || ''}
                              onChange={(e) => handleFieldUpdate(task.id, 'clientWhatsapp', e.target.value)}
                              className="text-xs"
                            />
                            <Input
                              placeholder="וואטסאפ 2"
                              value={task.clientWhatsapp2 || ''}
                              onChange={(e) => handleFieldUpdate(task.id, 'clientWhatsapp2', e.target.value)}
                              className="text-xs"
                            />
                            <Input
                              placeholder="אימייל"
                              value={task.clientEmail || ''}
                              onChange={(e) => handleFieldUpdate(task.id, 'clientEmail', e.target.value)}
                              className="text-xs"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="font-medium text-xs whitespace-nowrap overflow-hidden text-ellipsis" title={task.clientName}>{task.clientName}</div>
                            <div className="flex flex-wrap gap-1">
                              {task.clientPhone && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => makePhoneCall(task.clientPhone)}
                                  className="p-1 h-auto"
                                  title="טלפון 1"
                                >
                                  <Phone className="h-3 w-3" />
                                </Button>
                              )}
                              {task.clientPhone2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => makePhoneCall(task.clientPhone2)}
                                  className="p-1 h-auto"
                                  title="טלפון 2"
                                >
                                  <Phone className="h-3 w-3 text-blue-600" />
                                </Button>
                              )}
                              {task.clientWhatsapp && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => sendWhatsApp(task.clientWhatsapp)}
                                  className="p-1 h-auto"
                                  title="וואטסאפ 1"
                                >
                                  <MessageCircle className="h-3 w-3 text-green-600" />
                                </Button>
                              )}
                              {task.clientWhatsapp2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => sendWhatsApp(task.clientWhatsapp2)}
                                  className="p-1 h-auto"
                                  title="וואטסאפ 2"
                                >
                                  <MessageCircle className="h-3 w-3 text-green-500" />
                                </Button>
                              )}
                              {task.clientPhone && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => sendWhatsApp(task.clientPhone)}
                                  className="p-1 h-auto"
                                  title="וואטסאפ טלפון 1"
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
                                  title="אימייל"
                                >
                                  <Mail className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Work Status */}
                      <td className="p-3 w-36">
                        <Select
                          value={task.workStatus}
                          onValueChange={(value) => handleFieldUpdate(task.id, 'workStatus', value)}
                        >
                          <SelectTrigger className="w-full h-8 border-0 bg-transparent min-w-32">
                            <SelectValue>
                              <div className={cn(getStatusColor(task.workStatus), "rounded-lg px-3 py-1 text-xs w-full text-center whitespace-nowrap")}>
                                {WORK_STATUS_LABELS[task.workStatus]}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="z-50 bg-background border shadow-lg min-w-32">
                            {Object.entries(WORK_STATUS_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                <Badge className={cn(getStatusColor(value as any), "rounded-md px-2 py-1 text-xs whitespace-nowrap")}>
                                  {label}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Priority */}
                      <td className="p-3 w-24">
                        <Select
                          value={task.priority}
                          onValueChange={(value) => handleFieldUpdate(task.id, 'priority', value)}
                        >
                          <SelectTrigger className="w-full h-8 border-0 bg-transparent">
                            <SelectValue>
                              <div className={cn(getPriorityColor(task.priority), "rounded-lg px-3 py-1 text-xs w-full text-center")}>
                                {PRIORITY_LABELS[task.priority]}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="z-50 bg-popover border shadow-lg">
                            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                <Badge className={cn(getPriorityColor(value as any), "rounded-md px-2 py-1 text-xs")}>
                                  {label}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Price */}
                      <td className="p-3 w-24">
                        {editingId === task.id ? (
                          <div className="space-y-1">
                            <Select
                              value={task.currency}
                              onValueChange={(value) => handleFieldUpdate(task.id, 'currency', value)}
                            >
                              <SelectTrigger className="w-full h-7 text-xs">
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
                              className="w-full text-xs"
                            />
                          </div>
                        ) : (
                          <div className="font-medium text-xs whitespace-nowrap">
                            {task.currency} {task.price.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Payment Status */}
                      <td className="p-3 w-20">
                        <div className="flex items-center gap-1">
                          <Checkbox
                            checked={task.isPaid}
                            onCheckedChange={(checked) => handleFieldUpdate(task.id, 'isPaid', checked)}
                          />
                           <span className={cn("text-xs font-medium whitespace-nowrap", task.isPaid ? "text-green-600" : "text-red-600")}>
                             {task.isPaid ? 'שולם' : 'לא שולם'}
                           </span>
                        </div>
                      </td>

                      {/* Completion Status */}
                      <td className="p-3 w-20">
                        <div className="flex items-center gap-1">
                          <Checkbox
                            checked={task.isCompleted}
                            onCheckedChange={(checked) => handleFieldUpdate(task.id, 'isCompleted', checked)}
                          />
                           <span className={cn("text-xs font-medium whitespace-nowrap", task.isCompleted ? "text-green-600" : "text-orange-600")}>
                             {task.isCompleted ? 'הושלם' : 'לא הושלם'}
                           </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3 w-24">
                        <div className="flex gap-1">
                          {editingId === task.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSave}
                                className="p-1 h-auto"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancel}
                                className="p-1 h-auto"
                              >
                                <X className="h-3 w-3" />
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
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1 h-auto text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
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
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4" dir="rtl">
        {filteredTasks.map((task) => (
          <div key={task.id} className="mac-card hover-lift p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-display text-lg font-semibold">{task.projectName}</h3>
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
                  className="p-1 h-auto text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
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
                    <span className={cn("text-xs", task.isPaid ? "text-success" : "text-destructive")}>
                      {task.isPaid ? 'שולם' : 'לא שולם'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Checkbox
                      checked={task.isCompleted}
                      onCheckedChange={(checked) => handleFieldUpdate(task.id, 'isCompleted', checked)}
                    />
                    <span className={cn("text-xs", task.isCompleted ? "text-success" : "text-warning")}>
                      {task.isCompleted ? 'הושלם' : 'לא הושלם'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="mac-card text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? 'אין משימות המתאימות לחיפוש.' : 'אין משימות עדיין. צור את הפרויקט הראשון שלך!'}
          </p>
        </div>
      )}
    </div>
  );
};