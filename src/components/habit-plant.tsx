
"use client";

import { cn } from "@/lib/utils";

interface HabitPlantProps {
  growthStage: number;
  isCompleted: boolean;
  onToggle: () => void;
}

export function HabitPlant({ growthStage, isCompleted, onToggle }: HabitPlantProps) {
  const stage = Math.max(0, Math.min(growthStage, 5));

  const stages = [
    // Stage 0: Sprout
    <g key={0} className="origin-bottom transition-transform duration-500 ease-out" style={{ transform: stage >= 0 ? 'scaleY(1)' : 'scaleY(0)' }}>
      <path d="M32 46 C 32 46, 32 40, 32 40" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 42 C 30 40, 26 38, 26 38" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 42 C 34 40, 38 38, 38 38" strokeWidth="2.5" strokeLinecap="round" />
    </g>,
    // Stage 1: Small Plant
    <g key={1} className="origin-bottom transition-transform duration-500 ease-out" style={{ transform: stage >= 1 ? 'scaleY(1)' : 'scaleY(0)' }}>
      <path d="M32 46 V 35" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 40 C 26 38, 24 32, 24 32" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 40 C 38 38, 40 32, 40 32" strokeWidth="2.5" strokeLinecap="round" />
    </g>,
    // Stage 2: More leaves
    <g key={2} className="origin-bottom transition-transform duration-500 ease-out" style={{ transform: stage >= 2 ? 'scaleY(1)' : 'scaleY(0)' }}>
      <path d="M32 35 C 28 33, 26 28, 26 28" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 35 C 36 33, 38 28, 38 28" strokeWidth="2.5" strokeLinecap="round" />
    </g>,
    // Stage 3: Taller
    <g key={3} className="origin-bottom transition-transform duration-500 ease-out" style={{ transform: stage >= 3 ? 'scaleY(1)' : 'scaleY(0)' }}>
      <path d="M32 35 V 25" strokeWidth="3" strokeLinecap="round" />
    </g>,
    // Stage 4: More leaves higher up
    <g key={4} className="origin-bottom transition-transform duration-500 ease-out" style={{ transform: stage >= 4 ? 'scaleY(1)' : 'scaleY(0)' }}>
      <path d="M32 28 C 26 26, 24 20, 24 20" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 28 C 38 26, 40 20, 40 20" strokeWidth="2.5" strokeLinecap="round" />
    </g>,
    // Stage 5: Flower/Fruit
    <g key={5} className="origin-center transition-transform duration-500 ease-out" style={{ transform: stage >= 5 ? 'scale(1)' : 'scale(0)', transformOrigin: '32px 18px' }}>
      <circle cx="32" cy="18" r="5" className={cn(isCompleted ? "fill-amber-300" : "fill-rose-400")} />
    </g>
  ];

  return (
    <button
      onClick={onToggle}
      aria-pressed={isCompleted}
      className="w-16 h-16 p-1 flex-shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
      title={isCompleted ? "Completed! Click to undo." : "Click to complete"}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path
          d="M20 54 Q 32 42, 44 54"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
        <g className={cn("stroke-green-600 dark:stroke-green-400 fill-none transition-colors duration-500", {
          "opacity-40 saturate-50": !isCompleted,
          "opacity-100 saturate-100": isCompleted,
        })}>
          {stages.slice(0, stage + 1)}
        </g>
        {isCompleted && (
          <g className="fill-yellow-400/20 stroke-yellow-500/80 animate-pulse">
            <circle cx="16" cy="18" r="1.5" />
            <circle cx="48" cy="18" r="1.5" />
            <circle cx="32" cy="10" r="1.5" />
          </g>
        )}
      </svg>
    </button>
  );
}
