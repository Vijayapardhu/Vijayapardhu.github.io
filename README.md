# Vijaya Pardhu — Portfolio & Creative Workspace

A dual-surface personal site for **Magapu Vijaya Pardhu**:

- **Portfolio** — a minimal, editorial, typography-first résumé. Perfect for recruiters skimming in 60 seconds.
- **Workspace** — an infinite, draggable creative desk. Every résumé item becomes a physical card you can drag, throw, stack, zoom and organize.

Toggle between them anytime from the switch in the top-right.

## The Workspace

An in-browser designer's desk built on a custom pan/zoom canvas engine:

| Interaction | How |
| --- | --- |
| Move a card | Drag it |
| Pan the canvas | Scroll, or drag empty desk |
| Zoom to cursor | ⌘/Ctrl + Scroll (or the toolbar) |
| Focus a card | Double-click it |
| Toggle dark mode | Double-click empty desk |
| Search & jump | ⌘/Ctrl + K |
| Layout modes | `1` Freeform · `2` Grid (magnetic snap) |
| Fit to screen | `0` |
| Shuffle the desk | `S` |
| Reset layout | `R` |
| Shortcuts | `?` |

**Card types:** intro, sticky notes, résumé document (flip + download), browser-window projects, a phone mockup (Hey Sara), a shipping terminal, projects folder, skills toolkit, education timeline, certifications, GitHub activity, contact, floating tech stickers, and a coffee-cup easter egg (click for a random quote).

Cards are connected by animated lines that follow them as you drag. A live minimap (bottom-right) shows the whole board and lets you click to jump. The layout is **persisted to `localStorage`**, so your arrangement survives reloads — hit **Reset** for the curated default.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Motion** (Framer Motion) for card physics & transitions
- **Zustand** (+ persist) for board state
- Custom canvas engine (pan / zoom / drag under scale) — no heavyweight canvas SDK

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

All résumé content lives in `src/data/resume.ts` — edit it there and every card + section updates. The résumé PDF is served from `public/Vijayapardhu_resume.pdf`.
