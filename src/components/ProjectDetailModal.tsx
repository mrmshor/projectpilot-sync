import React, { memo } from 'react';
import { Task } from '@/types/task';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  FolderOpen,
  Calendar,
  DollarSign,
  User,
  Briefcase
} from 'lucide-react';
import { WORK_STATUS_LABELS, PRIORITY_LABELS } from '@/types/task';

interface ProjectDetailModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectDetailModal = memo(({ task, open, onOpenChange }: ProjectDetailModalProps) => {
  if (!task) return null;

  const makePhoneCall = (phone?: string) => {
    if (phone) window.open(`tel:${phone}`);
  };

  const sendWhatsApp = (phone?: string) => {
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
  };

  const sendEmail = (email?: string) => {
    if (email) window.open(`mailto:${email}`);
  };

  const openFolder = async (path?: string) => {
    if (!path) return;
    
    try {
      if (path.startsWith('http') || path.startsWith('https://') || path.startsWith('icloud://')) {
        window.open(path, '_blank');
        return;
      }
      
      if ((window as any).electronAPI) {
        const result = await (window as any).electronAPI.openFolder(path);
        if (!result?.success) {
          console.error('Failed to open folder');
        }
      }
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'in_progress': return 'bg-purple-500 text-white';
      case 'review': return 'bg-blue-500 text-white';
      case 'on_hold': return 'bg-yellow-500 text-white';
      case 'not_started': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {task.projectName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">פרטי הפרויקט</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                {task.projectDescription || 'אין תיאור זמין'}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(task.workStatus)}>
                  {WORK_STATUS_LABELS[task.workStatus]}
                </Badge>
                <Badge className={getPriorityColor(task.priority)}>
                  {PRIORITY_LABELS[task.priority]}
                </Badge>
                {task.isCompleted && (
                  <Badge variant="default">הושלם</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">פרטי הלקוח</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-lg mb-2">{task.clientName}</p>
                
                <div className="space-y-2">
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
                      <span className="text-sm">{task.clientPhone}</span>
                    </div>
                  )}

                  {task.clientPhone2 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => makePhoneCall(task.clientPhone2)}
                        className="text-green-600 hover:text-green-700 p-1 h-auto"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">{task.clientPhone2}</span>
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
                      <span className="text-sm">{task.clientWhatsapp}</span>
                    </div>
                  )}

                  {task.clientWhatsapp2 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendWhatsApp(task.clientWhatsapp2)}
                        className="text-green-600 hover:text-green-700 p-1 h-auto"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">{task.clientWhatsapp2}</span>
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
                      <span className="text-sm break-all">{task.clientEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">מידע כספי</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">
                {task.currency} {task.price.toFixed(0)}
              </div>
              <Badge variant={task.isPaid ? "default" : "destructive"}>
                {task.isPaid ? 'שולם' : 'לא שולם'}
              </Badge>
            </div>
          </div>

          {/* Folder Access */}
          {task.folderPath && (
            <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FolderOpen className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">קבצים ותיקיות</h3>
              </div>
              
              <Button
                onClick={() => openFolder(task.folderPath)}
                className="gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                פתח תיקיית הפרויקט
              </Button>
            </div>
          )}

          {/* Tasks */}
          {task.tasks && task.tasks.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">משימות הפרויקט</h3>
              
              <div className="space-y-2">
                {task.tasks.map((taskItem, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-background rounded border">
                    <input 
                      type="checkbox" 
                      checked={taskItem.isCompleted} 
                      readOnly 
                      className="rounded"
                    />
                    <span className={taskItem.isCompleted ? 'line-through text-muted-foreground' : ''}>
                      {taskItem.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="bg-gradient-to-r from-gray-500/10 to-gray-500/5 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold">תאריכים</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">נוצר: </span>
                <span className="text-muted-foreground">
                  {task.createdAt.toLocaleDateString('he-IL')}
                </span>
              </div>
              <div>
                <span className="font-medium">עודכן: </span>
                <span className="text-muted-foreground">
                  {task.updatedAt.toLocaleDateString('he-IL')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ProjectDetailModal.displayName = 'ProjectDetailModal';

export default ProjectDetailModal;