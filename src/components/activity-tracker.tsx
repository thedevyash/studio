
"use client";

import type { ActivityData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dumbbell, Minus, Plus, CheckCircle2, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityTrackerProps {
  data: ActivityData;
  onUpdate: (type: 'water' | 'exercise', value: number | boolean) => void;
}

const WaterGlass = ({ percentage }: { percentage: number }) => {
  const waterLevel = Math.max(0, Math.min(100, percentage));

  return (
    <div className="relative w-24 h-32" title={`${waterLevel.toFixed(0)}% full`}>
      <svg viewBox="0 0 100 120" className="w-full h-full">
        {/* Glass shape */}
        <path
          d="M10 115 L15 10 H85 L90 115 H10 Z"
          className="fill-secondary stroke-border"
          strokeWidth="3"
        />
        {/* Water fill */}
        <defs>
          <clipPath id="waterClip">
            <rect x="0" y={115 - (105 * waterLevel / 100)} width="100" height={120 * waterLevel / 100} />
          </clipPath>
        </defs>
        <g clipPath="url(#waterClip)">
          <path
            d="M10 115 L15 10 H85 L90 115 H10 Z"
            className="fill-blue-400"
          />
          {/* Water wave animation */}
          <path
            d="M -10,110 C 30,120 70,100 110,110 L 110 120 L -10 120 Z"
            className="fill-blue-500/50 opacity-50"
            style={{
                transform: `translateY(${115 - (105 * waterLevel / 100) - 105}px)`,
                animation: `wave 3s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite`
            }}
          />
        </g>
         {waterLevel === 100 && (
             <g className="fill-yellow-400 stroke-yellow-500/80 animate-pulse">
                <path d="M40 10 L50 0 L 60 10" strokeWidth="2" strokeLinecap="round" />
                <path d="M50 10 L 50 20" strokeWidth="2" strokeLinecap="round" />
                <path d="M30 20 L 70 20" strokeWidth="2" strokeLinecap="round" />
             </g>
        )}
      </svg>
      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(0) translateY(${115 - (105 * waterLevel / 100) - 105}px); }
          50% { transform: translateX(-10px) translateY(${115 - (105 * waterLevel / 100) - 105}px); }
          100% { transform: translateX(0) translateY(${115 - (105 * waterLevel / 100) - 105}px); }
        }
      `}</style>
    </div>
  );
};


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
        <div className="flex items-center justify-around gap-4">
          <WaterGlass percentage={waterPercentage} />
          <div className="flex flex-col items-center gap-2">
            <span className="font-medium text-muted-foreground">Water Intake</span>
            <span className="text-2xl font-bold">{data.water} / {waterGoal}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleWaterChange(-1)} disabled={data.water <= 0}>
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleWaterChange(1)}>
                <Plus className="h-4 w-4" />
              </Button>
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
