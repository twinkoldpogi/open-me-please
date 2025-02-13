import { motion } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { FloatingElements } from "./floatinghearts";

export const Celebration = () => {
  useEffect(() => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="h-screen flex flex-col items-center justify-center text-center px-4"
    >
      <FloatingElements />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        className="space-y-4"
      >
        <h1 className="text-4xl md:text-6xl font-serif text-red-400">
          Happy Valentine's Day
        </h1>
        <p className="text-2xl md:text-4xl font-serif text-red-500">My Lover</p>
      </motion.div>
    </motion.div>
  );
};
