// Centralized date utilities with selective imports from date-fns
// This reduces bundle size by importing only what we need

import { format } from 'date-fns/format';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { isToday } from 'date-fns/isToday';
import { isYesterday } from 'date-fns/isYesterday';
import { startOfDay } from 'date-fns/startOfDay';
import { endOfDay } from 'date-fns/endOfDay';
import { addDays } from 'date-fns/addDays';
import { subDays } from 'date-fns/subDays';
import { parseISO } from 'date-fns/parseISO';
import { isValid } from 'date-fns/isValid';

// Hebrew locale (import only if needed)
// import { he } from 'date-fns/locale';

export const dateUtils = {
  // Format date to readable string
  formatDate: (date: Date | string, formatStr = 'dd/MM/yyyy') => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'תאריך לא תקין';
    return format(dateObj, formatStr);
  },

  // Format date and time
  formatDateTime: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'תאריך לא תקין';
    return format(dateObj, 'dd/MM/yyyy HH:mm');
  },

  // Format relative time (e.g., "2 hours ago")
  formatRelativeTime: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'תאריך לא תקין';
    
    if (isToday(dateObj)) {
      return `היום ${format(dateObj, 'HH:mm')}`;
    }
    
    if (isYesterday(dateObj)) {
      return `אתמול ${format(dateObj, 'HH:mm')}`;
    }
    
    return formatDistanceToNow(dateObj, { addSuffix: true });
  },

  // Check if date is today
  isToday: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) && isToday(dateObj);
  },

  // Check if date is yesterday
  isYesterday: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) && isYesterday(dateObj);
  },

  // Get start of day
  startOfDay: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? startOfDay(dateObj) : new Date();
  },

  // Get end of day
  endOfDay: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? endOfDay(dateObj) : new Date();
  },

  // Add days to date
  addDays: (date: Date | string, days: number) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? addDays(dateObj, days) : new Date();
  },

  // Subtract days from date
  subDays: (date: Date | string, days: number) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? subDays(dateObj, days) : new Date();
  },

  // Parse ISO string to Date
  parseISO: (dateString: string) => {
    return parseISO(dateString);
  },

  // Check if date is valid
  isValid: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj);
  },

  // Get current date
  now: () => new Date(),

  // Format for input fields
  formatForInput: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, 'yyyy-MM-dd');
  },

  // Format for display in Hebrew
  formatHebrew: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'תאריך לא תקין';
    
    const day = format(dateObj, 'dd');
    const month = format(dateObj, 'MM');
    const year = format(dateObj, 'yyyy');
    
    const monthNames = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    
    return `${day} ב${monthNames[parseInt(month) - 1]} ${year}`;
  }
};

export default dateUtils;