export interface Habit {
  id: string;
  name: string;
  description: string;
  currentStreak: number;
  longestStreak: number;
  lastCompleted: string | null; // Date string in 'yyyy-MM-dd' format
  history: string[]; // Array of 'yyyy-MM-dd' date strings
  growthStage: number; // 0 for sprout, up to 5 for mature plant
}

export interface ActivityData {
  water: number; // Number of glasses
  exercise: boolean; // True if exercised
  date: string; // 'yyyy-MM-dd'
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  friends: string[]; // array of friend user UIDs
}
