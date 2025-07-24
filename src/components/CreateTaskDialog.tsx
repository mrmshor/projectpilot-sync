import { useState } from 'react';
import { Task, WorkStatus, Priority, WORK_STATUS_LABELS, PRIORITY_LABELS, CURRENCIES } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';

interface CreateTaskDialogProps {
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const CreateTaskDialog = ({ onCreateTask }: CreateTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    folderPath: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    workStatus: 'not_started' as WorkStatus,
    priority: 'medium' as Priority,
    price: 0,
    currency: 'USD',
    isPaid: false,
    isCompleted: false
  });

  console.log('CreateTaskDialog rendered, open:', open);
  console.log('Current form data:', formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== FORM SUBMIT STARTED ===');
    console.log('Form data at submit:', formData);
    
    // Basic validation
    if (!formData.projectName.trim()) {
      console.log('Validation failed: missing project name');
      alert('שם הפרויקט הוא שדה חובה');
      return;
    }
    
    if (!formData.clientName.trim()) {
      console.log('Validation failed: missing client name');
      alert('שם הלקוח הוא שדה חובה');
      return;
    }

    try {
      console.log('About to call onCreateTask...');
      onCreateTask({
        ...formData,
        folderPath: formData.folderPath || undefined,
        tasks: [],
        clientPhone: formData.clientPhone || undefined,
        clientEmail: formData.clientEmail || undefined
      });
      
      console.log('onCreateTask completed successfully');
      
      // Reset form
      setFormData({
        projectName: '',
        projectDescription: '',
        folderPath: '',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        workStatus: 'not_started',
        priority: 'medium',
        price: 0,
        currency: 'USD',
        isPaid: false,
        isCompleted: false
      });

      console.log('Form reset completed');
      setOpen(false);
      console.log('=== DIALOG CLOSED ===');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('שגיאה ביצירת הפרויקט: ' + error);
    }
  };

  const updateField = (field: string, value: any) => {
    console.log(`Updating field "${field}" to:`, value);
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('New form data after update:', newData);
      return newData;
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      console.log('Dialog onOpenChange called with:', newOpen);
      setOpen(newOpen);
    }}>
      <DialogTrigger asChild>
        <Button 
          className="gap-2" 
          onClick={(e) => {
            console.log('=== CREATE PROJECT BUTTON CLICKED ===', e);
            console.log('Current open state:', open);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          פרויקט חדש
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>צור פרויקט חדש</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">פרטי הפרויקט</h3>
            
            <div>
              <Label htmlFor="projectName">שם הפרויקט *</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => updateField('projectName', e.target.value)}
                placeholder="הכנס שם פרויקט"
                required
                dir="rtl"
              />
            </div>

            <div>
              <Label htmlFor="projectDescription">תיאור</Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) => updateField('projectDescription', e.target.value)}
                placeholder="תאר את הפרויקט"
                rows={3}
                dir="rtl"
              />
            </div>

            <div>
              <Label htmlFor="folderPath">נתיב תיקייה (אופציונלי)</Label>
              <Input
                id="folderPath"
                value={formData.folderPath}
                onChange={(e) => updateField('folderPath', e.target.value)}
                placeholder="/Users/yourname/Projects/ProjectName"
                dir="rtl"
              />
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">פרטי הלקוח</h3>
            
            <div>
              <Label htmlFor="clientName">שם הלקוח *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
                placeholder="הכנס שם לקוח"
                required
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientPhone">טלפון (אופציונלי)</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => updateField('clientPhone', e.target.value)}
                  placeholder="+972501234567"
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="clientEmail">אימייל (אופציונלי)</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => updateField('clientEmail', e.target.value)}
                  placeholder="client@example.com"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Project Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">הגדרות הפרויקט</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workStatus">סטטוס עבודה</Label>
                <Select 
                  value={formData.workStatus} 
                  onValueChange={(value) => {
                    console.log('Work status select changed to:', value);
                    updateField('workStatus', value);
                  }}
                >
                  <SelectTrigger onClick={() => console.log('Work status trigger clicked')}>
                    <SelectValue placeholder="בחר סטטוס" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(WORK_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem 
                        key={value} 
                        value={value}
                        onClick={() => console.log('Work status item clicked:', value)}
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">עדיפות</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => {
                    console.log('Priority select changed to:', value);
                    updateField('priority', value);
                  }}
                >
                  <SelectTrigger onClick={() => console.log('Priority trigger clicked')}>
                    <SelectValue placeholder="בחר עדיפות" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currency">מטבע</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => {
                    console.log('Currency select changed to:', value);
                    updateField('currency', value);
                  }}
                >
                  <SelectTrigger onClick={() => console.log('Currency trigger clicked')}>
                    <SelectValue placeholder="בחר מטבע" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="price">מחיר</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isPaid"
                  checked={formData.isPaid}
                  onCheckedChange={(checked) => {
                    console.log('isPaid checkbox changed to:', checked);
                    updateField('isPaid', checked);
                  }}
                />
                <Label htmlFor="isPaid">שולם</Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isCompleted"
                  checked={formData.isCompleted}
                  onCheckedChange={(checked) => {
                    console.log('isCompleted checkbox changed to:', checked);
                    updateField('isCompleted', checked);
                  }}
                />
                <Label htmlFor="isCompleted">הושלם</Label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-start gap-3 pt-4">
            <Button 
              type="submit" 
              onClick={() => console.log('Submit button clicked')}
            >
              צור פרויקט
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                console.log('Cancel button clicked');
                setOpen(false);
              }}
            >
              ביטול
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};