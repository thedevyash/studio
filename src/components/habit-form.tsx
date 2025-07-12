"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Habit } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "Habit name must be at least 2 characters." }).max(50),
  description: z.string().max(100, { message: "Description can't be more than 100 characters." }).optional(),
});

type HabitFormValues = z.infer<typeof formSchema>;

interface HabitFormProps {
  onSave: (name: string, description: string) => void;
  onFinished: () => void;
  habit?: Habit;
}

export function HabitForm({ onSave, onFinished, habit }: HabitFormProps) {
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: habit?.name || "",
      description: habit?.description || "",
    },
  });

  function onSubmit(values: HabitFormValues) {
    onSave(values.name, values.description || "");
    onFinished();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Read for 15 minutes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A short description of your habit"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
           <Button type="button" variant="ghost" onClick={onFinished}>Cancel</Button>
           <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
