
"use client";

import type { ActivityData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dumbbell, GlassWater, Minus, Plus } from "lucide-react";

interface ActivityTrackerProps {
  data: ActivityData;
  onUpdate: (type: 'water' | 'exercise', value: number | boolean) => void;
}

export default function ActivityTracker({ data, onUpdate }: ActivityTrackerProps) {
  const handleWaterChange = (amount: number) => {
    const newValue = Math.max(0, data.water + amount);
    onUpdate('water', newValue);
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Daily Vitals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Water Tracker */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GlassWater className="w-6 h-6 text-blue-500" />
            <span className="font-medium">Water Intake</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleWaterChange(-1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-bold w-10 text-center">{data.water}</span>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleWaterChange(1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Exercise Tracker */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-6 h-6 text-green-500" />
            <label htmlFor="exercise-check" className="font-medium cursor-pointer">Physical Activity</label>
          </div>
          <Checkbox 
            id="exercise-check"
            checked={data.exercise}
            onCheckedChange={(checked) => onUpdate('exercise', !!checked)}
            className="h-6 w-6"
          />
        </div>
      </CardContent>
    </Card>
  );
}
