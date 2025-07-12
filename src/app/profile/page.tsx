
"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types";
import { generateAvatar } from "@/ai/flows/generate-avatar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, Wand2 } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().max(50, { message: "Name must not be longer than 50 characters." }).min(2, { message: "Name must be at least 2 characters." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userProfile = { id: docSnap.id, ...docSnap.data() } as UserProfile;
          setProfile(userProfile);
          form.reset({ name: userProfile.name || '' });
        }
        setPageLoading(false);
      }
    }
    fetchProfile();
  }, [user, form]);

  const handleGenerateAvatar = async () => {
    if (!user || !profile) return;
    setIsGenerating(true);
    try {
      // 1. Generate the image with Genkit
      const result = await generateAvatar({ name: profile.name || profile.email });
      const imageDataUri = result.imageUrl;

      // 2. Upload the base64 data to Firebase Storage
      const storageRef = ref(storage, `profile-pics/${user.uid}`);
      const snapshot = await uploadString(storageRef, imageDataUri, 'data_url');
      const photoURL = await getDownloadURL(snapshot.ref);

      // 3. Update the user's profile in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { photoURL });

      setProfile(prev => prev ? { ...prev, photoURL } : null);
      toast({ title: "Success", description: "New avatar generated and saved!" });

    } catch (error) {
      console.error("Error generating avatar:", error);
      toast({ variant: "destructive", title: "Generation Failed", description: "Could not generate a new avatar." });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    setIsSaving(true);
    try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { name: data.name });
        setProfile(prev => prev ? { ...prev, name: data.name } : null);
        toast({ title: "Success", description: "Your profile has been updated." });
    } catch (error) {
        console.error("Error updating profile:", error);
        toast({ variant: "destructive", title: "Update Failed", description: "Could not update your profile." });
    } finally {
        setIsSaving(false);
    }
  }
  
  const getInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : "??";
  }

  if (authLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>Manage your personal information and generate your AI avatar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
                <Avatar className="h-28 w-28 border-2 border-primary/50">
                    <AvatarImage src={profile?.photoURL} alt={profile?.name} />
                    <AvatarFallback className="text-4xl">
                        {profile ? getInitials(profile.email) : <Loader2 className="h-8 w-8 animate-spin" />}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold">{profile?.name || 'Your Name'}</h2>
                    <p className="text-muted-foreground">{profile?.email}</p>
                     <Button onClick={handleGenerateAvatar} disabled={isGenerating} className="mt-4">
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4"/>} 
                        Generate New Avatar
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your display name" {...field} />
                        </FormControl>
                        <FormDescription>
                            This name will be displayed to others and used to inspire your avatar.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
