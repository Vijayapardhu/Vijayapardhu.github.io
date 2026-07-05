"use client";

import { useState } from "react";
import { CardModel } from "@/lib/store";
import {
  profile,
  projects,
  skills,
  timeline,
  certifications,
  nowBuilding,
  quotes,
} from "@/data/resume";

const noDrag = { "data-no-drag": true } as const;

function Dot({ c }: { c: string }) {
  return <span className="h-3 w-3 rounded-full" style={{ background: c }} />;
}

function WindowBar({ title, accent }: { title: string; accent?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-card-line px-3.5 py-2.5">
      <Dot c="#ff5f57" />
      <Dot c="#febc2e" />
      <Dot c="#28c840" />
      <span className="ml-2 truncate font-mono text-[11px] text-ink-soft">{title}</span>
      {accent && <span className="ml-auto h-2 w-2 rounded-full" style={{ background: accent }} />}
    </div>
  );
}

export default function CardBody({ card }: { card: CardModel }) {
  switch (card.type) {
    case "name":
      return <NameCard />;
    case "about":
      return <AboutCard />;
    case "resume":
      return <ResumeCard />;
    case "project":
      return <ProjectCard id={card.ref!} />;
    case "skills":
      return <SkillsCard />;
    case "terminal":
      return <TerminalCard />;
    case "folder":
      return <FolderCard />;
    case "timeline":
      return <TimelineCard />;
    case "certs":
      return <CertsCard />;
    case "contact":
      return <ContactCard />;
    case "github":
      return <GithubCard />;
    case "now":
      return <NowCard />;
    case "coffee":
      return <CoffeeCard />;
    case "sticker":
      return <Sticker label={card.ref!} />;
    default:
      return null;
  }
}

/* ---------------- individual cards ---------------- */

function Shell({ children, className = "", pad = true }: { children: React.ReactNode; className?: string; pad?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-card-line bg-card ${pad ? "" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function NameCard() {
  return (
    <Shell className="w-[520px] max-w-[86vw]">
      <div className="p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
          {profile.roles.join(" · ")}
        </p>
        <h1 className="mt-3 font-display text-[46px] leading-[0.95] tracking-tight">
          Vijaya <span className="italic text-accent">Pardhu</span>
        </h1>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-soft">
          {profile.tagline}
        </p>
        <p className="mt-5 font-mono text-[11px] text-ink-soft">
          ✎ Drag anything · double-click a card to focus · ⌘K to search
        </p>
      </div>
    </Shell>
  );
}

function AboutCard() {
  return (
    <div className="w-[300px] rotate-[0.2deg] rounded-[14px] bg-[#fff6c9] p-5 text-[#3a2f10] shadow-[0_10px_30px_rgba(120,90,10,.25)] dark:bg-[#e9d98a]">
      <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">sticky note</p>
      <p className="mt-2 font-display text-lg leading-snug">
        Diploma → B.Tech CS (lateral entry). But honestly, I learned the most by
        shipping real apps for real clients.
      </p>
      <p className="mt-3 text-[13px] opacity-70">📍 {profile.location}</p>
    </div>
  );
}

function ResumeCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="w-[300px]">
      <div className="rounded-[10px] border border-card-line bg-card p-4 card-shadow">
        <div className="aspect-[3/4] w-full rounded-md border border-card-line bg-gradient-to-b from-bg to-bg-2 p-4">
          {!flipped ? (
            <div className="flex h-full flex-col">
              <div className="border-b border-line pb-2 text-center">
                <p className="font-display text-sm font-semibold">MAGAPU VIJAYA PARDHU</p>
                <p className="text-[8px] text-ink-soft">Software Engineer · Full Stack · Flutter</p>
              </div>
              <div className="mt-2 space-y-1.5">
                {["Professional Summary", "Technical Skills", "Experience — Knight21", "Projects — 3 shipped", "Education", "Certifications"].map((l) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    <span className="text-[9px] text-ink-soft">{l}</span>
                    <span className="ml-auto h-1 flex-1 max-w-[40%] rounded bg-line" />
                  </div>
                ))}
              </div>
              <p className="mt-auto text-center text-[8px] italic text-ink-soft">tap “flip” to see the real thing →</p>
            </div>
          ) : (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="font-display text-2xl">Résumé</p>
                <p className="mt-1 text-[10px] text-ink-soft">PDF · 1 page · updated 2026</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 flex gap-2" {...noDrag}>
          <a
            href="/Vijayapardhu_resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-lg bg-ink py-2 text-center text-[12px] font-medium text-bg"
          >
            Open PDF ↗
          </a>
          <a
            href="/Vijayapardhu_resume.pdf"
            download
            className="rounded-lg border border-line px-3 py-2 text-[12px]"
          >
            ↓
          </a>
          <button
            onClick={() => setFlipped((f) => !f)}
            className="rounded-lg border border-line px-3 py-2 text-[12px]"
          >
            flip
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ id }: { id: string }) {
  const p = projects.find((x) => x.id === id)!;
  if (p.kind === "phone") return <PhoneProject id={id} />;
  return (
    <Shell className="w-[380px]">
      <WindowBar title={p.live?.replace("https://", "") ?? p.name} accent={p.accent} />
      <div className="p-5">
        <h3 className="font-display text-2xl">{p.name}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{p.blurb}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span
              key={s}
              className="rounded-md px-2 py-0.5 font-mono text-[11px]"
              style={{ background: `${p.accent}1a`, color: p.accent }}
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-5 flex gap-2" {...noDrag}>
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-white" style={{ background: p.accent }}>
              Open →
            </a>
          )}
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" className="rounded-lg border border-line px-3 py-1.5 text-[12px]">
              Code
            </a>
          )}
        </div>
      </div>
    </Shell>
  );
}

