"use client";

import { createContext, useContext } from "react";

export interface CanvasApi {
  zoomRef: React.RefObject<number>;
  /** Smoothly center the camera on a world point (optionally set zoom). */
  centerOn: (x: number, y: number, scale?: number) => void;
  /** Center on a card by id, framing it nicely. */
  focusCard: (id: string) => void;
  /** Multiply zoom by a factor, keeping the viewport centre fixed. */
  zoomBy: (factor: number) => void;
  /** Fit the whole board into view. */
  resetView: () => void;
}

export const CanvasCtx = createContext<CanvasApi | null>(null);

export function useCanvas() {
  const ctx = useContext(CanvasCtx);
  if (!ctx) throw new Error("useCanvas must be used inside <Workspace>");
  return ctx;
}

// Approx rendered size of each card type (world units) — used for framing & minimap.
export const CARD_SIZE: Record<string, { w: number; h: number }> = {
  name: { w: 520, h: 300 },
  about: { w: 320, h: 220 },
  resume: { w: 300, h: 380 },
  project: { w: 380, h: 300 },
  skills: { w: 420, h: 300 },
  terminal: { w: 380, h: 240 },
  folder: { w: 300, h: 260 },
  timeline: { w: 320, h: 320 },
  certs: { w: 340, h: 220 },
  contact: { w: 360, h: 240 },
  github: { w: 340, h: 200 },
  now: { w: 300, h: 230 },
  coffee: { w: 150, h: 170 },
  sticker: { w: 130, h: 60 },
};

export const sizeOf = (type: string) => CARD_SIZE[type] ?? { w: 320, h: 240 };
