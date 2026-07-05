"use client";

import { useBoard } from "@/lib/store";
import { sizeOf } from "./CanvasContext";

const MW = 180;
const MH = 120;

export default function Minimap({
  cam,
  viewport,
  onJump,
}: {
  cam: { x: number; y: number; scale: number };
  viewport: { w: number; h: number };
  onJump: (wx: number, wy: number) => void;
}) {
  const cards = useBoard((s) => s.cards);
  if (cards.length === 0) return null;

  // world bounds
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const c of cards) {
    const s = sizeOf(c.type);
    minX = Math.min(minX, c.x);
    minY = Math.min(minY, c.y);
    maxX = Math.max(maxX, c.x + s.w);
    maxY = Math.max(maxY, c.y + s.h);
  }
  const pad = 120;
  minX -= pad; minY -= pad; maxX += pad; maxY += pad;
  const wW = maxX - minX;
  const wH = maxY - minY;
  const k = Math.min(MW / wW, MH / wH);
  const ox = (MW - wW * k) / 2;
  const oy = (MH - wH * k) / 2;

  const toMini = (wx: number, wy: number) => ({
    x: ox + (wx - minX) * k,
    y: oy + (wy - minY) * k,
  });

  // viewport rect in world coords: top-left = (-cam.x/scale, -cam.y/scale)
  const vx = -cam.x / cam.scale;
  const vy = -cam.y / cam.scale;
  const vw = viewport.w / cam.scale;
  const vh = viewport.h / cam.scale;
  const vp = toMini(vx, vy);

  function handleClick(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const wx = minX + (mx - ox) / k;
    const wy = minY + (my - oy) / k;
    onJump(wx, wy);
  }

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      onClick={handleClick}
      className="relative cursor-pointer overflow-hidden rounded-xl border border-card-line bg-card/90 backdrop-blur-md card-shadow"
      style={{ width: MW, height: MH }}
      title="Minimap — click to jump"
    >
      {cards.map((c) => {
        const s = sizeOf(c.type);
        const p = toMini(c.x, c.y);
        return (
          <span
            key={c.id}
            className="absolute rounded-[2px]"
            style={{
              left: p.x,
              top: p.y,
              width: Math.max(3, s.w * k),
              height: Math.max(3, s.h * k),
              background: c.type === "coffee" || c.type === "sticker" ? "var(--accent)" : "var(--ink-soft)",
              opacity: 0.5,
            }}
          />
        );
      })}
      <span
        className="absolute rounded-[3px] border-2 border-accent bg-accent/10"
        style={{ left: vp.x, top: vp.y, width: vw * k, height: vh * k }}
      />
    </div>
  );
}
