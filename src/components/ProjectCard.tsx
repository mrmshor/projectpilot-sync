import React, { useState, useCallback, memo } from 'react';
import { toast } from 'sonner';
import { Task, TaskItem, WorkStatus, Priority, WORK_STATUS_LABELS, PRIORITY_LABELS, CURRENCIES } from '@/types/task';
import { TaskListDialog } from '@/components/TaskListDialog';
import ProjectDetailModal from '@/components/ProjectDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  FolderOpen, 
  Trash2, 
  Edit3,
  Save,
  X,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  task: Task;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

const ProjectCard = memo(({ 
  task, 
  onUpdateTask, 
  onDeleteTask, 
  isEditing = false,
  onEdit,
  onSave,
  onCancel 
}: ProjectCardProps) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const handleFieldUpdate = useCallback((field: string, value: any) => {
    onUpdateTask(task.id, { [field]: value });
  }, [task.id, onUpdateTask]);

  const openFolder = useCallback(async (path?: string) => {
    if (!path) return;
    
    try {
      if (path.startsWith('http') || path.startsWith('https://') || path.startsWith('icloud://')) {
        window.open(path, '_blank');
        return;
      }
      
      if ((window as any).electronAPI) {
        const result = await (window as any).electronAPI.openFolder(path);
        if (result?.success) {
          toast.success(`✅ תיקיה נפתחה: ${path}`);
        } else {
          toast.error('❌ שגיאה בפתיחת התיקייה');
        }
      } else {
        toast.error('❌ פתיחת תיקייה זמינה רק באפליקציית השולחן');
      }
    } catch (error) {
      console.error('Error opening folder:', error);
      toast.error('❌ שגיאה בפתיחת התיקייה');
    }
  }, []);

  const handleFolderSelect = useCallback(async () => {
    try {
      if (!(window as any).electronAPI) {
        toast.error('❌ בחירת תיקייה זמינה רק באפליקציית השולחן');
        return;
      }
      
      const result = await (window as any).electronAPI.selectFolder();
      if (result?.success && result.path) {
        handleFieldUpdate('folderPath', result.path);
        toast.success(`✅ נבחרה תיקיה: ${result.path}`);
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      toast.error('❌ שגיאה בבחירת התיקייה');
    }
  }, [handleFieldUpdate]);

  const makePhoneCall = useCallback((phone?: string) => {
    if (phone) window.open(`tel:${phone}`);
  }, []);

  const sendWhatsApp = useCallback((phone?: string) => {
    if (phone) {
      const cleanNumber = phone.replace(/\D/g, '');
      let formattedNumber = cleanNumber;
      if (cleanNumber.startsWith('0')) {
        formattedNumber = '972' + cleanNumber.substring(1);
      } else if (cleanNumber.startsWith('972')) {
        formattedNumber = cleanNumber;
      }
      window.open(`https://wa.me/${formattedNumber}`, '_blank');
    }
  }, []);

  const sendEmail = useCallback((email?: string) => {
    if (email) window.open(`mailto:${email}`);
  }, []);

  const getPriorityColor = useCallback((priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white border-0 font-medium shadow-md';
      case 'medium': return 'bg-orange-500 text-white border-0 font-medium shadow-md';
      case 'low': return 'bg-green-500 text-white border-0 font-medium shadow-md';
    }
  }, []);

  const getStatusColor = useCallback((status: WorkStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white border-0 font-medium shadow-md';
      case 'in_progress': return 'bg-purple-500 text-white border-0 font-medium shadow-md';
      case 'review': return 'bg-blue-500 text-white border-0 font-medium shadow-md';
      case 'on_hold': return 'bg-yellow-500 text-white border-0 font-medium shadow-md';
      case 'not_started': return 'bg-gray-500 text-white border-0 font-medium shadow-md';
    }
  }, []);

  return (
    <Card 
      className="mac-card hover-lift overflow-hidden will-change-transform"
      data-project-id={task.id}
    >
      <CardContent className="p-0">
        {/* Project Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 p-6 border-b border-border/30">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-3">
              {/* Project Name */}
              <div>
                {isEditing ? (
                  <Input
                    value={task.projectName}
                    onChange={(e) => handleFieldUpdate('projectName', e.target.value)}
                    className="text-2xl font-bold h-14 text-right"
                    dir="rtl"
                  />
                ) : (
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent drop-shadow-sm break-words text-right tracking-tight">
                    {task.projectName}
                  </h2>
                )}
              </div>

              {/* Project Description */}
              <div>
                {isEditing ? (
                  <Textarea
                    value={task.projectDescription}
                    onChange={(e) => handleFieldUpdate('projectDescription', e.target.value)}
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
              {(isEditing || task.folderPath) && (
                <div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="נתיב תיקייה"
                        value={task.folderPath || ''}
                        onChange={(e) => handleFieldUpdate('folderPath', e.target.value)}
                        className="text-sm flex-1"
                        dir="rtl"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleFolderSelect}
                        className="whitespace-nowrap"
                      >
                        בחר תיקייה
                      </Button>
                    </div>
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
              {isEditing ? (
                <>
                  <Button size="sm" onClick={onSave} className="gap-1">
                    <Save className="h-4 w-4" />
                    שמור
                  </Button>
                  <Button size="sm" variant="outline" onClick={onCancel} className="gap-1">
                    <X className="h-4 w-4" />
                    ביטול
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" onClick={() => setShowDetailModal(true)} className="gap-1">
                    <Eye className="h-4 w-4" />
                    צפה
                  </Button>
                  <Button size="sm" variant="outline" onClick={onEdit} className="gap-1">
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
                onUpdateTasks={(tasks) => handleFieldUpdate('tasks', tasks)}
                projectName={task.projectName}
              />
            </div>

            {/* Client Information */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
              <h3 className="font-semibold text-foreground mb-3">פרטי לקוח</h3>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    placeholder="שם הלקוח"
                    value={task.clientName}
                    onChange={(e) => handleFieldUpdate('clientName', e.target.value)}
                    className="text-sm"
                    dir="rtl"
                  />
                  <Input
                    placeholder="טלפון 1"
                    value={task.clientPhone || ''}
                    onChange={(e) => handleFieldUpdate('clientPhone', e.target.value)}
                    className="text-sm"
                    dir="rtl"
                  />
                  <Input
                    placeholder="טלפון 2"
                    value={task.clientPhone2 || ''}
                    onChange={(e) => handleFieldUpdate('clientPhone2', e.target.value)}
                    className="text-sm"
                    dir="rtl"
                  />
                  <Input
                    placeholder="וואטסאפ 1"
                    value={task.clientWhatsapp || ''}
                    onChange={(e) => handleFieldUpdate('clientWhatsapp', e.target.value)}
                    className="text-sm"
                    dir="rtl"
                  />
                  <Input
                    placeholder="וואטסאפ 2"
                    value={task.clientWhatsapp2 || ''}
                    onChange={(e) => handleFieldUpdate('clientWhatsapp2', e.target.value)}
                    className="text-sm"
                    dir="rtl"
                  />
                  <Input
                    placeholder="אימייל"
                    value={task.clientEmail || ''}
                    onChange={(e) => handleFieldUpdate('clientEmail', e.target.value)}
                    className="text-sm"
                    dir="rtl"
                  />
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="font-medium text-foreground mb-2">{task.clientName}</div>
                  
                  {task.clientPhone && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => makePhoneCall(task.clientPhone)}
                        className="text-green-600 hover:text-green-700 p-1 h-auto"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <span className="text-muted-foreground">{task.clientPhone}</span>
                    </div>
                  )}

                  {task.clientWhatsapp && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendWhatsApp(task.clientWhatsapp)}
                        className="text-green-600 hover:text-green-700 p-1 h-auto"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <span className="text-muted-foreground">{task.clientWhatsapp}</span>
                    </div>
                  )}

                  {task.clientEmail && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendEmail(task.clientEmail)}
                        className="text-blue-600 hover:text-blue-700 p-1 h-auto"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <span className="text-muted-foreground text-xs break-all">{task.clientEmail}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Project Status & Priority */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
              <h3 className="font-semibold text-foreground mb-3">סטטוס ודחיפות</h3>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <Select
                      value={task.workStatus}
                      onValueChange={(value: WorkStatus) => handleFieldUpdate('workStatus', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(WORK_STATUS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={task.priority}
                      onValueChange={(value: Priority) => handleFieldUpdate('priority', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <>
                    <Badge className={getStatusColor(task.workStatus)}>
                      {WORK_STATUS_LABELS[task.workStatus]}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {PRIORITY_LABELS[task.priority]}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-lg p-4 border border-green-300/30">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3">מידע כספי</h3>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300 text-center">
                  {task.currency} {task.price.toFixed(0)}
                </div>
                <div className="flex justify-center">
                  <Badge 
                    variant={task.isPaid ? "default" : "destructive"}
                    className="text-sm font-medium"
                  >
                    {task.isPaid ? 'שולם' : 'לא שולם'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Project Detail Modal */}
      <ProjectDetailModal
        task={task}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
      />
    </Card>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;