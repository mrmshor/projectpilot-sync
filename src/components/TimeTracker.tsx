import React, { useState } from 'react';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Timer,
  Trash2,
  RotateCcw,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface TimeTrackerProps {
  tasks: Task[];
}

export const TimeTracker = ({ tasks }: TimeTrackerProps) => {
  const {
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
    isTracking
  } = useTimeTracking();

  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleStart = () => {
    if (selectedTaskId) {
      startTimer(selectedTaskId, description);
      setDescription('');
    }
  };

  const getTaskName = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.projectName : 'משימה לא נמצאה';
  };

  const totalTrackedTime = getTotalTrackedTime();
  const todayEntries = timeEntries.filter(entry => {
    const today = new Date().toDateString();
    return entry.startTime.toDateString() === today;
  });

  const todayTotalTime = todayEntries.reduce((total, entry) => {
    if (entry.isActive && entry.id === activeEntry?.id) {
      return total + currentTime;
    }
    return total + entry.duration;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Active Timer Display */}
      <Card className="apple-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isTracking ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <Timer className="h-4 w-4" />
              </div>
              <div>
                <div className="text-2xl font-mono font-bold">
                  {formatTime(currentTime)}
                </div>
                {activeEntry && (
                  <div className="text-sm text-muted-foreground">
                    {getTaskName(activeEntry.taskId)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isTracking ? (
                <>
                  <Button size="sm" variant="outline" onClick={pauseTimer}>
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={stopTimer}>
                    <Square className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Play className="h-4 w-4 ml-2" />
                      התחל
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent dir="rtl">
                    <DialogHeader>
                      <DialogTitle>התחל מעקב זמן</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="task-select">בחר פרויקט</Label>
                        <select
                          id="task-select"
                          value={selectedTaskId}
                          onChange={(e) => setSelectedTaskId(e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">בחר פרויקט...</option>
                          {tasks.map(task => (
                            <option key={task.id} value={task.id}>
                              {task.projectName} - {task.clientName}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">תיאור (אופציונלי)</Label>
                        <Input
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="על מה אתה עובד?"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleStart} 
                        disabled={!selectedTaskId}
                        className="w-full"
                      >
                        <Play className="h-4 w-4 ml-2" />
                        התחל מעקב
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="apple-card">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {formatTime(todayTotalTime)}
              </div>
              <div className="text-xs text-muted-foreground">היום</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="apple-card">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {formatTime(totalTrackedTime)}
              </div>
              <div className="text-xs text-muted-foreground">סה"כ</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Time Summary */}
      <Card className="apple-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            זמן לפי פרויקט
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {tasks.map(task => {
              const taskTime = getTaskTotalTime(task.id);
              if (taskTime === 0) return null;
              
              return (
                <div key={task.id} className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1">{task.projectName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {formatTime(taskTime)}
                  </Badge>
                </div>
              );
            })}
            
            {tasks.every(task => getTaskTotalTime(task.id) === 0) && (
              <div className="text-center text-muted-foreground text-sm py-4">
                עדיין לא נרשם זמן עבור פרויקטים
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Time History */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <Calendar className="h-4 w-4 ml-2" />
            היסטוריית זמן
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>היסטוריית מעקב זמן</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {timeEntries.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  עדיין לא נרשמו רישומי זמן
                </div>
              ) : (
                timeEntries.map((entry, index) => (
                  <div key={entry.id}>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {getTaskName(entry.taskId)}
                        </div>
                        {entry.description && (
                          <div className="text-xs text-muted-foreground">
                            {entry.description}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {format(entry.startTime, 'dd/MM/yyyy HH:mm', { locale: he })}
                          {entry.endTime && (
                            <span> - {format(entry.endTime, 'HH:mm', { locale: he })}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={entry.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {entry.isActive && entry.id === activeEntry?.id 
                            ? formatTime(currentTime)
                            : formatTime(entry.duration)
                          }
                        </Badge>
                        
                        <div className="flex gap-1">
                          {!entry.isActive && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => resumeTimer(entry.id)}
                              className="h-6 w-6 p-0"
                            >
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteTimeEntry(entry.id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {index < timeEntries.length - 1 && <Separator className="my-2" />}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};