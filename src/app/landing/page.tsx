
"use client";

import { useState, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, Sparkles, BrainCircuit, Users, Target, BarChart, MessageSquare, Heart } from "lucide-react";
import LoginPage from "../login/page";
import SignUpPage from "../signup/page";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HowItWorksStep } from "@/components/how-it-works-step";
import { TestimonialCard } from "@/components/testimonial-card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Leaf,
    title: "Intuitive Habit Tracking",
    description: "Easily log your habits with a single click. Our beautiful interface helps you visualize your progress and stay motivated day after day.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Motivation",
    description: "Feeling stuck? Get personalized encouragement and tips from our AI coach, tailored to your progress and current streak.",
  },
  {
    icon: BrainCircuit,
    title: "Adaptive Suggestions",
    description: "Our AI analyzes your patterns and offers smart suggestions—like adjusting your schedule or breaking down habits—to help you overcome obstacles.",
  },
  {
    icon: Users,
    title: "Build a Community",
    description: "Connect with friends, share your progress, and cheer each other on. Building habits is easier when you're not alone.",
  },
];

const howItWorks = [
    {
      icon: Target,
      title: "Create Your Habit",
      description: "Define a new habit you want to build, from reading more to exercising daily.",
    },
    {
      icon: BarChart,
      title: "Track Your Progress",
      description: "Log your daily completions and watch your habit plant grow with every success.",
    },
    {
      icon: MessageSquare,
      title: "Get AI Insights",
      description: "Receive smart nudges and motivational boosts to keep you on the right path.",
    },
];

const testimonials = [
    {
        quote: "Habit Horizon changed the game for me. The AI motivation is surprisingly insightful and kept me going when I wanted to quit.",
        name: "Jessica L.",
        role: "Early Adopter",
    },
    {
        quote: "I love the little plant that grows! It's such a simple but powerful visual metaphor for my progress. Plus, competing with friends is a blast.",
        name: "Mark T.",
        role: "Beta Tester",
    },
    {
        quote: "Finally, a habit tracker that doesn't just feel like another chore. It’s beautiful, smart, and genuinely helpful.",
        name: "Sarah K.",
        role: "Productivity Enthusiast",
    },
];

const cardVariants = {
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
    },
  },
};

function LandingPageContent() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [showAuth, setShowAuth] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-40 glass-header">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <h2 className="font-bold text-xl text-white">Habit Horizon</h2>
                    {user ? (
                         <Button onClick={() => router.push('/dashboard')} size="sm">Dashboard</Button>
                    ) : (
                         <Button onClick={() => setShowAuth(true)} size="sm">Sign In / Sign Up</Button>
                    )}
                </div>
            </header>
            
            <div className="relative text-center pt-24">
                <div className="hero-background-image" data-ai-hint="hero background" />
                <div className="container mx-auto px-4">
                    <div className="py-24 md:py-32">
                         <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl mx-auto"
                        >
                            <div className="glass-card p-6 md:p-10">
                                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
                                    Build Better Habits with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Habit Horizon</span>
                                </h1>
                                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mt-4">
                                    Your intelligent partner in personal growth. Track, analyze, and conquer your goals with the power of AI.
                                </p>
                                <Button size="lg" onClick={() => setShowAuth(true)} className="mt-8 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow">
                                    Get Started Free
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto px-4">
                <section className="pt-32 pb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Why Habit Horizon?</h2>
                        <p className="text-md md:text-lg text-muted-foreground mt-2">Go beyond simple tracking. We help you understand your habits.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial="offscreen"
                            whileInView="onscreen"
                            viewport={{ once: true, amount: 0.5 }}
                            variants={cardVariants}
                            className="glass-card p-6 rounded-lg h-full flex flex-col"
                        >
                            <div className="flex items-start space-x-4 text-left">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-lg">{feature.title}</h3>
                                    <p className="text-sm text-slate-300 mt-1">{feature.description}</p>
                                </div>
                            </div>
                            <div className="flex-grow flex items-center justify-center mt-6 min-h-[120px]">
                                <div className="relative w-48 h-24">
                                    <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/20 rounded-full filter blur-2xl opacity-50 animate-pulse"></div>
                                    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-accent/20 rounded-full filter blur-2xl opacity-50 animate-pulse animation-delay-2000"></div>
                                    <div className="absolute top-8 left-12 w-16 h-16 bg-secondary/30 rounded-full filter blur-xl opacity-70"></div>
                                </div>
                            </div>
                        </motion.div>
                        ))}
                    </div>
                </section>
                
                <section className="py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
                        <p className="text-md md:text-lg text-muted-foreground mt-2">Start your journey in three simple steps.</p>
                    </div>
                    <div className="relative">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border/40 -translate-y-1/2"></div>
                        <svg className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2" width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                            <path d="M 0,0.5 L 100,0.5" stroke="url(#gradient)" strokeWidth="1" className="animate-stroke-draw" />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                            {howItWorks.map((step, index) => (
                                <HowItWorksStep key={index} index={index} {...step} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Loved by People Like You</h2>
                        <p className="text-md md:text-lg text-muted-foreground mt-2">See what our first users are saying about their growth.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard key={index} index={index} {...testimonial} />
                        ))}
                    </div>
                </section>

                 <footer className="container mx-auto px-4 py-8 mt-16 border-t border-border">
                    <div className="text-center text-muted-foreground flex items-center justify-center gap-1.5 flex-wrap">
                        <p>Meet the developer <a href="https://github.com/thedevyash" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-primary transition-colors">@thedevyash</a></p>
                        <span className="hidden sm:inline">&bull;</span>
                        <p className="flex items-center gap-1.5">
                            Made with <Heart className="w-4 h-4 text-primary fill-current" />
                        </p>
                    </div>
                </footer>
            </div>
            
            <AnimatePresence>
                {showAuth && (
                    <motion.div
                        key="auth-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowAuth(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-md"
                            onClick={(e) => e.stopPropagation()} 
                        >
                            <div className="p-8 rounded-lg glass-card">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={isLogin ? "login" : "signup"}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {isLogin ? (
                                            <LoginPage onSwitchToSignUp={() => setIsLogin(false)} />
                                        ) : (
                                            <SignUpPage onSwitchToLogin={() => setIsLogin(true)} />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <div className="text-center mt-4">
                                <Button variant="link" onClick={() => setShowAuth(false)} className="text-slate-300">Back to Home</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" />
    );
  }

  // This logic is now handled inside LandingPageContent for the button,
  // but we keep the main page redirect for a logged-in user trying to access the landing page directly.
  if (user && router.asPath === '/landing') {
    router.push('/dashboard');
    return (
      <div className="min-h-screen w-full flex items-center justify-center" />
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
        <Suspense fallback={<div className="min-h-screen w-full" />}>
            <LandingPageContent />
        </Suspense>
    </main>
  );
}
