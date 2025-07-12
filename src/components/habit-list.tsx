"use client"

import type { Habit } from "@/types";
import { HabitItem } from "@/components/habit-item";

interface HabitListProps {
  habits: Habit[];
  onToggle: (id: string, checked: boolean) => void;
  onEdit: (id:string, name: string, description: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitList({ habits, onToggle, onEdit, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-16 px-4 border-2 border-dashed border-border rounded-lg">
        <h2 className="text-xl font-semibold text-foreground mb-2">No habits yet!</h2>
        <p className="text-muted-foreground">Click "Add Habit" to start your journey.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitItem 
          key={habit.id} 
          habit={habit}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