function PhoneProject({ id }: { id: string }) {
  const p = projects.find((x) => x.id === id)!;
  return (
    <div className="w-[230px]">
      <div className="rounded-[34px] border-[6px] border-[#111] bg-[#111] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,.4)]">
        <div className="relative overflow-hidden rounded-[26px]" style={{ background: `linear-gradient(160deg, ${p.accent}, ${p.accent}88)` }}>
          <div className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-full bg-black/40" />
          <div className="flex h-[380px] flex-col justify-between p-5 text-white">
            <div className="pt-8">
              <div className="text-[11px] opacity-80">◈ offline assistant</div>
              <h3 className="mt-2 font-display text-3xl leading-tight">{p.name}</h3>
            </div>
            <div className="space-y-2">
              <div className="rounded-2xl bg-white/20 p-3 text-[12px] backdrop-blur">
                “Hey Sara, what’s the weather?” 🎙️
              </div>
              <p className="text-[11px] opacity-80">{p.stack.join(" · ")}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-2 px-1" {...noDrag}>
        {p.live && (
          <a href={p.live} target="_blank" rel="noreferrer" className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-white" style={{ background: p.accent }}>
            Demo →
          </a>
        )}
        {p.github && (
          <a href={p.github} target="_blank" rel="noreferrer" className="rounded-lg border border-line px-3 py-1.5 text-[12px]">
            Code
          </a>
        )}
      </div>
    </div>
  );
}

function SkillsCard() {
  return (
    <Shell className="w-[420px]">
      <div className="p-5">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink-soft">
          ⚙ toolkit
        </p>
        <div className="space-y-3">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group}>
              <p className="mb-1.5 text-[11px] font-medium text-accent">{group}</p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((it) => (
                  <span key={it} className="rounded-full border border-card-line bg-bg px-2.5 py-1 text-[12px]">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function TerminalCard() {
  const lines = [
    { t: "$ what have you shipped?", c: "text-white/90" },
    { t: "✓ EchoRoom — live", c: "text-emerald-400" },
    { t: "✓ Medi Advisor — live", c: "text-emerald-400" },
    { t: "✓ Hey Sara — on Android", c: "text-emerald-400" },
    { t: "» + client apps at Knight21", c: "text-sky-400" },
    { t: "» always building the next one", c: "text-white/50" },
  ];
  return (
    <Shell className="w-[380px] bg-[#0d0d12] text-[#e6e6e6]" >
      <div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-2.5">
        <Dot c="#ff5f57" /><Dot c="#febc2e" /><Dot c="#28c840" />
        <span className="ml-2 font-mono text-[11px] text-white/40">bash — ~/knight21</span>
      </div>
      <div className="p-4 font-mono text-[12.5px] leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} className={l.c}>{l.t}</div>
        ))}
        <div className="mt-1 flex items-center gap-1">
          <span className="text-white/50">$</span>
          <span className="inline-block h-4 w-2 animate-pulse bg-emerald-400" />
        </div>
      </div>
    </Shell>
  );
}

