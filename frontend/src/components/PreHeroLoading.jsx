import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "./Particles";
import Aurora from "./Aurora";
import { WinsAbleMark } from "./WinsAbleMark";

// Cinematic pre-hero sequence: black -> logo -> particles -> aurora -> tagline -> zoom
export const PreHeroLoading = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [visible, setVisible] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setVisible(false);
      onCompleteRef.current && onCompleteRef.current();
      return;
    }
    const timers = [
      setTimeout(() => setStage(1), 320),
      setTimeout(() => setStage(2), 950),
      setTimeout(() => setStage(3), 1600),
      setTimeout(() => setStage(4), 2200),
      setTimeout(() => setStage(5), 3500),
      setTimeout(() => {
        setVisible(false);
        onCompleteRef.current && onCompleteRef.current();
      }, 4300),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="pre-hero-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 2 ? 1 : 0 }}
            transition={{ duration: 0.9 }}
          >
            <Particles count={90} color="#93C5FD" />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 3 ? 1 : 0 }}
            transition={{ duration: 1.1 }}
          >
            <Aurora intensity={0.75} />
          </motion.div>

          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-6"
            initial={{ scale: 1 }}
            animate={{ scale: stage >= 5 ? 1.12 : 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
              animate={{
                opacity: stage >= 1 ? 1 : 0,
                y: stage >= 1 ? 0 : 12,
                filter: stage >= 1 ? "blur(0px)" : "blur(10px)",
              }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <WinsAbleMark className="h-16 w-16 sm:h-20 sm:w-20" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: stage >= 4 ? 1 : 0,
                y: stage >= 4 ? 0 : 14,
              }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 text-[11px] uppercase tracking-[0.4em] text-white/55 font-body"
            >
              Protecting What You Built
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreHeroLoading;
