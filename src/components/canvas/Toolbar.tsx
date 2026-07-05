"use client";

import { useBoard, ViewMode } from "@/lib/store";
import { useCanvas } from "./CanvasContext";

function Btn({ children, onClick, title, active }: { children: React.ReactNode; onClick: () => void; title: string; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`grid h-9 min-w-9 shrink-0 place-items-center rounded-lg px-2.5 text-[13px] font-medium transition-colors ${
        active ? "bg-accent text-white" : "hover:bg-bg"
      }`}
    >
      {children}
    </button>
  );
}

export default function Toolbar({
  zoomPct,
  onSearch,
  onHelp,
}: {
  zoomPct: number;
  onSearch: () => void;
  onHelp: () => void;
}) {
  const view = useBoard((s) => s.view);
  const setView = useBoard((s) => s.setView);
  const reset = useBoard((s) => s.reset);
  const shake = useBoard((s) => s.shake);
  const { zoomBy, resetView } = useCanvas();

  const modes: { k: ViewMode; label: string }[] = [
    { k: "freeform", label: "Freeform" },
    { k: "grid", label: "Grid" },
  ];

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      className="no-scrollbar pointer-events-auto fixed bottom-4 left-1/2 z-[70] flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-1.5 overflow-x-auto rounded-2xl border border-card-line bg-card/85 p-1.5 backdrop-blur-md card-shadow"
    >
      {/* view modes */}
      <div className="flex shrink-0 items-center rounded-xl bg-bg p-0.5">
        {modes.map((m) => (
          <Btn key={m.k} title={`${m.label} layout`} active={view === m.k || (m.k === "freeform" && view === "focus")} onClick={() => setView(m.k)}>
            {m.label}
          </Btn>
        ))}
      </div>

      <span className="mx-0.5 h-6 w-px shrink-0 bg-line" />

      {/* zoom */}
      <Btn title="Zoom out" onClick={() => zoomBy(1 / 1.2)}>−</Btn>
      <button onClick={resetView} title="Fit to screen" className="h-9 w-14 shrink-0 rounded-lg text-[12px] tabular-nums text-ink-soft hover:bg-bg">
        {Math.round(zoomPct)}%
      </button>
      <Btn title="Zoom in" onClick={() => zoomBy(1.2)}>＋</Btn>

      <span className="mx-0.5 h-6 w-px shrink-0 bg-line" />

      <Btn title="Search (⌘K)" onClick={onSearch}>⌕</Btn>
      <Btn title="Shuffle the desk" onClick={shake}>⤮</Btn>
      <Btn title="Reset layout" onClick={reset}>↺</Btn>
      <Btn title="Shortcuts (?)" onClick={onHelp}>?</Btn>
    </div>
  );
}
