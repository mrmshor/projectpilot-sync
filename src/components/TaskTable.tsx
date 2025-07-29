import React, { useState, useCallback, useMemo } from 'react';
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

export const TaskTable = React.memo(({ tasks, onUpdateTask, onDeleteTask }: TaskTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  
  // פונקציית פתיחת תיקייה ישירה
  const openFolderHook = async (folderPath: string) => {
    try {
      console.log('openFolder called with path:', folderPath);
      
      if (!(window as any).electronAPI) {
        console.error('electronAPI not available');
        toast.error('❌ פתיחת תיקייה זמינה רק באפליקציית השולחן');
        return;
      }
      
      const result = await (window as any).electronAPI.openFolder(folderPath);
      console.log('openFolder result:', result);
      
      if (result && result.success) {
        toast.success(`✅ תיקיה נפתחה: ${folderPath}`);
      } else {
        console.error('openFolder failed:', result);
        toast.error('❌ שגיאה בפתיחת התיקייה');
      }
    } catch (error) {
      console.error('Error opening folder:', error);
      toast.error('❌ שגיאה בפתיחת התיקייה');
    }
  };

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const filteredTasks = useMemo(() => {
    const filtered = tasks.filter(task => {
      // Filter by search term
      const matchesSearch = task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.projectDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by priority
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesPriority;
    });

    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tasks, searchTerm, priorityFilter, sortField, sortDirection]);

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
  };

  const handleSave = () => {
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleFieldUpdate = useCallback((taskId: string, field: string, value: any) => {
    onUpdateTask(taskId, { [field]: value });
  }, [onUpdateTask]);

  const handleFolderSelect = async (taskId: string) => {
    try {
      if (!(window as any).electronAPI) {
        console.error('electronAPI not available');
        toast.error('❌ בחירת תיקייה זמינה רק באפליקציית השולחן');
        return;
      }
      
      const result = await (window as any).electronAPI.selectFolder();
      console.log('handleFolderSelect result:', result);
      
      if (result && result.success && result.path) {
        handleFieldUpdate(taskId, 'folderPath', result.path);
        toast.success(`✅ נבחרה תיקיה: ${result.path}`);
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      toast.error('❌ שגיאה בבחירת התיקייה');
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white border-0 font-medium shadow-md';
      case 'medium': return 'bg-orange-500 text-white border-0 font-medium shadow-md';
      case 'low': return 'bg-green-500 text-white border-0 font-medium shadow-md';
    }
  };

  const getStatusColor = (status: WorkStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white border-0 font-medium shadow-md';
      case 'in_progress': return 'bg-purple-500 text-white border-0 font-medium shadow-md';
      case 'review': return 'bg-blue-500 text-white border-0 font-medium shadow-md';
      case 'on_hold': return 'bg-yellow-500 text-white border-0 font-medium shadow-md';
      case 'not_started': return 'bg-gray-500 text-white border-0 font-medium shadow-md';
    }
  };

  // פונקציה מאוחדת לפתיחת תיקיות (מקומיות וקישורים)
  const openFolder = async (path?: string) => {
    if (!path) {
      return;
    }
    
    try {
      // אם זה קישור רשת - פתח ישירות
      if (path.startsWith('http') || path.startsWith('https://')) {
        window.open(path, '_blank');
        return;
      }
      
      // אם זה iCloud או קישור מיוחד
      if (path.startsWith('icloud://')) {
        window.open(path, '_blank');
        return;
      }
      
      // עבור נתיבים מקומיים - השתמש ב-hook שמטפל בהם נכון
      await openFolderHook(path);
      
    } catch (error) {
      console.error('Error opening folder:', error);
      toast.error(`❌ שגיאה בפתיחת התיקיה`);
    }
  };

  const makePhoneCall = (phone?: string) => {
    if (phone) {
      window.open(`tel:${phone}`);
    }
  };

  const sendWhatsApp = (phone?: string) => {
    if (phone) {
      // Clean phone number - remove all non-digit characters and ensure proper format
      const cleanNumber = phone.replace(/\D/g, '');
      // If number starts with 0, replace with 972, if starts with +972, remove +
      let formattedNumber = cleanNumber;
      if (cleanNumber.startsWith('0')) {
        formattedNumber = '972' + cleanNumber.substring(1);
      } else if (cleanNumber.startsWith('972')) {
        formattedNumber = cleanNumber;
      }
      const whatsappUrl = `https://wa.me/${formattedNumber}`;
      console.log('Opening WhatsApp with URL:', whatsappUrl);
      window.open(whatsappUrl, '_blank');
    }
  };

  const sendEmail = (email?: string) => {
    if (email) {
      window.open(`mailto:${email}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
          <Input
            placeholder="חפש פרויקטים, לקוחות או תיאורים..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 h-12 border-2 border-primary/20 focus:border-primary/40 bg-accent/5 shadow-soft"
            dir="rtl"
          />
        </div>
        <div className="w-48">
          <Select value={priorityFilter} onValueChange={(value: Priority | 'all') => setPriorityFilter(value)}>
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

      {/* Project Cards View */}
      <div className="space-y-6" dir="rtl">
        {filteredTasks.map((task) => (
          <Card key={task.id} data-project-id={task.id} className="mac-card hover-lift overflow-hidden">
            <CardContent className="p-0">
              {/* Project Header */}
              <div className="bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 p-6 border-b border-border/30">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Project Name */}
                    <div>
                      {editingId === task.id ? (
                        <Input
                          value={task.projectName}
                          onChange={(e) => handleFieldUpdate(task.id, 'projectName', e.target.value)}
                          className="text-2xl font-bold h-14 text-right"
                          dir="rtl"
                        />
                       ) : (
                         <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent drop-shadow-sm break-words text-right tracking-tight">{task.projectName}</h2>
                       )}
                    </div>

                    {/* Project Description */}
                    <div>
                      {editingId === task.id ? (
                        <Textarea
                          value={task.projectDescription}
                          onChange={(e) => handleFieldUpdate(task.id, 'projectDescription', e.target.value)}
                          rows={4}
                          className="w-full resize-none text-base min-h-[100px] text-right"
                          placeholder="תיאור הפרויקט..."
                          dir="rtl"
                        />
                      ) : (
                        <p className="text-base text-muted-foreground break-words whitespace-pre-wrap text-right leading-relaxed">
                          {task.projectDescription || 'אין תיאור'}
                        </p>
                      )}
                    </div>

                    {/* Folder Path */}
                    {(editingId === task.id || task.folderPath) && (
                      <div>
                        {editingId === task.id ? (
                          <Input
                            placeholder="נתיב תיקייה"
                            value={task.folderPath || ''}
                            onChange={(e) => handleFieldUpdate(task.id, 'folderPath', e.target.value)}
                            className="text-sm"
                            dir="rtl"
                          />
                        ) : task.folderPath ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openFolder(task.folderPath)}
                            className="text-sm text-primary hover:text-primary/80 flex items-center gap-2 p-2"
                          >
                            <FolderOpen className="h-4 w-4" />
                            פתח תיקייה
                          </Button>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {editingId === task.id ? (
                      <>
                        <Button size="sm" onClick={handleSave} className="gap-1">
                          <Save className="h-4 w-4" />
                          שמור
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel} className="gap-1">
                          <X className="h-4 w-4" />
                          ביטול
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(task)} className="gap-1">
                          <Edit3 className="h-4 w-4" />
                          ערוך
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => {
                            if (confirm('האם אתה בטוח שברצונך למחוק את הפרויקט?')) {
                              onDeleteTask(task.id);
                            }
                          }}
                          className="gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          מחק
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Details Grid */}
              <div className="bg-muted/20 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Tasks Section */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg p-4 border border-blue-300/30">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-blue-700 dark:text-blue-300">משימות</h3>
                    </div>
                    <TaskListDialog
                      tasks={task.tasks}
                      onUpdateTasks={(tasks) => handleFieldUpdate(task.id, 'tasks', tasks)}
                      projectName={task.projectName}
                    />
                  </div>

                  {/* Client Information */}
                  <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                    <h3 className="font-semibold text-foreground mb-3">פרטי לקוח</h3>
                    {editingId === task.id ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="שם הלקוח"
                          value={task.clientName}
                          onChange={(e) => handleFieldUpdate(task.id, 'clientName', e.target.value)}
                          className="text-sm"
                          dir="rtl"
                        />
                        <Input
                          placeholder="טלפון 1"
                          value={task.clientPhone || ''}
                          onChange={(e) => handleFieldUpdate(task.id, 'clientPhone', e.target.value)}
                          className="text-sm"
                          dir="rtl"
                        />
                        <Input
                          placeholder="טלפון 2"
                          value={task.clientPhone2 || ''}
                          onChange={(e) => handleFieldUpdate(task.id, 'clientPhone2', e.target.value)}
                          className="text-sm"
                          dir="rtl"
                        />
                        <Input
                          placeholder="וואטסאפ 1"
                          value={task.clientWhatsapp || ''}
                          onChange={(e) => handleFieldUpdate(task.id, 'clientWhatsapp', e.target.value)}
                          className="text-sm"
                          dir="rtl"
                        />
                        <Input
                          placeholder="וואטסאפ 2"
                          value={task.clientWhatsapp2 || ''}
                          onChange={(e) => handleFieldUpdate(task.id, 'clientWhatsapp2', e.target.value)}
                          className="text-sm"
                          dir="rtl"
                        />
                        <Input
                          placeholder="אימייל"
                          value={task.clientEmail || ''}
                          onChange={(e) => handleFieldUpdate(task.id, 'clientEmail', e.target.value)}
                          className="text-sm"
                          dir="rtl"
                         />
                         <div className="flex gap-2">
                           <Input
                             placeholder="קישור תיקיה (iCloud/URL)"
                             value={task.folderLink || ''}
                             onChange={(e) => handleFieldUpdate(task.id, 'folderLink', e.target.value)}
                             className="text-sm flex-1"
                             dir="rtl"
                           />
                           <Button 
                             type="button"
                             variant="outline"
                             size="sm"
                             onClick={() => handleFolderSelect(task.id)}
                             className="px-2 gap-1"
                           >
                             <FolderOpen className="h-3 w-3" />
                             בחר
                           </Button>
                         </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="font-medium text-sm">{task.clientName}</div>
                        
                        {/* Contact actions */}
                        <div className="flex flex-wrap gap-1">
                          {task.clientPhone && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => makePhoneCall(task.clientPhone)}
                              className="p-1 h-auto"
                              title={`טלפון 1: ${task.clientPhone}`}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          )}
                          {task.clientPhone2 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => makePhoneCall(task.clientPhone2)}
                              className="p-1 h-auto"
                              title={`טלפון 2: ${task.clientPhone2}`}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          )}
                          {task.clientWhatsapp && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => sendWhatsApp(task.clientWhatsapp)}
                              className="p-1 h-auto text-green-600"
                              title={`וואטסאפ 1: ${task.clientWhatsapp}`}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {task.clientWhatsapp2 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => sendWhatsApp(task.clientWhatsapp2)}
                              className="p-1 h-auto text-green-600"
                              title={`וואטסאפ 2: ${task.clientWhatsapp2}`}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {task.clientEmail && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => sendEmail(task.clientEmail)}
                              className="p-1 h-auto"
                              title={`אימייל: ${task.clientEmail}`}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                           {task.folderLink && (
                             <div className="flex gap-1">
                               <Button
                                 variant="ghost"
                                 size="sm"
                                  onClick={() => openFolder(task.folderLink)}
                                 className="p-1 h-auto text-blue-600"
                                 title={`קישור תיקיה: ${task.folderLink}`}
                               >
                                 <FolderOpen className="h-4 w-4" />
                               </Button>
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => openFolder(task.folderLink)}
                                 className="p-1 h-auto text-green-600"
                                 title={`פתח תיקיה: ${task.folderLink}`}
                               >
                                 <FolderOpen className="h-4 w-4" />
                               </Button>
                             </div>
                           )}
                        </div>

                        {/* Contact details */}
                        <div className="text-xs text-muted-foreground space-y-1">
                          {task.clientPhone && <div>📞 {task.clientPhone}</div>}
                          {task.clientPhone2 && <div>📞 {task.clientPhone2}</div>}
                          {task.clientWhatsapp && <div>💬 {task.clientWhatsapp}</div>}
                          {task.clientWhatsapp2 && <div>💬 {task.clientWhatsapp2}</div>}
                          {task.clientEmail && <div>✉️ {task.clientEmail}</div>}
                           {task.folderPath && (
                             <div className="flex items-center gap-1">
                               <FolderOpen className="h-3 w-3 text-green-600" />
                               <span className="text-green-600 cursor-pointer hover:underline" 
                                      onClick={() => openFolder(task.folderPath)}>
                                 תיקיה מקומית
                               </span>
                             </div>
                           )}
                           {task.folderLink && (
                             <div className="flex items-center gap-1">
                               <FolderOpen className="h-3 w-3 text-blue-600" />
                               <span className="text-blue-600 cursor-pointer hover:underline" 
                                     onClick={() => openFolder(task.folderLink)}>
                                 קישור תיקיה
                               </span>
                             </div>
                           )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status & Priority */}
                  <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                    <h3 className="font-semibold text-foreground mb-3">סטטוס ועדיפות</h3>
                    <div className="space-y-3">
                       {/* Work Status */}
                       <div>
                         <label className="text-sm font-semibold text-foreground mb-2 block">סטטוס עבודה</label>
                         <Select 
                           value={task.workStatus} 
                           onValueChange={(value) => handleFieldUpdate(task.id, 'workStatus', value)}
                         >
                           <SelectTrigger className={cn("text-sm border-0", getStatusColor(task.workStatus))}>
                             <SelectValue />
                           </SelectTrigger>
                          <SelectContent className="bg-background border border-border shadow-lg z-50">
                            {Object.entries(WORK_STATUS_LABELS).map(([value, label]) => (
                              <SelectItem 
                                key={value} 
                                value={value}
                                className={cn("cursor-pointer hover:opacity-80", getStatusColor(value as WorkStatus))}
                              >
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                       {/* Priority */}
                       <div>
                         <label className="text-sm font-semibold text-foreground mb-2 block">עדיפות</label>
                         <Select 
                           value={task.priority} 
                           onValueChange={(value) => handleFieldUpdate(task.id, 'priority', value)}
                         >
                           <SelectTrigger className={cn("text-sm border-0", getPriorityColor(task.priority))}>
                             <SelectValue />
                           </SelectTrigger>
                          <SelectContent className="bg-background border border-border shadow-lg z-50">
                            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                              <SelectItem 
                                key={value} 
                                value={value}
                                className={cn("cursor-pointer hover:opacity-80", getPriorityColor(value as Priority))}
                              >
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Price & Payment */}
                  <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                    <h3 className="font-semibold text-foreground mb-3">מחיר ותשלום</h3>
                    <div className="space-y-3">
                      {/* Price */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">מחיר</label>
                        {editingId === task.id ? (
                          <div className="flex gap-1">
                            <Select 
                              value={task.currency} 
                              onValueChange={(value) => handleFieldUpdate(task.id, 'currency', value)}
                            >
                              <SelectTrigger className="w-20 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CURRENCIES.map((currency) => (
                                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={task.price}
                              onChange={(e) => handleFieldUpdate(task.id, 'price', parseFloat(e.target.value) || 0)}
                              className="text-sm"
                            />
                          </div>
                        ) : (
                          <div className="text-lg font-semibold text-primary">
                            {task.price.toFixed(2)} {task.currency}
                          </div>
                        )}
                      </div>

                      {/* Payment Status */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {editingId === task.id ? (
                            <Checkbox
                              checked={task.isPaid}
                              onCheckedChange={(checked) => handleFieldUpdate(task.id, 'isPaid', checked)}
                            />
                          ) : (
                            <div className={cn(
                              "w-4 h-4 rounded border-2 flex items-center justify-center",
                              task.isPaid ? "bg-green-500 border-green-500" : "border-muted-foreground"
                            )}>
                              {task.isPaid && <div className="w-2 h-2 bg-white rounded-sm" />}
                            </div>
                          )}
                          <span className="text-sm">שולם</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {editingId === task.id ? (
                            <Checkbox
                              checked={task.isCompleted}
                              onCheckedChange={(checked) => handleFieldUpdate(task.id, 'isCompleted', checked)}
                            />
                          ) : (
                            <div className={cn(
                              "w-4 h-4 rounded border-2 flex items-center justify-center",
                              task.isCompleted ? "bg-green-500 border-green-500" : "border-muted-foreground"
                            )}>
                              {task.isCompleted && <div className="w-2 h-2 bg-white rounded-sm" />}
                            </div>
                          )}
                          <span className="text-sm">הושלם</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">אין פרויקטים</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'לא נמצאו פרויקטים התואמים לחיפוש' : 'התחל על ידי יצירת פרויקט חדש'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
