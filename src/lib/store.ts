"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CardType =
  | "name"
  | "about"
  | "resume"
  | "project"
  | "skills"
  | "terminal"
  | "folder"
  | "timeline"
  | "certs"
  | "contact"
  | "github"
  | "now"
  | "coffee"
  | "sticker";

export interface CardModel {
  id: string;
  type: CardType;
  x: number;
  y: number;
  z: number;
  rot?: number;      // resting rotation (deg)
  ref?: string;      // project id or sticker label
}

// Curated default arrangement of the desk.
export const DEFAULT_CARDS: CardModel[] = [
  { id: "name", type: "name", x: 120, y: 120, z: 10, rot: -1 },
  { id: "about", type: "about", x: 690, y: 90, z: 6, rot: 2 },
  { id: "resume", type: "resume", x: 150, y: 470, z: 8, rot: -3 },
  { id: "echoroom", type: "project", ref: "echoroom", x: 560, y: 470, z: 12, rot: 1 },
  { id: "medi-advisor", type: "project", ref: "medi-advisor", x: 1010, y: 430, z: 11, rot: -1 },
  { id: "hey-sara", type: "project", ref: "hey-sara", x: 1440, y: 150, z: 9, rot: 2 },
  { id: "skills", type: "skills", x: 470, y: 890, z: 7, rot: -1 },
  { id: "terminal", type: "terminal", x: 990, y: 830, z: 13, rot: 1 },
  { id: "folder", type: "folder", x: 1420, y: 620, z: 5, rot: -2 },
  { id: "timeline", type: "timeline", x: 120, y: 900, z: 6 },
  { id: "certs", type: "certs", x: 1450, y: 990, z: 6, rot: 2 },
  { id: "contact", type: "contact", x: 900, y: 1230, z: 8, rot: -1 },
  { id: "github", type: "github", x: 480, y: 1290, z: 5, rot: 2 },
  { id: "now", type: "now", x: 60, y: 1330, z: 7, rot: -2 },
  { id: "coffee", type: "coffee", x: 1880, y: 460, z: 4, rot: 4 },
  { id: "st-flutter", type: "sticker", ref: "Flutter", x: 1230, y: 1210, z: 3, rot: -6 },
  { id: "st-react", type: "sticker", ref: "React", x: 1400, y: 1300, z: 3, rot: 8 },
  { id: "st-firebase", type: "sticker", ref: "Firebase", x: 1560, y: 1210, z: 3, rot: -3 },
  { id: "st-laravel", type: "sticker", ref: "Laravel", x: 60, y: 760, z: 3, rot: 5 },
  { id: "st-postgres", type: "sticker", ref: "PostgreSQL", x: 1760, y: 900, z: 3, rot: -7 },
];

export type ViewMode = "freeform" | "grid" | "focus";
export type Surface = "portfolio" | "workspace";

interface BoardState {
  cards: CardModel[];
  topZ: number;
  theme: "light" | "dark";
  surface: Surface;
  view: ViewMode;
  focused: string | null;
  hydrated: boolean;
  guideX: number | null;
  guideY: number | null;

  setGuides: (x: number | null, y: number | null) => void;
  moveCard: (id: string, x: number, y: number) => void;
  bringToFront: (id: string) => number;
  setView: (v: ViewMode) => void;
  setSurface: (s: Surface) => void;
  focus: (id: string | null) => void;
  toggleTheme: () => void;
  setTheme: (t: "light" | "dark") => void;
  reset: () => void;
  shake: () => void;        // rearrange everything with jitter
  setHydrated: () => void;
}

const GRID = 40;
const snap = (v: number) => Math.round(v / GRID) * GRID;

export const useBoard = create<BoardState>()(
  persist(
    (set, get) => ({
      cards: DEFAULT_CARDS,
      topZ: 20,
      theme: "light",
      surface: "portfolio",
      view: "freeform",
      focused: null,
      hydrated: false,
      guideX: null,
      guideY: null,

      setGuides: (guideX, guideY) => set({ guideX, guideY }),

      moveCard: (id, x, y) =>
        set((s) => {
          const grid = s.view === "grid";
          return {
            cards: s.cards.map((c) =>
              c.id === id ? { ...c, x: grid ? snap(x) : x, y: grid ? snap(y) : y } : c,
            ),
          };
        }),

      bringToFront: (id) => {
        const z = get().topZ + 1;
        set((s) => ({
          topZ: z,
          cards: s.cards.map((c) => (c.id === id ? { ...c, z } : c)),
        }));
        return z;
      },

      setView: (view) =>
        set((s) => {
          if (view === "grid") {
            return {
              view,
              focused: null,
              cards: s.cards.map((c) => ({ ...c, x: snap(c.x), y: snap(c.y), rot: 0 })),
            };
          }
          if (view === "freeform") {
            // restore resting rotations from defaults
            const base = Object.fromEntries(DEFAULT_CARDS.map((d) => [d.id, d.rot ?? 0]));
            return {
              view,
              focused: null,
              cards: s.cards.map((c) => ({ ...c, rot: base[c.id] ?? 0 })),
            };
          }
          return { view, focused: null };
        }),

      setSurface: (surface) => set({ surface }),
      focus: (focused) => set({ focused, view: focused ? "focus" : "freeform" }),

      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setTheme: (theme) => set({ theme }),

      reset: () => set({ cards: DEFAULT_CARDS.map((c) => ({ ...c })), topZ: 20, view: "freeform", focused: null }),

      shake: () =>
        set((s) => ({
          cards: s.cards.map((c, i) => {
            // deterministic pseudo-jitter (Math.random is unavailable in some envs)
            const seed = (i * 2654435761) % 2147483647;
            const jx = ((seed % 1000) / 1000 - 0.5) * 220;
            const jy = (((seed >> 5) % 1000) / 1000 - 0.5) * 180;
            return { ...c, x: c.x + jx, y: c.y + jy, rot: (jx % 14) - 7 };
          }),
        })),

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "vp-workspace-v1",
      partialize: (s) => ({ cards: s.cards, theme: s.theme, topZ: s.topZ }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
