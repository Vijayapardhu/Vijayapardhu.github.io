"use client";

import { motion } from "motion/react";
import { useBoard } from "@/lib/store";

export default function ModeToggle() {
  const surface = useBoard((s) => s.surface);
  const setSurface = useBoard((s) => s.setSurface);
  const theme = useBoard((s) => s.theme);
  const toggleTheme = useBoard((s) => s.toggleTheme);

  return (
    <div className="fixed right-4 top-4 z-[80] flex items-center gap-2">
      {/* surface switch */}
      <div className="relative flex items-center rounded-full border border-line bg-card/80 p-1 text-[13px] font-medium backdrop-blur-md card-shadow">
        {(["portfolio", "workspace"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSurface(s)}
            className="relative z-10 rounded-full px-3.5 py-1.5 capitalize transition-colors"
            style={{ color: surface === s ? "#fff" : "var(--ink-soft)" }}
          >
            {surface === s && (
              <motion.span
                layoutId="surface-pill"
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            {s}
          </button>
        ))}
      </div>

      {/* theme toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card/80 text-ink backdrop-blur-md card-shadow transition-transform hover:scale-105 active:scale-95"
      >
        {theme === "dark" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
