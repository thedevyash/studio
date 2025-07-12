"use client";

import { useState, useEffect, useMemo } from "react";
import type { Habit, ActivityData } from "@/types";
import { format, parse, differenceInCalendarDays, subDays } from "date-fns";
import AppHeader from "@/components/app-header";
import HabitList from "@/components/habit-list";
import ActivityTracker from "@/components/activity-tracker";
import { Skeleton } from "@/components/ui/skeleton";
import ConsistencyChart from "@/components/consistency-chart";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activityData, setActivityData] = useState<ActivityData>({ water: 0, exercise: false, date: format(new Date(), 'yyyy-MM-dd')});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedHabits = localStorage.getItem("habits");
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      }
      const storedActivity = localStorage.getItem("activity");
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      if (storedActivity) {
        const parsedActivity: ActivityData = JSON.parse(storedActivity);
        // Reset if the stored data is not for today
        if (parsedActivity.date === todayStr) {
          setActivityData(parsedActivity);
        } else {
          localStorage.setItem("activity", JSON.stringify({ ...activityData, date: todayStr }));
        }
      } else {
        localStorage.setItem("activity", JSON.stringify({ ...activityData, date: todayStr }));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      localStorage.removeItem("habits");
      localStorage.removeItem("activity");
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("activity", JSON.stringify(activityData));
    }
  }, [activityData, isMounted]);

  const handleAddHabit = (name: string, description: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      description,
      currentStreak: 0,
      longestStreak: 0,
      lastCompleted: null,
      history: [],
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
          if (habit.history.includes(todayStr)) return habit;

          const lastDate = habit.lastCompleted ? parse(habit.lastCompleted, 'yyyy-MM-dd', new Date()) : null;
          const diff = lastDate ? differenceInCalendarDays(new Date(), lastDate) : Infinity;

          const newStreak = (diff === 1) ? habit.currentStreak + 1 : 1;
          const newHistory = [...habit.history, todayStr].sort().reverse();

          return {
            ...habit,
            currentStreak: newStreak,
            longestStreak: Math.max(habit.longestStreak, newStreak),
            lastCompleted: todayStr,
            history: newHistory,
          };
        } else {
          if (!habit.history.includes(todayStr)) return habit;

          const newHistory = habit.history.filter(d => d !== todayStr);
          // Simplified streak recalculation. A more robust solution would re-evaluate the entire history.
          const newStreak = habit.currentStreak > 0 ? habit.currentStreak - 1 : 0;
          const lastCompleted = newHistory.length > 0 ? newHistory[0] : null;

          return {
            ...habit,
            currentStreak: newStreak,
            lastCompleted: lastCompleted,
            history: newHistory,
          };
        }
      })
    );
  };

  const handleUpdateActivity = (type: 'water' | 'exercise', value: number | boolean) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    setActivityData(prev => {
      // If the date changed, reset the values
      if(prev.date !== todayStr) {
        return {
          date: todayStr,
          water: type === 'water' ? (value as number) : 0,
          exercise: type === 'exercise' ? (value as boolean) : false,
        }
      }
      return { ...prev, [type]: value };
    });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ActivityTracker 
            data={activityData}
            onUpdate={handleUpdateActivity}
          />
          <ConsistencyChart habits={habits} />
        </div>
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
