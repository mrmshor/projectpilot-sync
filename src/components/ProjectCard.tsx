import React, { useState, useCallback, memo } from 'react';
import { Task, WorkStatus, Priority, WORK_STATUS_LABELS, PRIORITY_LABELS } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Edit, 
  Save, 
  X, 
  Trash2, 
  Phone, 
  Mail, 
  MessageSquare, 
  FolderOpen,
  ExternalLink,
  Calendar,
  DollarSign,
  Flag,
  CheckCircle2,
  Circle,
  Clock
} from 'lucide-react';

interface ProjectCardProps {
  task: Task;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const priorityColors = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20'
};

const statusColors = {
  not_started: 'bg-muted/50 text-muted-foreground border-muted',
  in_progress: 'bg-info/10 text-info border-info/20',
  review: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-success/10 text-success border-success/20',
  on_hold: 'bg-warning/10 text-warning border-warning/20'
};

export const ProjectCard = memo(({ 
  task, 
  onUpdateTask, 
  onDeleteTask, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel 
}: ProjectCardProps) => {
  const [editData, setEditData] = useState<Partial<Task>>(task);

  const handleSave = useCallback(() => {
    onUpdateTask(task.id, editData);
    onSave();
  }, [task.id, editData, onUpdateTask, onSave]);

  const handleCancel = useCallback(() => {
    setEditData(task);
    onCancel();
  }, [task, onCancel]);

  const handleInputChange = useCallback((field: keyof Task, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleDelete = useCallback(() => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את הפרויקט "${task.projectName}"?`)) {
      onDeleteTask(task.id);
    }
  }, [task.id, task.projectName, onDeleteTask]);

  const handleFolderOpen = useCallback(() => {
    if (task.folderPath) {
      window.open(`folder://${task.folderPath}`, '_blank');
    }
  }, [task.folderPath]);

  const handleWhatsAppClick = useCallback((phone: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  }, []);

  const handlePhoneClick = useCallback((phone: string) => {
    window.open(`tel:${phone}`, '_blank');
  }, []);

  const handleEmailClick = useCallback((email: string) => {
    window.open(`mailto:${email}`, '_blank');
  }, []);

  const completedTasks = task.tasks.filter(t => t.isCompleted).length;
  const taskProgress = task.tasks.length > 0 ? (completedTasks / task.tasks.length) * 100 : 0;

  if (isEditing) {
    return (
      <Card className="border-primary/50 shadow-md mac-card" data-project-id={task.id}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-display">עריכת פרויקט</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="h-8 mac-button">
                <Save className="h-3 w-3 mr-1" />
                שמור
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="h-8">
                <X className="h-3 w-3 mr-1" />
                ביטול
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">שם הפרויקט</Label>
              <Input
                id="projectName"
                value={editData.projectName || ''}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="שם הפרויקט"
                className="mac-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">שם הלקוח</Label>
              <Input
                id="clientName"
                value={editData.clientName || ''}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="שם הלקוח"
                className="mac-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription">תיאור הפרויקט</Label>
            <Textarea
              id="projectDescription"
              value={editData.projectDescription || ''}
              onChange={(e) => handleInputChange('projectDescription', e.target.value)}
              placeholder="תיאור הפרויקט"
              rows={3}
              className="mac-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">מחיר</Label>
              <Input
                id="price"
                type="number"
                value={editData.price || 0}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                placeholder="מחיר"
                className="mac-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workStatus">סטטוס עבודה</Label>
              <Select value={editData.workStatus} onValueChange={(value) => handleInputChange('workStatus', value)}>
                <SelectTrigger className="mac-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(WORK_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">עדיפות</Label>
              <Select value={editData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger className="mac-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientPhone">טלפון</Label>
              <Input
                id="clientPhone"
                value={editData.clientPhone || ''}
                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                placeholder="מספר טלפון"
                className="mac-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">אימייל</Label>
              <Input
                id="clientEmail"
                value={editData.clientEmail || ''}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                placeholder="כתובת אימייל"
                className="mac-input"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="isCompleted"
                checked={editData.isCompleted || false}
                onCheckedChange={(checked) => handleInputChange('isCompleted', checked)}
              />
              <Label htmlFor="isCompleted">פרויקט הושלם</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="isPaid"
                checked={editData.isPaid || false}
                onCheckedChange={(checked) => handleInputChange('isPaid', checked)}
              />
              <Label htmlFor="isPaid">תשלום התקבל</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mac-card hover-lift press-scale transition-all duration-200 group" data-project-id={task.id}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl font-bold font-display gradient-text group-hover:text-primary transition-colors">
              {task.projectName}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-body">{task.clientName}</p>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="outline" onClick={onEdit} className="h-8 w-8 p-0 mac-button hover-lift">
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleDelete} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Description */}
        {task.projectDescription && (
          <p className="text-sm text-muted-foreground leading-relaxed font-body">
            {task.projectDescription}
          </p>
        )}

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={statusColors[task.workStatus]} variant="outline">
            {WORK_STATUS_LABELS[task.workStatus]}
          </Badge>
          
          <Badge className={priorityColors[task.priority]} variant="outline">
            <Flag className="h-3 w-3 mr-1" />
            {PRIORITY_LABELS[task.priority]}
          </Badge>

          <Badge variant={task.isCompleted ? "default" : "secondary"}>
            {task.isCompleted ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
            {task.isCompleted ? "הושלם" : "בתהליך"}
          </Badge>

          <Badge variant={task.isPaid ? "outline" : "destructive"}>
            <DollarSign className="h-3 w-3 mr-1" />
            {task.isPaid ? "שולם" : "לא שולם"}
          </Badge>
        </div>

        {/* Task Progress */}
        {task.tasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">התקדמות משימות</span>
              <span className="font-medium">{completedTasks}/{task.tasks.length}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${taskProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Client Contact Information */}
        {(task.clientPhone || task.clientWhatsapp || task.clientEmail) && (
          <div className="space-y-2 p-3 bg-gradient-muted rounded-lg border border-border/30">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">פרטי קשר</h4>
            <div className="flex flex-wrap gap-2">
              {task.clientPhone && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handlePhoneClick(task.clientPhone!)}
                  className="h-7 px-2 text-xs gap-1 hover-lift"
                >
                  <Phone className="h-3 w-3" />
                  {task.clientPhone}
                </Button>
              )}
              {task.clientWhatsapp && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleWhatsAppClick(task.clientWhatsapp!)}
                  className="h-7 px-2 text-xs gap-1 hover-lift text-green-600"
                >
                  <MessageSquare className="h-3 w-3" />
                  WhatsApp
                </Button>
              )}
              {task.clientEmail && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleEmailClick(task.clientEmail!)}
                  className="h-7 px-2 text-xs gap-1 hover-lift"
                >
                  <Mail className="h-3 w-3" />
                  {task.clientEmail}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Price and Details */}
        <div className="flex justify-between items-center pt-2 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {task.updatedAt.toLocaleDateString('he-IL')}
            </div>
            {task.folderPath && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleFolderOpen}
                className="h-6 px-2 text-xs hover-lift"
              >
                <FolderOpen className="h-3 w-3 mr-1" />
                פתח תיקייה
              </Button>
            )}
            {task.folderLink && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => window.open(task.folderLink, '_blank')}
                className="h-6 px-2 text-xs hover-lift"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                קישור
              </Button>
            )}
          </div>
          
          <div className="text-right">
            <span className="text-lg font-bold gradient-text">
              {task.price.toFixed(0)} {task.currency}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;