"use client";

import { useBoard } from "@/lib/store";
import { sizeOf } from "./CanvasContext";

const EDGES: [string, string][] = [
  ["name", "about"],
  ["name", "resume"],
  ["name", "skills"],
  ["folder", "echoroom"],
  ["folder", "medi-advisor"],
  ["folder", "hey-sara"],
  ["terminal", "echoroom"],
  ["terminal", "github"],
  ["timeline", "certs"],
  ["skills", "terminal"],
];

export default function Connections() {
  const cards = useBoard((s) => s.cards);
  const map = Object.fromEntries(cards.map((c) => [c.id, c]));

  const center = (id: string) => {
    const c = map[id];
    if (!c) return null;
    const s = sizeOf(c.type);
    return { x: c.x + s.w / 2, y: c.y + s.h / 2 };
  };

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 overflow-visible"
      width="1"
      height="1"
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.05" />
          <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {EDGES.map(([a, b], i) => {
        const p = center(a);
        const q = center(b);
        if (!p || !q) return null;
        const mx = (p.x + q.x) / 2;
        const d = `M ${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${q.y}, ${q.x} ${q.y}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="url(#edge)" strokeWidth={2} />
            <path
              d={d}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2}
              strokeDasharray="2 10"
              strokeLinecap="round"
              opacity={0.6}
            >
              <animate attributeName="stroke-dashoffset" from="0" to="-120" dur="4s" repeatCount="indefinite" />
            </path>
            <circle cx={p.x} cy={p.y} r={3} fill="var(--accent)" opacity={0.5} />
            <circle cx={q.x} cy={q.y} r={3} fill="var(--accent)" opacity={0.5} />
          </g>
        );
      })}
    </svg>
  );
}
