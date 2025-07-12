
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Habit, ActivityData, UserProfile } from "@/types";
import { format, parse, differenceInCalendarDays, subDays } from "date-fns";
import AppHeader from "@/components/app-header";
import HabitList from "@/components/habit-list";
import ActivityTracker from "@/components/activity-tracker";
import { Skeleton } from "@/components/ui/skeleton";
import ConsistencyChart from "@/components/consistency-chart";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { app, db } from "@/lib/firebase";
import { getFirestore, collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, where, writeBatch, updateDoc, arrayUnion, limit, orderBy } from "firebase/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendsList from "@/components/friends-list";
import DailyVitalsChart from "@/components/daily-vitals-chart";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activityData, setActivityData] = useState<ActivityData>({ water: 0, exercise: false, date: format(new Date(), 'yyyy-MM-dd')});
  const [historicalActivity, setHistoricalActivity] = useState<ActivityData[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const setupInitialData = useCallback(async (uid: string) => {
    const db = getFirestore(app);
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const userHabitsRef = collection(db, "users", uid, "habits");
    const userActivityRef = doc(db, "users", uid, "activity", todayStr);
    
    const habitsSnapshot = await getDocs(userHabitsRef);
    if (habitsSnapshot.empty) {
      // No habits, add a default one
      const welcomeHabit: Omit<Habit, 'id'> = {
        name: "Log your first habit!",
        description: "Complete this to get started.",
        currentStreak: 0,
        longestStreak: 0,
        lastCompleted: null,
        history: [],
        growthStage: 0,
      };
      const newHabitRef = doc(userHabitsRef);
      await setDoc(newHabitRef, welcomeHabit);
    }
    
    const activitySnap = await getDoc(userActivityRef);
    if (!activitySnap.exists()) {
      await setDoc(userActivityRef, { water: 0, exercise: false, date: todayStr });
    }
    
  }, []);

  useEffect(() => {
    if (user) {
      const db = getFirestore(app);
      const unsubscribes: (() => void)[] = [];
      const todayStr = format(new Date(), 'yyyy-MM-dd');

      const userProfileRef = doc(db, "users", user.uid);
      const profileUnsubscribe = onSnapshot(userProfileRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile({ id: docSnap.id, ...docSnap.data() } as UserProfile);
        } else {
          // Create profile if it doesn't exist
          const newProfile: Omit<UserProfile, 'id'> = { email: user.email!, name: user.email!.split('@')[0], friends: [] };
          setDoc(userProfileRef, newProfile);
        }
      });
      unsubscribes.push(profileUnsubscribe);

      const habitsRef = collection(db, "users", user.uid, "habits");
      const habitsUnsubscribe = onSnapshot(habitsRef, (snapshot) => {
        const habitsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
        setHabits(habitsData);
        if(!isDataLoaded) setIsDataLoaded(true);
      }, (error) => {
        console.error("Error fetching habits:", error);
      });
      unsubscribes.push(habitsUnsubscribe);
      
      const activityRef = doc(db, "users", user.uid, "activity", todayStr);
      const activityUnsubscribe = onSnapshot(activityRef, (docSnap) => {
        if(docSnap.exists()){
          setActivityData(docSnap.data() as ActivityData);
        }
      });
      unsubscribes.push(activityUnsubscribe);
      
      // Fetch historical activity data
      const sevenDaysAgo = format(subDays(new Date(), 6), 'yyyy-MM-dd');
      const activityHistoryQuery = query(
        collection(db, "users", user.uid, "activity"),
        where('date', '>=', sevenDaysAgo),
        orderBy('date', 'desc')
      );
      const historyUnsubscribe = onSnapshot(activityHistoryQuery, (snapshot) => {
        const historyData = snapshot.docs.map(doc => doc.data() as ActivityData);
        setHistoricalActivity(historyData);
      });
      unsubscribes.push(historyUnsubscribe);

      setupInitialData(user.uid);

      return () => unsubscribes.forEach(unsub => unsub());
    }
  }, [user, isDataLoaded, setupInitialData]);

  const handleAddHabit = async (name: string, description: string) => {
    if (!user) return;
    const db = getFirestore(app);
    const newHabit: Omit<Habit, 'id'> = {
      name,
      description,
      currentStreak: 0,
      longestStreak: 0,
      lastCompleted: null,
      history: [],
      growthStage: 0,
    };
    const newHabitRef = doc(collection(db, "users", user.uid, "habits"));
    await setDoc(newHabitRef, newHabit);
  };

  const handleEditHabit = async (id: string, name: string, description: string) => {
     if (!user) return;
     const db = getFirestore(app);
     const habitRef = doc(db, "users", user.uid, "habits", id);
     await setDoc(habitRef, { name, description }, { merge: true });
  };

  const handleDeleteHabit = async (id: string) => {
    if (!user) return;
    const db = getFirestore(app);
    const habitRef = doc(db, "users", user.uid, "habits", id);
    const batch = writeBatch(db);
    batch.delete(habitRef);
    await batch.commit();
  };

  const handleToggleHabit = (id: string, checked: boolean) => {
    if (!user) return;
    const db = getFirestore(app);
    const habitToUpdate = habits.find(h => h.id === id);
    if (!habitToUpdate) return;
    
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    let updatedHabit: Habit;

    if (checked) {
        if ((habitToUpdate.history || []).includes(todayStr)) return;

        const lastDate = habitToUpdate.lastCompleted ? parse(habitToUpdate.lastCompleted, 'yyyy-MM-dd', new Date()) : null;
        const diff = lastDate ? differenceInCalendarDays(new Date(), lastDate) : Infinity;

        const newStreak = (diff === 1) ? habitToUpdate.currentStreak + 1 : 1;
        const newHistory = [...(habitToUpdate.history || []), todayStr].sort().reverse();
        
        const newGrowthStage = Math.min((habitToUpdate.growthStage || 0) + 1, 5);

        updatedHabit = {
          ...habitToUpdate,
          currentStreak: newStreak,
          longestStreak: Math.max(habitToUpdate.longestStreak, newStreak),
          lastCompleted: todayStr,
          history: newHistory,
          growthStage: newGrowthStage,
        };
    } else {
        if (!(habitToUpdate.history || []).includes(todayStr)) return;

        const newHistory = (habitToUpdate.history || []).filter(d => d !== todayStr);
        const newStreak = habitToUpdate.currentStreak > 0 ? habitToUpdate.currentStreak - 1 : 0;
        const lastCompleted = newHistory.length > 0 ? newHistory[0] : null;
        const newGrowthStage = Math.max((habitToUpdate.growthStage || 0) - 1, 0);

        updatedHabit = {
          ...habitToUpdate,
          currentStreak: newStreak,
          lastCompleted: lastCompleted,
          history: newHistory,
          growthStage: newGrowthStage,
        };
    }

    const habitRef = doc(db, "users", user.uid, "habits", id);
    setDoc(habitRef, updatedHabit);
  };
  
  const handleUpdateActivity = async (type: 'water' | 'exercise', value: number | boolean) => {
    if(!user) return;
    const db = getFirestore(app);
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const newActivityData = {
      ...activityData,
      date: todayStr,
      [type]: value,
    };
    const activityRef = doc(db, "users", user.uid, "activity", todayStr);
    await setDoc(activityRef, newActivityData, { merge: true });
    setActivityData(newActivityData);
  };
  
  const handleAddFriend = async (email: string) => {
    if (!user || !userProfile) return { success: false, message: "You must be logged in to add friends." };
    if (user.email === email) return { success: false, message: "You cannot add yourself." };
  
    try {
      const db = getFirestore(app);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email), limit(1));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        return { success: false, message: "User not found with that email." };
      }
  
      const friendDoc = querySnapshot.docs[0];
      const friendId = friendDoc.id;
  
      if ((userProfile.friends || []).includes(friendId)) {
        return { success: false, message: "This user is already your friend." };
      }
  
      const userProfileRef = doc(db, "users", user.uid);
      const friendProfileRef = doc(db, "users", friendId);
      
      const batch = writeBatch(db);
      batch.update(userProfileRef, { friends: arrayUnion(friendId) });
      batch.update(friendProfileRef, { friends: arrayUnion(user.uid) });
      await batch.commit();
  
      return { success: true, message: `Successfully added ${friendDoc.data().name || email} as a friend!` };
  
    } catch (error: any) {
        console.error("Error adding friend:", error);
        return { success: false, message: "An error occurred while adding a friend. Please ensure your Firestore security rules and indexes are set up correctly." };
    }
  };

  const completedTodayCount = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    return habits.filter(h => (h.history || []).includes(todayStr)).length;
  }, [habits]);

  if (loading || !isDataLoaded || !user || !userProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6 md:p-8">
      <AppHeader 
        userProfile={userProfile} 
        onAddHabit={handleAddHabit}
        completedTodayCount={completedTodayCount}
        totalHabits={habits.length}
      />
      <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-primary/10">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <ActivityTracker 
                      data={activityData}
                      onUpdate={handleUpdateActivity}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ConsistencyChart habits={habits} />
                    <DailyVitalsChart activityData={historicalActivity} />
                  </div>
              </div>
              <HabitList
                  habits={habits}
                  onToggle={handleToggleHabit}
                  onEdit={handleEditHabit}
                  onDelete={handleDeleteHabit}
              />
          </TabsContent>
          <TabsContent value="friends" className="mt-6">
              <FriendsList
                userProfile={userProfile}
                onAddFriend={handleAddFriend}
              />
          </TabsContent>
      </Tabs>
    </div>
  );
}
