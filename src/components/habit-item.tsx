"use client";

import { useState } from "react";
import type { Habit } from "@/types";
import { format, isToday, parseISO } from "date-fns";
import { Flame, MoreVertical, Pencil, Sparkles, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditHabitDialog } from "@/components/edit-habit-dialog";
import { MotivationModal } from "@/components/motivation-modal";

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string, checked: boolean) => void;
  onEdit: (id: string, name: string, description: string) => void;
  onDelete: (id: string) => void;
}

export function HabitItem({ habit, onToggle, onEdit, onDelete }: HabitItemProps) {
  const [isEditOpen, setEditOpen] = useState(false);
  const [isMotivationOpen, setMotivationOpen] = useState(false);

  const isCompletedToday = habit.lastCompleted ? isToday(parseISO(habit.lastCompleted + "T00:00:00")) : false;

  return (
    <>
      <Card className="transition-all hover:shadow-md">
        <CardContent className="p-4 flex items-center gap-4">
          <Checkbox
            id={`habit-${habit.id}`}
            checked={isCompletedToday}
            onCheckedChange={(checked) => onToggle(habit.id, !!checked)}
            className="w-6 h-6"
            aria-label={`Mark ${habit.name} as completed`}
          />
          <div className="flex-grow">
            <label htmlFor={`habit-${habit.id}`} className="font-semibold text-lg cursor-pointer">
              {habit.name}
            </label>
            <p className="text-sm text-muted-foreground">{habit.description}</p>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1" title="Current Streak">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-lg text-foreground">{habit.currentStreak}</span>
            </div>
            <div className="flex items-center gap-1 text-sm" title="Longest Streak">
              <Flame className="w-4 h-4" />
              <span>{habit.longestStreak}</span>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/50" onClick={() => setMotivationOpen(true)}>
             <Sparkles className="h-5 w-5" />
             <span className="sr-only">Get Motivation</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete(habit.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
      <EditHabitDialog
        isOpen={isEditOpen}
        setOpen={setEditOpen}
        habit={habit}
        onSave={(name, description) => onEdit(habit.id, name, description)}
      />
      <MotivationModal 
        isOpen={isMotivationOpen}
        setOpen={setMotivationOpen}
        habit={habit}
        completedToday={isCompletedToday}
      />
    </>
  );
}
