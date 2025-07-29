import React, { memo, useCallback } from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit3, 
  Trash2, 
  Phone, 
  MessageCircle, 
  Mail, 
  FolderOpen 
} from 'lucide-react';

interface OptimizedTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

// Memoized status badge to prevent unnecessary re-renders
const StatusBadge = memo(({ isCompleted, status }: { isCompleted: boolean; status: string }) => (
  <Badge variant={isCompleted ? 'default' : 'secondary'} className="text-xs">
    {isCompleted ? 'הושלם' : status}
  </Badge>
));

// Memoized priority badge
const PriorityBadge = memo(({ priority }: { priority: string }) => {
  const colorClass = priority === 'high' ? 'status-high' : 
                    priority === 'medium' ? 'status-medium' : 'status-low';
  
  return (
    <span className={`px-2 py-1 text-xs rounded ${colorClass}`}>
      {priority === 'high' ? 'דחוף' : priority === 'medium' ? 'רגיל' : 'נמוך'}
    </span>
  );
});

// Memoized contact actions
const ContactActions = memo(({ 
  phone, 
  whatsapp, 
  email, 
  folderLink 
}: { 
  phone?: string; 
  whatsapp?: string; 
  email?: string; 
  folderLink?: string; 
}) => {
  const makeCall = useCallback((phoneNumber?: string) => {
    if (phoneNumber) window.open(`tel:${phoneNumber}`);
  }, []);

  const sendWhatsApp = useCallback((phoneNumber?: string) => {
    if (phoneNumber) {
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      const formattedNumber = cleanNumber.startsWith('0') ? 
        '972' + cleanNumber.substring(1) : cleanNumber;
      window.open(`https://wa.me/${formattedNumber}`, '_blank');
    }
  }, []);

  const sendEmail = useCallback((emailAddress?: string) => {
    if (emailAddress) window.open(`mailto:${emailAddress}`);
  }, []);

  const openFolder = useCallback((path?: string) => {
    if (path) {
      if (path.startsWith('http')) {
        window.open(path, '_blank');
      }
    }
  }, []);

  return (
    <div className="clean-flex">
      {phone && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => makeCall(phone)}
          className="p-1 h-auto"
          title={`טלפון: ${phone}`}
        >
          <Phone className="h-3 w-3" />
        </Button>
      )}
      {whatsapp && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => sendWhatsApp(whatsapp)}
          className="p-1 h-auto text-green-600"
          title={`וואטסאפ: ${whatsapp}`}
        >
          <MessageCircle className="h-3 w-3" />
        </Button>
      )}
      {email && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => sendEmail(email)}
          className="p-1 h-auto"
          title={`אימייל: ${email}`}
        >
          <Mail className="h-3 w-3" />
        </Button>
      )}
      {folderLink && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openFolder(folderLink)}
          className="p-1 h-auto text-blue-600"
          title={`תיקייה: ${folderLink}`}
        >
          <FolderOpen className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
});

export const OptimizedTaskCard = memo(({ 
  task, 
  onEdit, 
  onDelete, 
  onUpdate 
}: OptimizedTaskCardProps) => {
  const handleEdit = useCallback(() => onEdit(task), [onEdit, task]);
  const handleDelete = useCallback(() => {
    if (confirm('למחוק את הפרויקט?')) {
      onDelete(task.id);
    }
  }, [onDelete, task.id]);

  const handleStatusToggle = useCallback(() => {
    onUpdate(task.id, { isCompleted: !task.isCompleted });
  }, [onUpdate, task.id, task.isCompleted]);

  const handlePaymentToggle = useCallback(() => {
    onUpdate(task.id, { isPaid: !task.isPaid });
  }, [onUpdate, task.id, task.isPaid]);

  return (
    <div className="minimal-card minimal-padding performance-mode" data-project-id={task.id}>
      {/* Header */}
      <div className="clean-flex justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-title">{task.projectName}</h3>
          <p className="text-subtitle">{task.clientName}</p>
        </div>
        <div className="clean-flex">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="minimal-button text-xs"
          >
            <Edit3 className="h-3 w-3 ml-1" />
            ערוך
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="minimal-button text-xs"
          >
            <Trash2 className="h-3 w-3 ml-1" />
            מחק
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="clean-grid grid-cols-3 gap-4">
        {/* Status & Priority */}
        <div className="minimal-spacing">
          <div className="clean-flex justify-between">
            <StatusBadge isCompleted={task.isCompleted} status="בתהליך" />
            <PriorityBadge priority={task.priority} />
          </div>
          <div className="clean-flex justify-between text-sm">
            <button 
              onClick={handleStatusToggle}
              className="text-blue-600 hover:underline"
            >
              {task.isCompleted ? 'בטל השלמה' : 'סמן כהושלם'}
            </button>
            <button 
              onClick={handlePaymentToggle}
              className={task.isPaid ? 'text-green-600' : 'text-red-600'}
            >
              {task.isPaid ? 'שולם' : 'לא שולם'}
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="minimal-spacing">
          <div className="text-subtitle">פרטי קשר</div>
          <ContactActions 
            phone={task.clientPhone}
            whatsapp={task.clientWhatsapp}
            email={task.clientEmail}
            folderLink={task.folderLink}
          />
        </div>

        {/* Project Details */}
        <div className="minimal-spacing">
          <div className="text-subtitle">פרטי פרויקט</div>
          <div className="text-body">
            {task.currency} {task.price.toLocaleString()}
          </div>
          {task.projectDescription && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.projectDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

OptimizedTaskCard.displayName = 'OptimizedTaskCard';