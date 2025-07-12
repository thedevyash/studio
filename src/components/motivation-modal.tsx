"use client";

import { useState, useEffect } from "react";
import type { Habit } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { generateMotivation, GenerateMotivationOutput } from "@/ai/flows/generate-motivation";
import { Button } from "./ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface MotivationModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  habit: Habit;
  completedToday: boolean;
}

export function MotivationModal({ isOpen, setOpen, habit, completedToday }: MotivationModalProps) {
  const [loading, setLoading] = useState(false);
  const [motivation, setMotivation] = useState<GenerateMotivationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMotivation = async () => {
    setLoading(true);
    setError(null);
    setMotivation(null);
    try {
      const result = await generateMotivation({
        habitName: habit.name,
        streak: habit.currentStreak,
        longestStreak: habit.longestStreak,
        completedToday,
      });
      setMotivation(result);
    } catch (e) {
      setError("Failed to generate motivation. Please try again later.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMotivation();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Your Daily Boost
          </DialogTitle>
          <DialogDescription>
            Here's a personalized message to keep you going on your journey with "{habit.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading && (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && <p className="text-destructive text-center">{error}</p>}
          {motivation && (
            <div className="p-4 bg-secondary rounded-lg">
                <p className="text-secondary-foreground">{motivation.message}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
            <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
