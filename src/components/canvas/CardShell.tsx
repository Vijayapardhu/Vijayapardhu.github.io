"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { CardModel, useBoard } from "@/lib/store";
import { useCanvas, sizeOf } from "./CanvasContext";
import CardBody from "./CardBody";

const SNAP = 6; // screen px threshold

/** Snap the dragged card's edges/centres to nearby cards; returns adjusted pos + guide lines. */
function computeSnap(
  px: number,
  py: number,
  w: number,
  h: number,
  others: CardModel[],
  thresh: number,
) {
  let x = px,
    y = py,
    gx: number | null = null,
    gy: number | null = null;
  let bestX = thresh,
    bestY = thresh;

  const myX = [px, px + w / 2, px + w]; // left, center, right
  const myY = [py, py + h / 2, py + h]; // top, middle, bottom
  const offX = [0, w / 2, w];
  const offY = [0, h / 2, h];

  for (const o of others) {
    const s = sizeOf(o.type);
    const tX = [o.x, o.x + s.w / 2, o.x + s.w];
    const tY = [o.y, o.y + s.h / 2, o.y + s.h];
    for (let a = 0; a < 3; a++) {
      for (const t of tX) {
        const d = Math.abs(myX[a] - t);
        if (d < bestX) { bestX = d; x = t - offX[a]; gx = t; }
      }
      for (const t of tY) {
        const d = Math.abs(myY[a] - t);
        if (d < bestY) { bestY = d; y = t - offY[a]; gy = t; }
      }
    }
  }
  return { x, y, gx, gy };
}

export default function CardShell({ card, index }: { card: CardModel; index: number }) {
  const moveCard = useBoard((s) => s.moveCard);
  const bringToFront = useBoard((s) => s.bringToFront);
  const setGuides = useBoard((s) => s.setGuides);
  const focused = useBoard((s) => s.focused);
  const view = useBoard((s) => s.view);
  const { zoomRef, focusCard } = useCanvas();

  const [dragging, setDragging] = useState(false);
  const origin = useRef({ px: 0, py: 0, cx: 0, cy: 0 });
  const moved = useRef(false);
  const raf = useRef<number | null>(null);
  const pending = useRef({ x: card.x, y: card.y });

  const dimmed = view === "focus" && focused && focused !== card.id;

  function onPointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    const el = e.target as HTMLElement;
    if (el.closest("a,button,input,[data-no-drag]")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    bringToFront(card.id);
    origin.current = { px: e.clientX, py: e.clientY, cx: card.x, cy: card.y };
    pending.current = { x: card.x, y: card.y };
    moved.current = false;
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const z = zoomRef.current || 1;
    const dx = (e.clientX - origin.current.px) / z;
    const dy = (e.clientY - origin.current.py) / z;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved.current = true;
    let nx = origin.current.cx + dx;
    let ny = origin.current.cy + dy;

    // magnetic alignment (freeform only)
    if (view !== "grid") {
      const s = sizeOf(card.type);
      const others = useBoard.getState().cards.filter((c) => c.id !== card.id);
      const snap = computeSnap(nx, ny, s.w, s.h, others, SNAP / z);
      nx = snap.x;
      ny = snap.y;
      pending.current = { x: nx, y: ny };
      if (raf.current == null) {
        raf.current = requestAnimationFrame(() => {
          raf.current = null;
          moveCard(card.id, pending.current.x, pending.current.y);
          setGuides(snap.gx, snap.gy);
        });
      }
      return;
    }

    pending.current = { x: nx, y: ny };
    if (raf.current == null) {
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        moveCard(card.id, pending.current.x, pending.current.y);
      });
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    if (raf.current != null) cancelAnimationFrame(raf.current);
    raf.current = null;
    moveCard(card.id, pending.current.x, pending.current.y);
    setGuides(null, null);
    setDragging(false);
  }

  function onDoubleClick(e: React.MouseEvent) {
    const el = e.target as HTMLElement;
    if (el.closest("a,button,input,[data-no-drag]")) return;
    e.stopPropagation();
    focusCard(card.id);
  }

  return (
    <motion.div
      className={`absolute left-0 top-0 touch-none ${dragging ? "grabbing" : "cursor-grab"}`}
      style={{ zIndex: dragging ? 9999 : card.z }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
      animate={{
        x: card.x,
        y: card.y,
        rotate: dragging ? 0 : card.rot ?? 0,
        scale: dragging ? 1.04 : 1,
        opacity: dimmed ? 0.25 : 1,
        filter: dimmed ? "blur(1px)" : "blur(0px)",
      }}
      transition={
        dragging
          ? { duration: 0 }
          : { type: "spring", stiffness: 260, damping: 26, opacity: { duration: 0.3 } }
      }
    >
      {/* one-time entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 + index * 0.035 }}
        className={dragging ? "card-lift rounded-2xl" : ""}
      >
        <CardBody card={card} />
      </motion.div>
    </motion.div>
  );
}
