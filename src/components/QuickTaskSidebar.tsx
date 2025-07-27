import { useState } from 'react';
import { useQuickTasks } from '@/hooks/useQuickTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Trash2, 
  FolderOpen, 
  Link,
  CheckSquare,
  Square
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const QuickTaskSidebar = () => {
  const {
    quickTasks,
    folderLinks,
    addQuickTask,
    toggleQuickTask,
    deleteQuickTask,
    addFolderLink,
    deleteFolderLink,
    openFolderLink
  } = useQuickTasks();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderPath, setNewFolderPath] = useState('');
  const [selectedFolderLink, setSelectedFolderLink] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addQuickTask(newTaskTitle.trim(), selectedFolderLink || undefined);
      setNewTaskTitle('');
      setSelectedFolderLink('');
    }
  };

  const handleAddFolder = () => {
    if (newFolderName.trim() && newFolderPath.trim()) {
      addFolderLink(newFolderName.trim(), newFolderPath.trim());
      setNewFolderName('');
      setNewFolderPath('');
      setIsAddingFolder(false);
    }
  };

  const completedTasks = quickTasks.filter(task => task.completed);
  const pendingTasks = quickTasks.filter(task => !task.completed);

  return (
    <div className="w-80 h-full bg-background border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">משימות מהירות</h2>
        
        {/* Add Task */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="הוסף משימה חדשה..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              className="flex-1"
            />
            <Button 
              onClick={handleAddTask} 
              size="sm"
              disabled={!newTaskTitle.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Folder Link Selection */}
          {folderLinks.length > 0 && (
            <select
              value={selectedFolderLink}
              onChange={(e) => setSelectedFolderLink(e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background text-sm"
            >
              <option value="">ללא קישור תיקיה</option>
              {folderLinks.map(link => (
                <option key={link.id} value={link.path}>
                  {link.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Square className="h-4 w-4" />
                משימות ממתינות ({pendingTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingTasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 group">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleQuickTask(task.id)}
                  />
                  <span className="flex-1 text-sm">{task.title}</span>
                  {task.folderLink && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openFolderLink(task.folderLink!)}
                      className="p-1 h-auto opacity-70 hover:opacity-100"
                    >
                      <FolderOpen className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuickTask(task.id)}
                    className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <CheckSquare className="h-4 w-4" />
                הושלמו ({completedTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {completedTasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 group opacity-60">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleQuickTask(task.id)}
                  />
                  <span className="flex-1 text-sm line-through">{task.title}</span>
                  {task.folderLink && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openFolderLink(task.folderLink!)}
                      className="p-1 h-auto opacity-70 hover:opacity-100"
                    >
                      <FolderOpen className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuickTask(task.id)}
                    className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Folder Links */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                קישורי תיקיות ({folderLinks.length})
              </div>
              <Dialog open={isAddingFolder} onOpenChange={setIsAddingFolder}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    <Plus className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>הוסף קישור תיקיה</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="folderName">שם התיקיה</Label>
                      <Input
                        id="folderName"
                        placeholder="לדוגמה: פרויקט A"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="folderPath">נתיב או קישור</Label>
                      <Input
                        id="folderPath"
                        placeholder="לדוגמה: /Users/username/Projects או https://icloud.com/..."
                        value={newFolderPath}
                        onChange={(e) => setNewFolderPath(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        ניתן להכניס נתיב למחשב או קישור iCloud Drive
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddFolder} disabled={!newFolderName.trim() || !newFolderPath.trim()}>
                        הוסף
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingFolder(false)}>
                        ביטול
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {folderLinks.map(link => (
              <div key={link.id} className="flex items-center gap-2 group">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openFolderLink(link.path)}
                  className="flex-1 justify-start p-2 h-auto"
                >
                  <FolderOpen className="h-4 w-4 ml-2" />
                  <span className="text-sm">{link.name}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteFolderLink(link.id)}
                  className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {folderLinks.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                לא נוספו קישורי תיקיות עדיין
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};