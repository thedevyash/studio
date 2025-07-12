
"use client";

import { useState, useEffect, useMemo } from "react";
import type { Habit, ActivityData } from "@/types";
import { format, parse, differenceInCalendarDays } from "date-fns";
import AppHeader from "@/components/app-header";
import HabitList from "@/components/habit-list";
import ActivityTracker from "@/components/activity-tracker";
import { Skeleton } from "@/components/ui/skeleton";
import ConsistencyChart from "@/components/consistency-chart";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activityData, setActivityData] = useState<ActivityData>({ water: 0, exercise: false, date: format(new Date(), 'yyyy-MM-dd')});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // TODO: Fetch data from Firestore
      // For now, we'll just set the loaded state to true
      setIsDataLoaded(true);
    }
  }, [user]);

  const handleAddHabit = (name: string, description: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      description,
      currentStreak: 0,
      longestStreak: 0,
      lastCompleted: null,
      history: [],
      growthStage: 0,
    };
    // TODO: Save to Firestore
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleEditHabit = (id: string, name: string, description: string) => {
    // TODO: Update in Firestore
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, name, description } : habit
      )
    );
  };

  const handleDeleteHabit = (id: string) => {
    // TODO: Delete from Firestore
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  const handleToggleHabit = (id: string, checked: boolean) => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id !== id) return habit;

        const todayStr = format(new Date(), 'yyyy-MM-dd');
        
        let updatedHabit: Habit;

        if (checked) {
          if ((habit.history || []).includes(todayStr)) return habit;

          const lastDate = habit.lastCompleted ? parse(habit.lastCompleted, 'yyyy-MM-dd', new Date()) : null;
          const diff = lastDate ? differenceInCalendarDays(new Date(), lastDate) : Infinity;

          const newStreak = (diff === 1) ? habit.currentStreak + 1 : 1;
          const newHistory = [...(habit.history || []), todayStr].sort().reverse();
          
          const newGrowthStage = Math.min((habit.growthStage || 0) + 1, 5);

          updatedHabit = {
            ...habit,
            currentStreak: newStreak,
            longestStreak: Math.max(habit.longestStreak, newStreak),
            lastCompleted: todayStr,
            history: newHistory,
            growthStage: newGrowthStage,
          };
        } else {
          if (!(habit.history || []).includes(todayStr)) return habit;

          const newHistory = (habit.history || []).filter(d => d !== todayStr);
          const newStreak = habit.currentStreak > 0 ? habit.currentStreak - 1 : 0;
          const lastCompleted = newHistory.length > 0 ? newHistory[0] : null;
          const newGrowthStage = Math.max((habit.growthStage || 0) - 1, 0);

          updatedHabit = {
            ...habit,
            currentStreak: newStreak,
            lastCompleted: lastCompleted,
            history: newHistory,
            growthStage: newGrowthStage,
          };
        }
        // TODO: Update habit in Firestore
        return updatedHabit;
      })
    );
  };
  
  const handleUpdateActivity = (type: 'water' | 'exercise', value: number | boolean) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const newActivityData = {
      ...activityData,
      date: todayStr,
      [type]: value,
    };
    // TODO: Update activity data in Firestore
    setActivityData(newActivityData);
  };

  const completedTodayCount = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    return habits.filter(h => (h.history || []).includes(todayStr)).length;
  }, [habits]);

  if (loading || !isDataLoaded || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
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
