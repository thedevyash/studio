
"use client";

import { motion } from "framer-motion";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  index: number;
}

export function TestimonialCard({ quote, name, role, index }: TestimonialCardProps) {
    const variants = {
        offscreen: {
          y: 50,
          opacity: 0,
        },
        onscreen: {
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
            delay: index * 0.1,
          },
        },
      };

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.5 }}
      variants={variants}
    >
      <div className="flex flex-col justify-between h-full p-6 rounded-lg glass-card">
        <blockquote className="italic text-slate-300">"{quote}"</blockquote>
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="font-semibold text-white">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

    