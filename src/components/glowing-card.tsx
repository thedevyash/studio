
"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { MouseEvent, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function GlowingCard({
  children,
  className,
  containerClassName,
}: PropsWithChildren<{ className?: string; containerClassName?: string }>) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "group relative w-full rounded-xl bg-slate-900/70 border border-white/10 shadow-2xl",
        containerClassName
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(167, 139, 250, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}
