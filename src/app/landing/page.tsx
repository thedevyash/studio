
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, Sparkles, BrainCircuit, Users } from "lucide-react";
import LoginPage from "../login/page";
import SignUpPage from "../signup/page";
import { GlowingCard } from "@/components/glowing-card";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SplashScreen } from "@/components/splash-screen";

const features = [
  {
    icon: Leaf,
    title: "Track Your Habits",
    description: "Build lasting habits with our intuitive and beautiful tracking interface.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Motivation",
    description: "Receive personalized encouragement and tips to stay on track.",
  },
  {
    icon: BrainCircuit,
    title: "Adaptive Suggestions",
    description: "Our AI coach helps you adjust when you're struggling, not just when you succeed.",
  },
  {
    icon: Users,
    title: "Build Community",
    description: "Share your progress with friends and motivate each other on your journey.",
  },
];

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);
  
  if (loading || user) {
    return (
      <div className="landing-background min-h-screen w-full flex items-center justify-center">
        {/* Optional: Add a spinner here if needed */}
      </div>
    );
  }

  return (
    <main className="landing-background min-h-screen w-full overflow-hidden">
      <AnimatePresence>
        {showSplash && <SplashScreen onFinished={() => setShowSplash(false)} />}
      </AnimatePresence>
      
      {!showSplash && (
        <>
          <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(167,139,250,0.15)_0,rgba(167,139,250,0)_50%)]"></div>
          
          <div className="container mx-auto px-4 py-12 md:py-20 flex items-center justify-center min-h-screen">
              <AnimatePresence mode="wait">
                  {!showAuth ? (
                      <motion.div
                          key="intro"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.8 }}
                          className="max-w-4xl text-center"
                      >
                          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
                              Build Better Habits with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Habit Horizon</span>
                          </h1>
                          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mt-4">
                            Your intelligent partner in personal growth. Track, analyze, and conquer your goals with the power of AI.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-10 my-10 max-w-3xl mx-auto">
                              {features.map((feature, index) => (
                                  <motion.div
                                      key={feature.title}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                      className="flex items-start space-x-4 text-left"
                                  >
                                      <div className="bg-primary/10 p-3 rounded-full">
                                          <feature.icon className="w-6 h-6 text-primary" />
                                      </div>
                                      <div>
                                          <h3 className="font-semibold text-white">{feature.title}</h3>
                                          <p className="text-sm text-slate-400">{feature.description}</p>
                                      </div>
                                  </motion.div>
                              ))}
                          </div>
                          
                          <Button size="lg" onClick={() => setShowAuth(true)} className="shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow">
                              Get Started
                          </Button>
                      </motion.div>
                  ) : (
                      <motion.div
                          key="auth"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.5 }}
                          className="w-full max-w-md"
                      >
                          <GlowingCard containerClassName="min-h-[480px]">
                              <div className="p-8">
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
                          </GlowingCard>
                          <div className="text-center mt-4">
                              <Button variant="link" onClick={() => setShowAuth(false)}>Back to Features</Button>
                          </div>
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>
        </>
      )}
    </main>
  );
}
