import { useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AutoSaveOptions {
  enabled?: boolean;
  interval?: number; // in milliseconds
  onSave: () => void | Promise<void>;
  data: any;
}

export const useAutoSave = ({ 
  enabled = true, 
  interval = 30000, // 30 seconds default
  onSave, 
  data 
}: AutoSaveOptions) => {
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef(data);
  const saveInProgressRef = useRef(false);

  const performAutoSave = useCallback(async () => {
    if (saveInProgressRef.current) return;
    
    // Check if data has changed
    if (JSON.stringify(data) === JSON.stringify(lastSavedRef.current)) {
      return;
    }

    try {
      saveInProgressRef.current = true;
      await onSave();
      lastSavedRef.current = data;
      
      toast({
        title: 'שמירה אוטומטית',
        description: 'הנתונים נשמרו בהצלחה',
        duration: 2000,
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast({
        title: 'שגיאה בשמירה',
        description: 'לא ניתן לשמור את הנתונים',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      saveInProgressRef.current = false;
    }
  }, [data, onSave, toast]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(performAutoSave, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, performAutoSave]);

  // Manual save function
  const saveNow = useCallback(() => {
    performAutoSave();
  }, [performAutoSave]);

  return { saveNow, isSaving: saveInProgressRef.current };
};