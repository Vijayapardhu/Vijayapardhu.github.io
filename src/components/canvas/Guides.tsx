"use client";

import { useBoard } from "@/lib/store";

/** Thin accent alignment lines shown while dragging a card near another. */
export default function Guides() {
  const gx = useBoard((s) => s.guideX);
  const gy = useBoard((s) => s.guideY);
  if (gx == null && gy == null) return null;
  return (
    <div className="pointer-events-none absolute left-0 top-0" style={{ zIndex: 9998 }}>
      {gx != null && (
        <div
          className="absolute bg-accent"
          style={{ left: gx, top: -4000, width: 1, height: 8000, opacity: 0.7 }}
        />
      )}
      {gy != null && (
        <div
          className="absolute bg-accent"
          style={{ top: gy, left: -4000, height: 1, width: 8000, opacity: 0.7 }}
        />
      )}
    </div>
  );
}