function FolderCard() {
  return (
    <div className="w-[300px]">
      <div className="relative">
        <div className="ml-3 h-4 w-24 rounded-t-lg bg-accent/80" />
        <div className="rounded-2xl rounded-tl-none border border-card-line bg-card p-4 card-shadow">
          <p className="mb-2 font-mono text-[11px] text-ink-soft">Projects/</p>
          <div className="space-y-1.5">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-bg">
                <span className="grid h-6 w-6 place-items-center rounded-md text-[11px]" style={{ background: `${p.accent}22`, color: p.accent }}>
                  {p.name[0]}
                </span>
                <span className="text-[13px]">{p.name}</span>
                <span className="ml-auto font-mono text-[10px] text-ink-soft">{p.stack[0]}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 px-2 py-1.5 opacity-60">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-line text-[11px]">+</span>
              <span className="text-[13px] italic">DocBox · in progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineCard() {
  return (
    <Shell className="w-[320px]">
      <div className="p-5">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ink-soft">◷ path</p>
        <div className="space-y-4">
          {timeline.map((t, i) => (
            <div key={t.title} className="relative pl-5">
              <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-accent" />
              {i < timeline.length - 1 && <span className="absolute left-[3.5px] top-3.5 h-full w-px bg-line" />}
              <p className="font-mono text-[10px] text-accent">{t.year}</p>
              <p className="text-[14px] font-medium leading-tight">{t.title}</p>
              <p className="text-[12px] text-ink-soft">{t.org}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function CertsCard() {
  return (
    <Shell className="w-[340px]">
      <div className="p-5">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink-soft">✦ certifications</p>
        <div className="space-y-2">
          {certifications.map((c) => (
            <div key={c} className="flex items-start gap-2 rounded-lg border border-card-line bg-bg px-3 py-2">
              <span className="text-accent">✓</span>
              <span className="text-[13px] leading-snug">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function ContactCard() {
  return (
    <Shell className="w-[360px]">
      <div className="p-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">✉ let’s talk</p>
        <a href={`mailto:${profile.email}`} className="mt-2 block font-display text-2xl italic text-accent" {...noDrag}>
          {profile.email}
        </a>
        <p className="mt-1 text-[13px] text-ink-soft">{profile.phone}</p>
        <div className="mt-4 flex gap-2" {...noDrag}>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="rounded-lg bg-[#0a66c2] px-3 py-1.5 text-[12px] font-medium text-white">in · LinkedIn</a>
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="rounded-lg border border-line px-3 py-1.5 text-[12px]">GitHub</a>
          <a href={profile.links.site} target="_blank" rel="noreferrer" className="rounded-lg border border-line px-3 py-1.5 text-[12px]">Site</a>
        </div>
      </div>
    </Shell>
  );
}

function GithubCard() {
  // fake contribution grid
  const cells = Array.from({ length: 7 * 16 });
  return (
    <Shell className="w-[340px]">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[12px]">github.com/vijayapardhu</p>
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="text-accent" {...noDrag}>↗</a>
        </div>
        <div className="mt-3 grid grid-flow-col grid-rows-7 gap-[3px]">
          {cells.map((_, i) => {
            const lvl = (i * 1103515245 + 12345) % 5;
            const shades = ["var(--line)", "#9be9a833", "#40c46388", "#30a14e", "#216e39"];
            return <span key={i} className="h-[9px] w-[9px] rounded-[2px]" style={{ background: shades[lvl] }} />;
          })}
        </div>
        <p className="mt-3 text-[12px] text-ink-soft">Shipping consistently · Flutter · React · Laravel</p>
      </div>
    </Shell>
  );
}

function NowCard() {
  return (
    <div className="w-[300px] -rotate-1 rounded-[14px] bg-[#d7f0ff] p-5 text-[#0b3a52] shadow-[0_10px_30px_rgba(10,60,90,.2)] dark:bg-[#9cd0ea]">
      <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">📌 now building</p>
      <ul className="mt-2 space-y-1.5">
        {nowBuilding.map((n) => (
          <li key={n} className="flex items-center gap-2 text-[14px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CoffeeCard() {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-[150px] text-center" {...noDrag}>
      <button
        onClick={() => { setI((v) => (v + 1) % quotes.length); setOpen(true); }}
        className="text-[84px] leading-none transition-transform hover:-rotate-6 hover:scale-105"
        aria-label="Coffee — random quote"
      >
        ☕
      </button>
      {open && (
        <div className="mx-auto mt-1 max-w-[190px] rounded-xl border border-card-line bg-card px-3 py-2 text-[12px] italic text-ink-soft card-shadow">
          “{quotes[i]}”
        </div>
      )}
    </div>
  );
}

function Sticker({ label }: { label: string }) {
  return (
    <div className="select-none rounded-full border border-card-line bg-card px-4 py-2 text-[13px] font-medium card-shadow">
      <span className="mr-1.5 text-accent">◆</span>
      {label}
    </div>
  );
}
