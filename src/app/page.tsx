"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useBoard } from "@/lib/store";
import Portfolio from "@/components/Portfolio";
import Workspace from "@/components/Workspace";
import ModeToggle from "@/components/ModeToggle";

export default function Page() {
  const surface = useBoard((s) => s.surface);
  const theme = useBoard((s) => s.theme);

  // sync theme -> <html data-theme>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <main className="relative min-h-dvh">
      <ModeToggle />
      <AnimatePresence mode="wait">
        {surface === "portfolio" ? (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <Portfolio />
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            className="fixed inset-0"
            initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <Workspace />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
