"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HabitForm } from "@/components/habit-form";
import { PlusCircle } from "lucide-react";

interface AddHabitDialogProps {
  onSave: (name: string, description: string) => void;
}

export function AddHabitDialog({ onSave }: AddHabitDialogProps) {
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow">
          <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
          New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Habit</DialogTitle>
        </DialogHeader>
        <HabitForm onSave={onSave} onFinished={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
