
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { app, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { UserProfile } from "@/types";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function SignUpPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      // Create a user profile document in Firestore
      const userProfile: Omit<UserProfile, 'id'> = {
        email: userCredential.user.email!,
        friends: [],
      };
      await setDoc(doc(db, "users", userCredential.user.uid), userProfile);

      router.push("/");
    } catch (error: any) {
      let description = "An unexpected error occurred. Please try again.";
      switch (error.code) {
        case "auth/email-already-in-use":
          description = "This email address is already in use by another account.";
          break;
        case "auth/invalid-email":
          description = "The email address is not valid.";
          break;
        case "auth/weak-password":
          description = "The password is too weak. It must be at least 6 characters long.";
          break;
        default:
          description = "An unknown error occurred.";
          break;
      }
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: description,
      });
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input id="email" type="email" placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                     <FormControl>
                      <Input id="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create account
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
