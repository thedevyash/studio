
"use client";

import { Suspense } from 'react';
import { motion } from "framer-motion";
import Spline from '@splinetool/react-spline';

interface SplashScreenProps {
  onFinished: () => void;
}

const letterContainerVariants = {
  hidden: { opacity: 0 },
  visible: (i: number = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: i * 0.1 },
  }),
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
    },
  },
};

export function SplashScreen({ onFinished }: SplashScreenProps) {
  const text = "IT'S ABOUT TIME";
  const words = text.split(" ");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 4 }}
      onAnimationComplete={onFinished}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="absolute inset-0">
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
            <Spline scene="https://prod.spline.design/iW1n5s0dYfdxXwhE/scene.splinecode" />
        </Suspense>
      </div>
      <motion.h1
        variants={letterContainerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 flex text-4xl md:text-6xl lg:text-8xl font-headline text-white tracking-widest"
      >
        {words.map((word, wordIndex) => (
          <motion.span key={wordIndex} className="mr-6 md:mr-10 whitespace-nowrap">
            {Array.from(word).map((letter, letterIndex) => (
              <motion.span key={letterIndex} variants={letterVariants}>
                {letter}
              </motion.span>
            ))}
          </motion.span>
        ))}
      </motion.h1>
    </motion.div>
  );
}
