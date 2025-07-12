"use client";

import { useState, useEffect, useMemo } from "react";
import type { Habit } from "@/types";
import { format, parse, differenceInCalendarDays } from "date-fns";
import AppHeader from "@/components/app-header";
import HabitList from "@/components/habit-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedHabits = localStorage.getItem("habits");
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      }
    } catch (error) {
      console.error("Failed to parse habits from localStorage", error);
      localStorage.removeItem("habits");
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits, isMounted]);

  const handleAddHabit = (name: string, description: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      description,
      currentStreak: 0,
      longestStreak: 0,
      lastCompleted: null,
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleEditHabit = (id: string, name: string, description: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, name, description } : habit
      )
    );
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  const handleToggleHabit = (id: string, checked: boolean) => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id !== id) return habit;

        const todayStr = format(new Date(), 'yyyy-MM-dd');
        
        if (checked) {
          // If already marked for today, do nothing.
          if (habit.lastCompleted === todayStr) return habit;

          const lastDate = habit.lastCompleted ? parse(habit.lastCompleted, 'yyyy-MM-dd', new Date()) : null;
          const diff = lastDate ? differenceInCalendarDays(new Date(), lastDate) : Infinity;

          const newStreak = (diff === 1) ? habit.currentStreak + 1 : 1;

          return {
            ...habit,
            currentStreak: newStreak,
            longestStreak: Math.max(habit.longestStreak, newStreak),
            lastCompleted: todayStr,
          };
        } else {
          // If un-marking, only if it was marked today.
          if (habit.lastCompleted !== todayStr) return habit;
          
          // Revert to the state before today's completion.
          // This logic assumes a linear progression and is a simplified model.
          const yesterdayStr = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
          const newStreak = Math.max(0, habit.currentStreak - 1);

          return {
            ...habit,
            currentStreak: newStreak,
            lastCompleted: newStreak > 0 ? yesterdayStr : null
          };
        }
      })
    );
  };

  const completedTodayCount = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    return habits.filter(h => h.lastCompleted === todayStr).length;
  }, [habits]);

  if (!isMounted) {
    return (
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto max-w-3xl p-4 md:p-8">
        <AppHeader 
          habits={habits} 
          onAddHabit={handleAddHabit}
          completedTodayCount={completedTodayCount}
        />
        <HabitList
          habits={habits}
          onToggle={handleToggleHabit}
          onEdit={handleEditHabit}
          onDelete={handleDeleteHabit}
        />
      </div>
    </main>
  );
}
