
"use client"

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddFriendDialogProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onAddFriend: (email: string) => Promise<{ success: boolean; message: string }>;
}

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export function AddFriendDialog({ isOpen, setOpen, onAddFriend }: AddFriendDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const result = await onAddFriend(values.email);
    setLoading(false);

    toast({
      variant: result.success ? "default" : "destructive",
      title: result.success ? "Success" : "Error",
      description: result.message,
    });

    if (result.success) {
      setOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Friend</DialogTitle>
          <DialogDescription>
            Enter your friend's email address to add them. They must have an account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Friend's Email</FormLabel>
                  <FormControl>
                    <Input placeholder="friend@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Friend
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
