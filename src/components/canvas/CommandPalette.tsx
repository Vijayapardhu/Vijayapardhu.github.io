"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useBoard } from "@/lib/store";
import { useCanvas } from "./CanvasContext";

const LABELS: Record<string, string> = {
  name: "Intro card",
  about: "About — sticky note",
  resume: "Résumé — PDF",
  skills: "Toolkit / skills",
  terminal: "Terminal — shipping log",
  folder: "Projects folder",
  timeline: "Path / education",
  certs: "Certifications",
  contact: "Contact",
  github: "GitHub activity",
  now: "Now building",
  coffee: "Coffee ☕",
};

export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const cards = useBoard((s) => s.cards);
  const { focusCard } = useCanvas();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const items = useMemo(() => {
    const list = cards.map((c) => ({
      id: c.id,
      label: c.type === "project" ? (c.ref ?? "") : c.type === "sticker" ? c.ref ?? "" : LABELS[c.type] ?? c.id,
      kind: c.type,
    }));
    const f = q.trim().toLowerCase();
    return f ? list.filter((i) => i.label.toLowerCase().includes(f) || i.id.includes(f)) : list;
  }, [cards, q]);

  useEffect(() => {
    if (open) { setQ(""); setActive(0); }
  }, [open]);
  useEffect(() => { setActive(0); }, [q]);

  function choose(id: string) {
    focusCard(id);
    onClose();
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && items[active]) { choose(items[active].id); }
    else if (e.key === "Escape") { onClose(); }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-start justify-center bg-black/30 p-4 pt-[18vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onPointerDown={onClose}
        >
          <motion.div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-card-line bg-card card-lift"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-card-line px-4 py-3">
              <span className="text-ink-soft">⌕</span>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Jump to a card or project…"
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink-soft"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-soft">esc</kbd>
            </div>
            <div className="max-h-72 overflow-y-auto p-2 no-scrollbar">
              {items.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-ink-soft">Nothing found.</p>
              )}
              {items.map((it, i) => (
                <button
                  key={it.id}
                  onClick={() => choose(it.id)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] ${
                    i === active ? "bg-accent text-white" : "hover:bg-bg"
                  }`}
                >
                  <span className={`font-mono text-[11px] ${i === active ? "text-white/70" : "text-ink-soft"}`}>
                    {it.kind}
                  </span>
                  <span className="capitalize">{it.label}</span>
                  <span className={`ml-auto ${i === active ? "opacity-100" : "opacity-0"}`}>↵</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
