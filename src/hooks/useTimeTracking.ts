import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface TimeEntry {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  description?: string;
  isActive: boolean;
}

export const useTimeTracking = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load time entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('time_entries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((entry: any) => ({
          ...entry,
          startTime: new Date(entry.startTime),
          endTime: entry.endTime ? new Date(entry.endTime) : undefined
        }));
        setTimeEntries(parsed);
        
        // Check for active entry
        const active = parsed.find((entry: TimeEntry) => entry.isActive);
        if (active) {
          setActiveEntry(active);
          const elapsed = Math.floor((Date.now() - active.startTime.getTime()) / 1000);
          setCurrentTime(elapsed);
        }
      } catch (error) {
        console.error('Error loading time entries:', error);
      }
    }
  }, []);

  // Save time entries to localStorage
  useEffect(() => {
    if (timeEntries.length > 0) {
      localStorage.setItem('time_entries', JSON.stringify(timeEntries));
    }
  }, [timeEntries]);

  // Update timer for active entry
  useEffect(() => {
    if (activeEntry) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeEntry.startTime.getTime()) / 1000);
        setCurrentTime(elapsed);
        
        // Auto-save every minute
        if (elapsed % 60 === 0) {
          setTimeEntries(prev => prev.map(entry => 
            entry.id === activeEntry.id 
              ? { ...entry, duration: elapsed }
              : entry
          ));
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeEntry]);

  const startTimer = (taskId: string, description?: string) => {
    // Stop any active timer first
    if (activeEntry) {
      stopTimer();
    }

    const newEntry: TimeEntry = {
      id: `time_${Date.now()}`,
      taskId,
      startTime: new Date(),
      duration: 0,
      description,
      isActive: true
    };

    setTimeEntries(prev => [newEntry, ...prev]);
    setActiveEntry(newEntry);
    setCurrentTime(0);

    toast({
      title: 'טיימר הופעל',
      description: 'התחיל מעקב זמן עבור המשימה',
    });
  };

  const stopTimer = () => {
    if (!activeEntry) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - activeEntry.startTime.getTime()) / 1000);

    const updatedEntry: TimeEntry = {
      ...activeEntry,
      endTime,
      duration,
      isActive: false
    };

    setTimeEntries(prev => prev.map(entry => 
      entry.id === activeEntry.id ? updatedEntry : entry
    ));

    setActiveEntry(null);
    setCurrentTime(0);

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    
    toast({
      title: 'טיימר נעצר',
      description: `זמן מעקב: ${hours > 0 ? `${hours}ש ` : ''}${minutes}ד`,
    });
  };

  const pauseTimer = () => {
    if (!activeEntry) return;

    const duration = Math.floor((Date.now() - activeEntry.startTime.getTime()) / 1000);
    
    setTimeEntries(prev => prev.map(entry => 
      entry.id === activeEntry.id 
        ? { ...entry, duration, isActive: false }
        : entry
    ));

    setActiveEntry(null);
    setCurrentTime(0);

    toast({
      title: 'טיימר הושהה',
      description: 'ניתן להמשיך מעקב זמן מאוחר יותר',
    });
  };

  const resumeTimer = (entryId: string) => {
    const entry = timeEntries.find(e => e.id === entryId);
    if (!entry || entry.isActive) return;

    // Stop any active timer first
    if (activeEntry) {
      stopTimer();
    }

    const resumedEntry: TimeEntry = {
      ...entry,
      startTime: new Date(Date.now() - entry.duration * 1000),
      isActive: true
    };

    setTimeEntries(prev => prev.map(e => 
      e.id === entryId ? resumedEntry : e
    ));

    setActiveEntry(resumedEntry);
    setCurrentTime(entry.duration);

    toast({
      title: 'טיימר חודש',
      description: 'המשך מעקב זמן עבור המשימה',
    });
  };

  const deleteTimeEntry = (entryId: string) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== entryId));
    
    if (activeEntry?.id === entryId) {
      setActiveEntry(null);
      setCurrentTime(0);
    }
  };

  const getTaskTotalTime = (taskId: string): number => {
    return timeEntries
      .filter(entry => entry.taskId === taskId)
      .reduce((total, entry) => {
        if (entry.isActive && entry.id === activeEntry?.id) {
          return total + currentTime;
        }
        return total + entry.duration;
      }, 0);
  };

  const getTotalTrackedTime = (): number => {
    return timeEntries.reduce((total, entry) => {
      if (entry.isActive && entry.id === activeEntry?.id) {
        return total + currentTime;
      }
      return total + entry.duration;
    }, 0);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeEntriesForTask = (taskId: string): TimeEntry[] => {
    return timeEntries.filter(entry => entry.taskId === taskId);
  };

  return {
    timeEntries,
    activeEntry,
    currentTime,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    deleteTimeEntry,
    getTaskTotalTime,
    getTotalTrackedTime,
    formatTime,
    getTimeEntriesForTask,
    isTracking: !!activeEntry
  };
};