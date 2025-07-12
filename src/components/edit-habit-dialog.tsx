"use client"

import type { Habit } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HabitForm } from "@/components/habit-form";

interface EditHabitDialogProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  habit: Habit;
  onSave: (name: string, description: string) => void;
}

export function EditHabitDialog({ isOpen, setOpen, habit, onSave }: EditHabitDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <HabitForm habit={habit} onSave={onSave} onFinished={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
