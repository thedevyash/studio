
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
import { analyzeHabitStruggles, AnalyzeHabitStrugglesOutput } from "@/ai/flows/analyze-habit-struggles";
import { Button } from "./ui/button";
import { Loader2, Sparkles, BrainCircuit } from "lucide-react";
import { differenceInCalendarDays, parseISO } from "date-fns";

interface MotivationModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  habit: Habit;
  completedToday: boolean;
}

export function MotivationModal({ isOpen, setOpen, habit, completedToday }: MotivationModalProps) {
  const [loading, setLoading] = useState(false);
  const [motivation, setMotivation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNudge, setIsNudge] = useState(false);

  const missedDays = habit.lastCompleted ? differenceInCalendarDays(new Date(), parseISO(habit.lastCompleted)) : 0;
  const needsNudge = !completedToday && habit.lastCompleted && missedDays >= 3;

  const fetchMotivation = async () => {
    setLoading(true);
    setError(null);
    setMotivation(null);
    setIsNudge(needsNudge);
    
    try {
      let result;
      if (needsNudge) {
        result = await analyzeHabitStruggles({
          habitName: habit.name,
          habitDescription: habit.description,
          missedDays: missedDays,
        });
        setMotivation(result.suggestion);
      } else {
        result = await generateMotivation({
          habitName: habit.name,
          streak: habit.currentStreak,
          longestStreak: habit.longestStreak,
          completedToday,
        });
        setMotivation(result.message);
      }
    } catch (e) {
      setError("Failed to generate AI insight. Please try again later.");
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
            {isNudge ? (
                <BrainCircuit className="w-6 h-6 text-accent" />
            ) : (
                <Sparkles className="w-6 h-6 text-primary" />
            )}
            {isNudge ? "A Helpful Nudge" : "Your Daily Boost"}
          </DialogTitle>
          <DialogDescription>
            {isNudge
              ? `A personalized tip for your "${habit.name}" habit.`
              : `Here's a message to keep you going on your journey with "${habit.name}".`}
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
                <p className="text-secondary-foreground leading-relaxed">{motivation}</p>
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
