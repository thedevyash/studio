
"use client"

import * as React from "react"
import { subDays, format, isAfter } from "date-fns"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import type { Habit } from "@/types"

interface ConsistencyChartProps {
  habits: Habit[]
}

export default function ConsistencyChart({ habits }: ConsistencyChartProps) {
  const chartData = React.useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
    
    return last7Days.map(day => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayName = format(day, "eee");
      const completed = habits.filter(habit => (habit.history || []).includes(dateStr)).length;
      return {
        date: dayName,
        completed,
      };
    });
  }, [habits]);

  const chartConfig = {
    completed: {
      label: "Completed Habits",
      color: "hsl(var(--primary))",
    },
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Weekly Consistency</CardTitle>
        <CardDescription>Habits completed over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
