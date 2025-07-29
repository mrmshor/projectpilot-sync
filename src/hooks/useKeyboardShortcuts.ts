import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { ctrlKey, metaKey, shiftKey, key } = event;
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const cmdKey = isMac ? metaKey : ctrlKey;

    // Create shortcut key combinations
    let shortcutKey = '';
    
    if (cmdKey) shortcutKey += 'ctrl+';
    if (shiftKey) shortcutKey += 'shift+';
    shortcutKey += key.toLowerCase();

    // Check if this shortcut exists and execute it
    if (shortcuts[shortcutKey]) {
      event.preventDefault();
      shortcuts[shortcutKey]();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Common keyboard shortcuts hook for the app
export const useAppKeyboardShortcuts = (actions: {
  onNewTask?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onSearch?: () => void;
  onToggleTheme?: () => void;
}) => {
  const shortcuts: KeyboardShortcuts = {};

  if (actions.onNewTask) shortcuts['ctrl+n'] = actions.onNewTask;
  if (actions.onSave) shortcuts['ctrl+s'] = actions.onSave;
  if (actions.onExport) shortcuts['ctrl+e'] = actions.onExport;
  if (actions.onSearch) shortcuts['ctrl+f'] = actions.onSearch;
  if (actions.onToggleTheme) shortcuts['ctrl+shift+t'] = actions.onToggleTheme;

  useKeyboardShortcuts(shortcuts);
};