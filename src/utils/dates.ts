import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';

export const getWeekStart = (date: Date = new Date()): string => {
  return format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
};

export const getWeekEnd = (date: Date = new Date()): string => {
  return format(endOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
};

export const formatWeekRange = (weekStart: string): string => {
  const start = new Date(weekStart);
  const end = endOfWeek(start, { weekStartsOn: 1 });
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
};

export const getPreviousWeek = (weekStart: string): string => {
  const date = new Date(weekStart);
  return format(subWeeks(date, 1), 'yyyy-MM-dd');
};

export const getNextWeek = (weekStart: string): string => {
  const date = new Date(weekStart);
  return format(addWeeks(date, 1), 'yyyy-MM-dd');
};

export const isCurrentWeek = (weekStart: string): boolean => {
  return weekStart === getWeekStart();
};

export const isFutureWeek = (weekStart: string): boolean => {
  return weekStart > getWeekStart();
};

export const getToday = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const formatDate = (date: string): string => {
  return format(new Date(date), 'EEEE, MMMM d');
};
