
"use client";

import type { ActivityData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dumbbell, GlassWater, Minus, Plus, CheckCircle2, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityTrackerProps {
  data: ActivityData;
  onUpdate: (type: 'water' | 'exercise', value: number | boolean) => void;
}

export default function ActivityTracker({ data, onUpdate }: ActivityTrackerProps) {
  const handleWaterChange = (amount: number) => {
    const newValue = Math.max(0, data.water + amount);
    onUpdate('water', newValue);
  };

  const waterGoal = 8;
  const waterPercentage = Math.min((data.water / waterGoal) * 100, 100);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg">Daily Vitals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Water Tracker */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GlassWater className="w-6 h-6 text-blue-500" />
              <span className="font-medium">Water Intake</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleWaterChange(-1)} disabled={data.water <= 0}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-bold w-12 text-center">{data.water} / {waterGoal}</span>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleWaterChange(1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative h-24 w-full bg-secondary rounded-lg flex items-end">
            <div 
              className="absolute bottom-0 w-full bg-blue-400 rounded-lg transition-all duration-500 ease-in-out"
              style={{ height: `${waterPercentage}%` }}
            >
                {waterPercentage === 100 && (
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Award className="w-10 h-10 text-white/80 animate-pulse" />
                     </div>
                )}
            </div>
            <div className="relative w-full h-full p-2">
              <div className="w-full h-full border-2 border-border/50 rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Exercise Tracker */}
        <div 
            className={cn(
                "p-4 rounded-lg transition-all duration-300", 
                data.exercise ? "bg-green-100 dark:bg-green-900/30" : "bg-card"
            )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className={cn("w-6 h-6 transition-colors", data.exercise ? "text-green-600 dark:text-green-400" : "text-muted-foreground")} />
              <label htmlFor="exercise-check" className="font-medium cursor-pointer">
                {data.exercise ? "Activity Complete!" : "Physical Activity"}
              </label>
            </div>
            {data.exercise ? (
                <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
            ) : (
                <Checkbox 
                    id="exercise-check"
                    checked={data.exercise}
                    onCheckedChange={(checked) => onUpdate('exercise', !!checked)}
                    className="h-6 w-6"
                />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
