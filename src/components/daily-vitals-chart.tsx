
"use client"

import * as React from "react"
import { subDays, format } from "date-fns"
import { Bar, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ActivityData } from "@/types"

interface DailyVitalsChartProps {
  activityData: ActivityData[]
}

export default function DailyVitalsChart({ activityData }: DailyVitalsChartProps) {
  const chartData = React.useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
    
    return last7Days.map(day => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayName = format(day, "eee");
      const dayData = activityData.find(d => d.date === dateStr);
      
      return {
        date: dayName,
        water: dayData?.water || 0,
        exercise: dayData?.exercise ? 1 : 0,
      };
    });
  }, [activityData]);

  const chartConfig = {
    water: {
      label: "Water (Glasses)",
      color: "hsl(var(--chart-1))",
    },
    exercise: {
      label: "Exercise",
      color: "hsl(var(--chart-4))",
    },
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Daily Vitals</CardTitle>
        <CardDescription>Water and exercise over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
          <ComposedChart accessibilityLayer data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
             <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent formatter={(value, name) => {
                  if (name === "exercise") {
                    return value === 1 ? "Completed" : "Not Completed";
                  }
                  return value;
              }} />}
            />
            <Bar dataKey="water" fill="var(--color-water)" radius={4} barSize={20} />
            <Line type="monotone" dataKey="exercise" stroke="var(--color-exercise)" strokeWidth={2} dot={{r: 4, fill: "var(--color-exercise)"}} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
