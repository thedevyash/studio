
"use client"

import { useState, useEffect } from "react";
import type { UserProfile } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, User, Users } from "lucide-react";
import { AddFriendDialog } from "./add-friend-dialog";
import { getFirestore, collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { Skeleton } from "./ui/skeleton";

interface FriendsListProps {
  userProfile: UserProfile;
  onAddFriend: (email: string) => Promise<{ success: boolean; message: string }>;
}

export default function FriendsList({ userProfile, onAddFriend }: FriendsListProps) {
  const [isAddFriendOpen, setAddFriendOpen] = useState(false);
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
        setLoading(true);
        if (!userProfile.friends || userProfile.friends.length === 0) {
            setFriends([]);
            setLoading(false);
            return;
        }

        const db = getFirestore(app);
        try {
            const friendPromises = userProfile.friends.map(friendId => {
                const friendRef = doc(db, "users", friendId);
                return getDoc(friendRef);
            });
            const friendSnapshots = await Promise.all(friendPromises);
            const friendData = friendSnapshots
                .filter(docSnap => docSnap.exists())
                .map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as UserProfile));
            setFriends(friendData);
        } catch (error) {
            console.error("Error fetching friends:", error);
            setFriends([]); // Clear friends on error
        } finally {
            setLoading(false);
        }
    };
    
    fetchFriends();
  }, [userProfile.friends]);
  
  const getInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : "??";
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Friends</CardTitle>
            <CardDescription>See your friends' progress and motivate each other.</CardDescription>
          </div>
          <Button onClick={() => setAddFriendOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Friend
          </Button>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </div>
          )}
          {!loading && friends.length === 0 && (
            <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-lg">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No friends yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Add friends to start sharing your journey.</p>
            </div>
          )}
          {!loading && friends.length > 0 && (
             <div className="space-y-4">
                {friends.map(friend => (
                    <div key={friend.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={friend.photoURL} alt={friend.name} data-ai-hint="profile picture" />
                                <AvatarFallback>{getInitials(friend.email)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{friend.name || friend.email}</p>
                                {friend.name && <p className="text-sm text-muted-foreground">{friend.email}</p>}
                            </div>
                        </div>
                        {/* Placeholder for future stats */}
                        <Button variant="outline" size="sm">View Progress</Button>
                    </div>
                ))}
             </div>
          )}
        </CardContent>
      </Card>
      <AddFriendDialog
        isOpen={isAddFriendOpen}
        setOpen={setAddFriendOpen}
        onAddFriend={onAddFriend}
      />
    </>
  );
}
