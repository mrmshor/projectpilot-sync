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
    clientPhone2: '',
    clientWhatsapp: '',
    clientWhatsapp2: '',
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
        clientPhone2: formData.clientPhone2 || undefined,
        clientWhatsapp: formData.clientWhatsapp || undefined,
        clientWhatsapp2: formData.clientWhatsapp2 || undefined,
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
        clientPhone2: '',
        clientWhatsapp: '',
        clientWhatsapp2: '',
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-center">צור פרויקט חדש</DialogTitle>
          <p className="text-muted-foreground text-center">מלא את הפרטים ליצירת פרויקט חדש במערכת</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Details */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 space-y-6">
            <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
              📋 פרטי הפרויקט
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="projectName" className="text-lg font-semibold mb-2 block">שם הפרויקט *</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => updateField('projectName', e.target.value)}
                  placeholder="הכנס שם פרויקט מפורט וברור"
                  required
                  dir="rtl"
                  className="text-lg h-14 border-2 border-primary/20 focus:border-primary/40"
                />
              </div>

              <div>
                <Label htmlFor="projectDescription" className="text-lg font-semibold mb-2 block">תיאור הפרויקט</Label>
                <Textarea
                  id="projectDescription"
                  value={formData.projectDescription}
                  onChange={(e) => updateField('projectDescription', e.target.value)}
                  placeholder="תאר את הפרויקט בפירוט - מטרות, דרישות, תוכן העבודה וכל פרט רלוונטי נוסף"
                  rows={5}
                  dir="rtl"
                  className="text-base min-h-32 resize-y border-2 border-primary/20 focus:border-primary/40"
                />
              </div>

              <div>
                <Label htmlFor="folderPath" className="text-base font-medium mb-2 block">נתיב תיקייה (אופציונלי)</Label>
                <Input
                  id="folderPath"
                  value={formData.folderPath}
                  onChange={(e) => updateField('folderPath', e.target.value)}
                  placeholder="/Users/yourname/Projects/ProjectName או C:\Projects\ProjectName"
                  dir="rtl"
                  className="text-base h-12"
                />
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-gradient-to-r from-blue-500/5 to-blue-600/10 rounded-lg p-6 space-y-6">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
              👤 פרטי הלקוח
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="clientName" className="text-base font-semibold mb-2 block">שם הלקוח *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => updateField('clientName', e.target.value)}
                  placeholder="הכנס שם לקוח מלא"
                  required
                  dir="rtl"
                  className="text-base h-12 border-2 border-blue-200/50 focus:border-blue-400/60"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientPhone" className="text-sm font-medium mb-1 block">טלפון ראשי</Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => updateField('clientPhone', e.target.value)}
                    placeholder="+972-50-123-4567"
                    dir="rtl"
                    className="text-base h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="clientPhone2" className="text-sm font-medium mb-1 block">טלפון נוסף</Label>
                  <Input
                    id="clientPhone2"
                    type="tel"
                    value={formData.clientPhone2}
                    onChange={(e) => updateField('clientPhone2', e.target.value)}
                    placeholder="+972-50-123-4567"
                    dir="rtl"
                    className="text-base h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="clientWhatsapp" className="text-sm font-medium mb-1 block">וואטסאפ ראשי</Label>
                  <Input
                    id="clientWhatsapp"
                    type="tel"
                    value={formData.clientWhatsapp}
                    onChange={(e) => updateField('clientWhatsapp', e.target.value)}
                    placeholder="+972-50-123-4567"
                    dir="rtl"
                    className="text-base h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="clientWhatsapp2" className="text-sm font-medium mb-1 block">וואטסאפ נוסף</Label>
                  <Input
                    id="clientWhatsapp2"
                    type="tel"
                    value={formData.clientWhatsapp2}
                    onChange={(e) => updateField('clientWhatsapp2', e.target.value)}
                    placeholder="+972-50-123-4567"
                    dir="rtl"
                    className="text-base h-11"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="clientEmail" className="text-sm font-medium mb-1 block">כתובת אימייל</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => updateField('clientEmail', e.target.value)}
                  placeholder="client@example.com"
                  dir="rtl"
                  className="text-base h-11"
                />
              </div>
            </div>
          </div>

          {/* Project Settings */}
          <div className="bg-gradient-to-r from-purple-500/5 to-purple-600/10 rounded-lg p-6 space-y-6">
            <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              ⚙️ הגדרות הפרויקט
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="workStatus" className="text-base font-semibold mb-2 block">סטטוס עבודה</Label>
                <Select 
                  value={formData.workStatus} 
                  onValueChange={(value) => {
                    console.log('Work status select changed to:', value);
                    updateField('workStatus', value);
                  }}
                >
                  <SelectTrigger 
                    className="h-12 text-base border-2 border-purple-200/50 focus:border-purple-400/60"
                    onClick={() => console.log('Work status trigger clicked')}
                  >
                    <SelectValue placeholder="בחר סטטוס עבודה" />
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
                <Label htmlFor="priority" className="text-base font-semibold mb-2 block">רמת עדיפות</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => {
                    console.log('Priority select changed to:', value);
                    updateField('priority', value);
                  }}
                >
                  <SelectTrigger 
                    className="h-12 text-base border-2 border-purple-200/50 focus:border-purple-400/60"
                    onClick={() => console.log('Priority trigger clicked')}
                  >
                    <SelectValue placeholder="בחר רמת עדיפות" />
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

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-green-700 dark:text-green-300">💰 פרטי מחיר ותשלום</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currency" className="text-sm font-medium mb-1 block">מטבע</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => {
                      console.log('Currency select changed to:', value);
                      updateField('currency', value);
                    }}
                  >
                    <SelectTrigger 
                      className="h-11 text-base"
                      onClick={() => console.log('Currency trigger clicked')}
                    >
                      <SelectValue placeholder="מטבע" />
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

                <div className="md:col-span-2">
                  <Label htmlFor="price" className="text-sm font-medium mb-1 block">מחיר הפרויקט</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="text-base h-11"
                  />
                </div>
              </div>

              <div className="flex gap-8 pt-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="isPaid"
                    checked={formData.isPaid}
                    onCheckedChange={(checked) => {
                      console.log('isPaid checkbox changed to:', checked);
                      updateField('isPaid', checked);
                    }}
                    className="w-5 h-5"
                  />
                  <Label htmlFor="isPaid" className="text-base font-medium">שולם</Label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="isCompleted"
                    checked={formData.isCompleted}
                    onCheckedChange={(checked) => {
                      console.log('isCompleted checkbox changed to:', checked);
                      updateField('isCompleted', checked);
                    }}
                    className="w-5 h-5"
                  />
                  <Label htmlFor="isCompleted" className="text-base font-medium">הושלם</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-6 border-t border-border/30">
            <Button 
              type="submit" 
              size="lg"
              className="px-8 py-3 text-lg font-semibold"
              onClick={() => console.log('Submit button clicked')}
            >
              ✅ צור פרויקט
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="lg"
              className="px-8 py-3 text-lg"
              onClick={() => {
                console.log('Cancel button clicked');
                setOpen(false);
              }}
            >
              ❌ ביטול
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};