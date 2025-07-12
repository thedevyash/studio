
"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface HowItWorksStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function HowItWorksStep({ icon: Icon, title, description, index }: HowItWorksStepProps) {
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
        delay: index * 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.8 }}
      variants={variants}
      className="relative flex flex-col items-center text-center"
    >
      <div className="absolute -top-8 bg-background p-1 rounded-full z-10">
         <div className="bg-primary/20 p-4 rounded-full ring-8 ring-background">
            <Icon className="w-8 h-8 text-primary" />
         </div>
      </div>
      <div className="pt-12 p-6 glass-card w-full h-full">
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
    </motion.div>
  );
}
