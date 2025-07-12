
"use client"

import type { Habit } from "@/types";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "./ui/alert";
import { Terminal } from "lucide-react";

interface AppHeaderProps {
  habits: Habit[];
  onAddHabit: (name: string, description: string) => void;
  completedTodayCount: number;
}

export default function AppHeader({ habits, onAddHabit, completedTodayCount }: AppHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const totalHabits = habits.length;
  const progress = totalHabits > 0 ? (completedTodayCount / totalHabits) * 100 : 0;
  const isFirebaseConfigured = !!auth;

  const handleLogout = async () => {
    if (!auth) return;
    await auth.signOut();
    router.push('/login');
  }

  return (
    <header className="mb-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Habit Horizon
          </h1>
          <p className="text-muted-foreground mt-1">
            {user ? `Welcome, ${user.email}` : 'Welcome, Guest!'}
          </p>
        </div>
        <div className="flex items-center gap-4">
            <AddHabitDialog onSave={onAddHabit} />
            {user && (
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-5 w-5" />
              </Button>
            )}
        </div>
      </div>

      {!isFirebaseConfigured && (
         <Alert variant="default" className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <Terminal className="h-4 w-4" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <b>Demo Mode:</b> Firebase is not configured. Your data will not be saved.
            </AlertDescription>
          </Alert>
      )}

      {totalHabits > 0 && (
        <div className="bg-card p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">Habit Progress Today</span>
            <span className="text-sm font-bold text-primary">{completedTodayCount} / {totalHabits} Completed</span>
          </div>
          <Progress value={progress} className="h-2.5" />
        </div>
      )}
    </header>
  );
}
