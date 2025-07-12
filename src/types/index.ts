export interface Habit {
  id: string;
  name: string;
  description: string;
  currentStreak: number;
  longestStreak: number;
  lastCompleted: string | null; // Date string in 'yyyy-MM-dd' format
  history: string[]; // Array of 'yyyy-MM-dd' date strings
}

export interface ActivityData {
  water: number; // Number of glasses
  exercise: boolean; // True if exercised
  date: string; // 'yyyy-MM-dd'
}
