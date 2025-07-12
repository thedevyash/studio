
"use client";

import { useState, useEffect, useRef } from "react";
import type { Habit, UserProfile } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { generateMotivation } from "@/ai/flows/generate-motivation";
import { analyzeHabitStruggles } from "@/ai/flows/analyze-habit-struggles";
import { generateHabitStory, GenerateHabitStoryOutput } from "@/ai/flows/generate-habit-story";
import { Button } from "./ui/button";
import { Loader2, Sparkles, BrainCircuit, BookAudio, Play, Pause, RefreshCw } from "lucide-react";
import { differenceInCalendarDays, parseISO, isValid } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface MotivationModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  habit: Habit;
  completedToday: boolean;
}

export function MotivationModal({ isOpen, setOpen, habit, completedToday }: MotivationModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [storyLoading, setStoryLoading] = useState(false);
  const [motivation, setMotivation] = useState<string | null>(null);
  const [story, setStory] = useState<GenerateHabitStoryOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNudge, setIsNudge] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const lastCompletedDate = habit.lastCompleted ? parseISO(habit.lastCompleted) : null;
  const missedDays = isValid(lastCompletedDate) ? differenceInCalendarDays(new Date(), lastCompletedDate) : Infinity;
  const needsNudge = !completedToday && habit.lastCompleted && missedDays >= 3;
  const showStoryButton = habit.currentStreak >= 3;

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserProfile({ id: docSnap.id, ...docSnap.data() } as UserProfile);
        }
      }
    }
    fetchProfile();
  }, [user]);

  const fetchMotivation = async () => {
    setLoading(true);
    setError(null);
    setMotivation(null);
    setStory(null);
    setIsPlaying(false);
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
  
  const handleGenerateStory = async () => {
    if (!userProfile) return;
    setStoryLoading(true);
    setError(null);
    setStory(null);
    try {
      const result = await generateHabitStory({
        userName: userProfile.name || 'Friend',
        habitName: habit.name,
        streak: habit.currentStreak,
      });
      setStory(result);
    } catch(e) {
        setError("Failed to generate audio story. Please try again.");
        console.error(e);
    } finally {
      setStoryLoading(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
        if(isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchMotivation();
    } else {
      // Cleanup when modal closes
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setMotivation(null);
      setStory(null);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onEnded = () => setIsPlaying(false);
      
      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);
      audio.addEventListener('ended', onEnded);
      
      return () => {
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
        audio.removeEventListener('ended', onEnded);
      }
    }
  }, [story]);

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
        <div className="py-4 space-y-4">
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
          
          {story && (
              <div className="space-y-3 p-4 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0" onClick={togglePlay}>
                        {isPlaying ? <Pause className="h-5 w-5"/> : <Play className="h-5 w-5"/>}
                    </Button>
                    <p className="text-sm text-secondary-foreground italic">"{story.storyText}"</p>
                    {story.audioUrl && <audio ref={audioRef} src={story.audioUrl} />}
                </div>
              </div>
          )}
        </div>
        <div className="flex justify-between items-center">
            <div>
            {showStoryButton && !story && (
                <Button variant="outline" onClick={handleGenerateStory} disabled={storyLoading}>
                    {storyLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BookAudio className="mr-2 h-4 w-4"/>}
                    {storyLoading ? "Generating..." : "Get Story"}
                </Button>
            )}
            </div>
            <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
