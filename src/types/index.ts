export interface Habit {
  id: string;
  name: string;
  description: string;
  currentStreak: number;
  longestStreak: number;
  lastCompleted: string | null; // Date string in 'yyyy-MM-dd' format
}
