"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useBoard } from "@/lib/store";
import { CanvasCtx, CanvasApi, sizeOf } from "./canvas/CanvasContext";
import CardShell from "./canvas/CardShell";
import Connections from "./canvas/Connections";
import Guides from "./canvas/Guides";
import Toolbar from "./canvas/Toolbar";
import Minimap from "./canvas/Minimap";
import CommandPalette from "./canvas/CommandPalette";

// logical tour order for focus navigation (skip stickers & coffee)
const TOUR = [
  "name", "about", "resume", "echoroom", "medi-advisor", "hey-sara",
  "skills", "terminal", "folder", "timeline", "certs", "github", "now", "contact",
];

type Cam = { x: number; y: number; scale: number };
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export default function Workspace() {
  const cards = useBoard((s) => s.cards);
  const focus = useBoard((s) => s.focus);
  const setView = useBoard((s) => s.setView);
  const reset = useBoard((s) => s.reset);
  const shake = useBoard((s) => s.shake);
  const toggleTheme = useBoard((s) => s.toggleTheme);
  const focused = useBoard((s) => s.focused);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [cam, setCam] = useState<Cam>({ x: 0, y: 0, scale: 0.7 });
  const camRef = useRef(cam);
  camRef.current = cam;
  const zoomRef = useRef(cam.scale);
  zoomRef.current = cam.scale;

  const [vp, setVp] = useState({ w: 1200, h: 800 });
  const [mounted, setMounted] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const tween = useRef<number | null>(null);

  /* ---- viewport size ---- */
  useEffect(() => {
    setMounted(true);
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      if (el.clientWidth > 1 && el.clientHeight > 1) {
        setVp({ w: el.clientWidth, h: el.clientHeight });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  /* ---- camera helpers ---- */
  const animateTo = useCallback((target: Cam) => {
    if (tween.current) cancelAnimationFrame(tween.current);
    const start = { ...camRef.current };
    const t0 = performance.now();
    const dur = 480;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = ease(t);
      setCam({
        x: start.x + (target.x - start.x) * e,
        y: start.y + (target.y - start.y) * e,
        scale: start.scale + (target.scale - start.scale) * e,
      });
      if (t < 1) tween.current = requestAnimationFrame(step);
    };
    tween.current = requestAnimationFrame(step);
  }, []);

  const centerOn = useCallback((wx: number, wy: number, scale?: number) => {
    const s = scale ?? camRef.current.scale;
    animateTo({ x: vp.w / 2 - wx * s, y: vp.h / 2 - wy * s, scale: s });
  }, [animateTo, vp.w, vp.h]);

  const fitAll = useCallback((animate = true) => {
    if (cards.length === 0) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const c of cards) {
      const s = sizeOf(c.type);
      minX = Math.min(minX, c.x); minY = Math.min(minY, c.y);
      maxX = Math.max(maxX, c.x + s.w); maxY = Math.max(maxY, c.y + s.h);
    }
    const pad = 80;
    const wW = maxX - minX + pad * 2;
    const wH = maxY - minY + pad * 2;
    const scale = clamp(Math.min(vp.w / wW, vp.h / wH), 0.25, 1.1);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const target = { x: vp.w / 2 - cx * scale, y: vp.h / 2 - cy * scale, scale };
    if (animate) animateTo(target); else setCam(target);
  }, [cards, vp.w, vp.h, animateTo]);

  const focusCard = useCallback((id: string) => {
    const c = useBoard.getState().cards.find((x) => x.id === id);
    if (!c) return;
    const s = sizeOf(c.type);
    const scale = clamp(Math.min((vp.w * 0.72) / s.w, (vp.h * 0.72) / s.h), 0.5, 1.6);
    focus(id);
    centerOn(c.x + s.w / 2, c.y + s.h / 2, scale);
  }, [vp.w, vp.h, focus, centerOn]);

  const navigateFocus = useCallback(
    (dir: 1 | -1) => {
      const st = useBoard.getState();
      const list = TOUR.filter((id) => st.cards.some((c) => c.id === id));
      const idx = st.focused ? list.indexOf(st.focused) : -1;
      const next = list[(idx + dir + list.length) % list.length] ?? list[0];
      focusCard(next);
    },
    [focusCard],
  );

  const zoomBy = useCallback((factor: number) => {
    const c = camRef.current;
    const newScale = clamp(c.scale * factor, 0.25, 4);
    const sx = vp.w / 2, sy = vp.h / 2;
    const wx = (sx - c.x) / c.scale;
    const wy = (sy - c.y) / c.scale;
    animateTo({ x: sx - wx * newScale, y: sy - wy * newScale, scale: newScale });
  }, [vp.w, vp.h, animateTo]);

  const api: CanvasApi = { zoomRef, centerOn, focusCard, zoomBy, resetView: () => fitAll(true) };

  /* ---- initial fit once measured ---- */
  const didFit = useRef(false);
  useEffect(() => {
    if (mounted && vp.w > 1 && vp.h > 1 && !didFit.current) {
      didFit.current = true;
      if (vp.w < 640) {
        // phones: start centred on the intro card at a readable zoom
        const c = useBoard.getState().cards.find((x) => x.id === "name");
        if (c) {
          const s = sizeOf(c.type);
          const scale = 0.6;
          setCam({ x: vp.w / 2 - (c.x + s.w / 2) * scale, y: 130 - c.y * scale, scale });
        } else fitAll(false);
      } else {
        fitAll(false);
      }
    }
  }, [mounted, vp.w, vp.h, fitAll]);

  /* ---- wheel: zoom to cursor / trackpad pan ---- */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const c = camRef.current;
      if (isZoomIntent(e)) {
        // zoom
        const rect = el.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const factor = Math.exp(-e.deltaY * 0.0015);
        const newScale = clamp(c.scale * factor, 0.25, 4);
        const wx = (sx - c.x) / c.scale;
        const wy = (sy - c.y) / c.scale;
        setCam({ x: sx - wx * newScale, y: sy - wy * newScale, scale: newScale });
      } else {
        // pan (shift+wheel = horizontal)
        const dx = e.shiftKey ? e.deltaY : e.deltaX;
        const dy = e.shiftKey ? 0 : e.deltaY;
        setCam({ x: c.x - dx, y: c.y - dy, scale: c.scale });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  /* ---- background pan + pinch-zoom (drag empty space / two-finger) ---- */
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pan = useRef({ active: false, px: 0, py: 0, cx: 0, cy: 0, moved: false });
  const pinch = useRef({ active: false, dist0: 1, mx0: 0, my0: 0, cam0: { x: 0, y: 0, scale: 1 } });

  function startPinch() {
    const el = viewportRef.current;
    if (!el) return;
    const pts = [...pointers.current.values()];
    const rect = el.getBoundingClientRect();
    pinch.current = {
      active: true,
      dist0: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1,
      mx0: (pts[0].x + pts[1].x) / 2 - rect.left,
      my0: (pts[0].y + pts[1].y) / 2 - rect.top,
      cam0: { ...camRef.current },
    };
  }

  function bgPointerDown(e: React.PointerEvent) {
    if (e.button === 2) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      pan.current = { active: true, px: e.clientX, py: e.clientY, cx: cam.x, cy: cam.y, moved: false };
    } else if (pointers.current.size === 2) {
      pan.current.active = false;
      startPinch();
    }
  }

  function bgPointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinch.current.active && pointers.current.size >= 2) {
      const el = viewportRef.current;
      if (!el) return;
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      const rect = el.getBoundingClientRect();
      const mx = (pts[0].x + pts[1].x) / 2 - rect.left;
      const my = (pts[0].y + pts[1].y) / 2 - rect.top;
      const c0 = pinch.current.cam0;
      const scale = clamp((c0.scale * dist) / pinch.current.dist0, 0.25, 4);
      const wx = (pinch.current.mx0 - c0.x) / c0.scale;
      const wy = (pinch.current.my0 - c0.y) / c0.scale;
      setCam({ x: mx - wx * scale, y: my - wy * scale, scale });
      return;
    }

    if (pan.current.active) {
      const dx = e.clientX - pan.current.px;
      const dy = e.clientY - pan.current.py;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) pan.current.moved = true;
      setCam({ x: pan.current.cx + dx, y: pan.current.cy + dy, scale: camRef.current.scale });
    }
  }

  function bgPointerUp(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current.active = false;
    if (pointers.current.size === 0) {
      const wasClick = !pan.current.moved;
      pan.current.active = false;
      if (wasClick && focused) focus(null);
    } else if (pointers.current.size === 1) {
      const p = [...pointers.current.values()][0];
      pan.current = { active: true, px: p.x, py: p.y, cx: camRef.current.x, cy: camRef.current.y, moved: true };
    }
  }

  /* ---- keyboard shortcuts ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setPaletteOpen((v) => !v); return;
      }
      if (typing) return;
      if (e.key === "Escape") { setPaletteOpen(false); setHelpOpen(false); if (focused) focus(null); }
      else if (e.key === "?") setHelpOpen((v) => !v);
      else if (e.key === "1") setView("freeform");
      else if (e.key === "2") setView("grid");
      else if (e.key === "0") fitAll(true);
      else if (e.key.toLowerCase() === "s") shake();
      else if (e.key.toLowerCase() === "r") reset();
      else if (e.key === "+" || e.key === "=") zoomBy(1.2);
      else if (e.key === "-") zoomBy(1 / 1.2);
      else if (e.key.startsWith("Arrow")) {
        if (focused && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
          e.preventDefault();
          navigateFocus(e.key === "ArrowRight" ? 1 : -1);
        } else {
          e.preventDefault();
          const step = 90;
          const d: Record<string, [number, number]> = {
            ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step],
          };
          const v = d[e.key];
          if (v) setCam((c) => ({ x: c.x + v[0], y: c.y + v[1], scale: c.scale }));
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, focus, setView, fitAll, shake, reset, zoomBy, navigateFocus]);

  const focusedCard = cards.find((c) => c.id === focused);
  const focusLabel = focusedCard ? String(focusedCard.ref ?? focusedCard.type) : "";

  return (
    <CanvasCtx.Provider value={api}>
      <div
        ref={viewportRef}
        className="desk-surface absolute inset-0 overflow-hidden overscroll-none select-none"
        onPointerDown={bgPointerDown}
        onPointerMove={bgPointerMove}
        onPointerUp={bgPointerUp}
        onDoubleClick={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.bg) toggleTheme();
        }}
        style={{ cursor: pan.current.active ? "grabbing" : "grab" }}
      >
        {/* world */}
        <div
          data-bg="1"
          className="absolute left-0 top-0 h-px w-px"
          style={{
            transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`,
            transformOrigin: "0 0",
          }}
        >
          <Connections />
          <Guides />
          {mounted &&
            cards.map((c, i) => <CardShell key={c.id} card={c} index={i} />)}
        </div>

        {/* HUD */}
        <Hint />
        <FocusNav
          focused={focused}
          label={focusLabel}
          onPrev={() => navigateFocus(-1)}
          onNext={() => navigateFocus(1)}
          onExit={() => focus(null)}
        />
        <Toolbar zoomPct={cam.scale * 100} onSearch={() => setPaletteOpen(true)} onHelp={() => setHelpOpen(true)} />
        <div className="fixed bottom-20 right-4 z-[70] hidden sm:bottom-4 sm:block">
          <Minimap cam={cam} viewport={vp} onJump={(wx, wy) => centerOn(wx, wy)} />
        </div>
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />

        {/* soft vignette for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[55]"
          style={{ boxShadow: "inset 0 0 180px 40px rgba(0,0,0,0.10)" }}
        />
      </div>
    </CanvasCtx.Provider>
  );
}

// treat a plain vertical wheel (no ctrl) as pan by default; ctrl = zoom.
// Kept simple: ctrl/⌘ + wheel zooms, everything else pans.
function isZoomIntent(e: WheelEvent) {
  return e.ctrlKey || e.metaKey;
}

function FocusNav({
  focused,
  label,
  onPrev,
  onNext,
  onExit,
}: {
  focused: string | null;
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
}) {
  return (
    <AnimatePresence>
      {focused && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onPointerDown={(e) => e.stopPropagation()}
          className="fixed left-1/2 top-4 z-[75] flex -translate-x-1/2 items-center gap-1 rounded-full border border-card-line bg-card/90 p-1 pl-1.5 backdrop-blur-md card-shadow"
        >
          <button onClick={onPrev} title="Previous (←)" className="grid h-8 w-8 place-items-center rounded-full hover:bg-bg">‹</button>
          <span className="min-w-24 px-2 text-center font-mono text-[12px] capitalize">{label.replace(/-/g, " ")}</span>
          <button onClick={onNext} title="Next (→)" className="grid h-8 w-8 place-items-center rounded-full hover:bg-bg">›</button>
          <button onClick={onExit} title="Exit focus (Esc)" className="ml-1 rounded-full bg-ink px-3 py-1.5 text-[11px] font-medium text-bg">
            Esc
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Hint() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="pointer-events-none fixed left-4 top-4 z-[60] hidden max-w-[calc(100vw-2rem)] rounded-xl border border-card-line bg-card/80 px-3.5 py-2 font-mono text-[11px] text-ink-soft backdrop-blur-md card-shadow sm:block"
    >
      <span className="hidden lg:inline">drag to arrange · cards snap &amp; align · scroll / arrows to pan · ⌘K search · dbl-click desk → theme</span>
      <span className="lg:hidden">drag · pinch to zoom · ⌘K search</span>
    </motion.div>
  );
}

function HelpOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const rows: [string, string][] = [
    ["Drag", "Move any card"],
    ["Scroll / drag bg", "Pan the canvas"],
    ["⌘/Ctrl + Scroll", "Zoom to cursor"],
    ["Double-click card", "Focus it"],
    ["← / →  (in focus)", "Previous / next card"],
    ["Arrow keys", "Pan the canvas"],
    ["Double-click desk", "Toggle dark mode"],
    ["⌘/Ctrl + K", "Search & jump"],
    ["1 / 2", "Freeform / Grid layout"],
    ["0", "Fit to screen"],
    ["S", "Shuffle the desk"],
    ["R", "Reset layout"],
    ["Esc", "Close / exit focus"],
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] grid place-items-center bg-black/30 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onPointerDown={onClose}
        >
          <motion.div
            className="w-full max-w-sm rounded-2xl border border-card-line bg-card p-6 card-lift"
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl">Shortcuts</h3>
              <button onClick={onClose} className="text-ink-soft hover:text-ink">✕</button>
            </div>
            <div className="space-y-1.5">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-[13px]">
                  <span className="text-ink-soft">{v}</span>
                  <kbd className="rounded-md border border-line bg-bg px-2 py-0.5 font-mono text-[11px]">{k}</kbd>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
