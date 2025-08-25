import React, { useRef, useState } from 'react';
import { useDataBackup } from '@/hooks/useDataBackup';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Upload, 
  Database, 
  History, 
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface BackupManagerProps {
  tasks: Task[];
  quickTasks?: any[];
  onDataRestore: (data: { tasks: Task[]; quickTasks: any[] }) => void;
}

export const BackupManager = ({ tasks, quickTasks = [], onDataRestore }: BackupManagerProps) => {
  const { exportData, importData, restoreAutoBackup, getBackupHistory, isExporting, isImporting } = useDataBackup();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmRestore, setShowConfirmRestore] = useState(false);
  const [pendingRestoreData, setPendingRestoreData] = useState<any>(null);

  const backupHistory = getBackupHistory();
  const autoBackup = restoreAutoBackup();

  const handleExport = () => {
    exportData(tasks, quickTasks);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const data = await importData(file);
    if (data) {
      setPendingRestoreData(data);
      setShowConfirmRestore(true);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const confirmRestore = () => {
    if (pendingRestoreData) {
      onDataRestore({
        tasks: pendingRestoreData.tasks,
        quickTasks: pendingRestoreData.quickTasks || []
      });
      setShowConfirmRestore(false);
      setPendingRestoreData(null);
    }
  };

  const handleAutoRestore = () => {
    if (autoBackup) {
      setPendingRestoreData(autoBackup);
      setShowConfirmRestore(true);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="apple-button">
          <Database className="h-4 w-4 ml-2" />
          גיבוי ושחזור
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ניהול גיבוי ושחזור נתונים
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="h-4 w-4" />
                יצוא נתונים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                יצא את כל הפרויקטים והמשימות שלך לקובץ גיבוי
              </p>
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current ml-2" />
                    מייצא...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 ml-2" />
                    יצא גיבוי ({tasks.length} פרויקטים)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Import Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-4 w-4" />
                שחזור נתונים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  שחזור נתונים יחליף את כל הפרויקטים הקיימים. וודא שיש לך גיבוי לפני השחזור.
                </AlertDescription>
              </Alert>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                variant="outline"
                className="w-full"
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current ml-2" />
                    מעבד קובץ...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 ml-2" />
                    בחר קובץ גיבוי
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Auto Backup Section */}
          {autoBackup && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-4 w-4" />
                  גיבוי אוטומטי
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">גיבוי אחרון</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(autoBackup.exportDate), 'dd/MM/yyyy HH:mm', { locale: he })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {autoBackup.tasks.length} פרויקטים
                    </p>
                  </div>
                  <Button onClick={handleAutoRestore} size="sm" variant="outline">
                    <History className="h-4 w-4 ml-2" />
                    שחזר
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Backup History */}
          {backupHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-4 w-4" />
                  היסטוריית גיבויים ({backupHistory.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {backupHistory.slice(0, 5).map((backup: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded">
                      <div>
                        <span className="font-medium">
                          {format(new Date(backup.date), 'dd/MM/yyyy HH:mm', { locale: he })}
                        </span>
                        <span className="text-muted-foreground mr-2">
                          ({backup.tasks.length} פרויקטים)
                        </span>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirmRestore && (
          <Dialog open={showConfirmRestore} onOpenChange={setShowConfirmRestore}>
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  אישור שחזור נתונים
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    פעולה זו תחליף את כל הפרויקטים הקיימים ({tasks.length} פרויקטים) 
                    בנתונים מקובץ הגיבוי ({pendingRestoreData?.tasks.length || 0} פרויקטים).
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowConfirmRestore(false)}>
                    ביטול
                  </Button>
                  <Button onClick={confirmRestore} variant="destructive">
                    שחזר נתונים
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};