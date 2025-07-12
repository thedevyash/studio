
"use client"

import type { UserProfile } from "@/types";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AppHeaderProps {
  userProfile: UserProfile | null;
  onAddHabit: (name: string, description: string) => void;
  completedTodayCount: number;
  totalHabits: number;
}

export default function AppHeader({ userProfile, onAddHabit, completedTodayCount, totalHabits }: AppHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const progress = totalHabits > 0 ? (completedTodayCount / totalHabits) * 100 : 0;
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/landing');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  const getInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : "??";
  }

  return (
    <header className="mb-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Habit Horizon
          </h1>
          <p className="text-muted-foreground mt-1">
            {userProfile?.name ? `Welcome, ${userProfile.name}` : `Welcome!`}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
            <AddHabitDialog onSave={onAddHabit} />
            {user && userProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userProfile.photoURL} alt={userProfile.name} data-ai-hint="profile picture" />
                      <AvatarFallback>{getInitials(userProfile.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userProfile.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userProfile.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                     <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
        </div>
      </div>

      {totalHabits > 0 && (
        <div className="bg-card/60 backdrop-blur-xl border border-white/10 p-4 rounded-lg shadow-lg">
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
