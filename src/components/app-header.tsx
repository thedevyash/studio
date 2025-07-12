"use client"

import type { Habit } from "@/types";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { Progress } from "@/components/ui/progress";

interface AppHeaderProps {
  habits: Habit[];
  onAddHabit: (name: string, description: string) => void;
  completedTodayCount: number;
}

export default function AppHeader({ habits, onAddHabit, completedTodayCount }: AppHeaderProps) {
  const totalHabits = habits.length;
  const progress = totalHabits > 0 ? (completedTodayCount / totalHabits) * 100 : 0;

  return (
    <header className="mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Habit Horizon</h1>
          <p className="text-muted-foreground">Keep track of your daily goals and build lasting habits.</p>
        </div>
        <AddHabitDialog onSave={onAddHabit} />
      </div>
      {totalHabits > 0 && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-muted-foreground">Daily Progress</span>
            <span className="text-sm font-bold text-foreground">{completedTodayCount} / {totalHabits}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </header>
  );
}
