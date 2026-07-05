"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  animate,
  type Variants,
} from "motion/react";
import Lenis from "lenis";
import { useBoard } from "@/lib/store";
import {
  profile,
  projects,
  experience,
  skills,
  timeline,
  certifications,
  stats,
  marquee,
  capabilities,
  softSkills,
  languages,
  quickFacts,
  personal,
} from "@/data/resume";

/* ---------------- shared motion ---------------- */
const EASE = [0.22, 1, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

function Reveal({
  children,
  className = "",
  delay = 0,
  y = 26,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* Words that reveal one-by-one on view (with room for descenders) */
function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <motion.span
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.14em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "115%" }, show: { y: 0, transition: { duration: 0.75, ease: EASE } } }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}

/* ---------------- page ---------------- */
export default function Portfolio() {
  const setSurface = useBoard((s) => s.setSurface);
  const heroRef = useRef<HTMLDivElement>(null);

  // buttery smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 1 });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, 140]);
  const heroFade = useTransform(heroP, [0, 0.85], [1, 0]);
  const blobY = useTransform(heroP, [0, 1], [0, -200]);

  return (
    <div className="desk-surface relative min-h-dvh overflow-clip">
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[85] h-[3px] origin-left bg-accent" />

      <motion.div
        style={{ y: blobY }}
        aria-hidden
        className="pointer-events-none absolute -right-40 top-20 -z-0 h-[520px] w-[520px] rounded-full opacity-[0.18] blur-[90px]"
      >
        <div className="h-full w-full rounded-full bg-[conic-gradient(from_120deg,var(--accent),transparent_60%)]" />
      </motion.div>

      {/* page */}
      <div className="relative mx-auto w-full max-w-[1600px] px-5 sm:px-10 lg:px-20">
        <div className="relative">
        {/* ================= HERO ================= */}
        <section ref={heroRef} className="relative flex min-h-dvh flex-col justify-center py-24">
          <motion.div style={{ y: heroY, opacity: heroFade }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent"
            >
              <span className="flex items-center gap-3">
                <span className="h-px w-10 bg-accent" />
                Portfolio ’26
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-3 py-1 text-[10px] text-ink-soft">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Available for work
              </span>
            </motion.div>

            <h1 className="font-display text-[15vw] leading-[0.9] tracking-[-0.03em] sm:text-[104px]">
              <Words text="Vijaya" className="block" />
              <span className="block italic text-accent">
                <Words text="Pardhu" />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="mt-6 font-mono text-[13px] uppercase tracking-[0.2em] text-ink-soft"
            >
              {profile.roles.join("  /  ")}
            </motion.p>

            <div className="mt-9 grid gap-10 sm:grid-cols-[1.4fr_1fr] sm:items-end">
              <motion.p variants={rise} initial="hidden" animate="show" transition={{ delay: 0.55 }} className="max-w-md text-lg leading-relaxed text-ink-soft">
                {profile.tagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.85, ease: EASE }}
                className="flex flex-col items-start gap-3 sm:items-end"
              >
                <Magnetic>
                  <button
                    onClick={() => setSurface("workspace")}
                    className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-bg transition-shadow hover:shadow-[0_10px_40px_-8px_var(--accent)]"
                  >
                    Explore Workspace
                    <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
                  </button>
                </Magnetic>
                <a href="/Vijayapardhu_resume.pdf" target="_blank" rel="noreferrer" className="link-underline text-sm text-ink-soft">
                  or read the résumé (PDF)
                </a>
              </motion.div>
            </div>
          </motion.div>

          <motion.div style={{ opacity: heroFade }} className="absolute bottom-8 left-6 flex items-center gap-3 font-mono text-[11px] text-ink-soft sm:left-10">
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>↓</motion.span>
            scroll to explore
          </motion.div>
        </section>

        {/* ================= STATS ================= */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={rise} className="bg-bg p-5 sm:p-8">
              <div className="font-display text-4xl tracking-tight sm:text-6xl">
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-[13px] leading-tight text-ink-soft">{s.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* ================= ABOUT (2-col) ================= */}
        <Chapter n="01" title="About">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <p className="font-display text-[26px] leading-[1.3] sm:text-[32px] sm:leading-[1.32]">
              <Words text={profile.summary} />
            </p>
            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-card-line bg-card p-6">
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">Quick facts</p>
                <dl className="space-y-4">
                  {quickFacts.map((f) => (
                    <div key={f.k} className="flex flex-col gap-0.5 border-b border-line pb-3 last:border-0 last:pb-0">
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-accent">{f.k}</dt>
                      <dd className="text-[15px]">{f.v}</dd>
                    </div>
                  ))}
                  <div className="flex flex-col gap-0.5">
                    <dt className="font-mono text-[11px] uppercase tracking-wide text-accent">Speaks</dt>
                    <dd className="text-[15px]">{languages.join(" · ")}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>

          {/* right now */}
          <div className="mt-16 max-w-xl">
            <Reveal delay={0.1}>
              <div>
                <p className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  Right now
                </p>
                <div className="space-y-3">
                  {personal.currently.map((c, i) => (
                    <motion.div
                      key={c.k}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
                      className="flex items-baseline gap-4"
                    >
                      <span className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-wide text-accent">{c.k}</span>
                      <span className="text-[16px] text-ink">{c.v}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Chapter>

        <Marquee />

        {/* ================= WHAT I DO ================= */}
        <Chapter n="02" title="How I work">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
          >
            {capabilities.map((c, i) => (
              <motion.div
                key={c.k}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                whileHover={{ backgroundColor: "var(--card)" }}
                className="group bg-bg p-7 transition-colors"
              >
                <span className="font-mono text-[12px] text-accent">0{i + 1}</span>
                <h3 className="mt-3 font-display text-[22px] leading-tight">{c.k}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{c.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </Chapter>

        {/* ================= WORK ================= */}
        <Chapter n="03" title="Selected Work">
          <div className="-mt-2">
            {projects.map((p, i) => (
              <WorkRow key={p.id} p={p} i={i} />
            ))}
          </div>
        </Chapter>

        {/* ================= EXPERIENCE ================= */}
        <Chapter n="04" title="Experience">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-card-line bg-card p-7 sm:p-9">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-3xl">{experience.role}</h3>
                <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-[11px] text-accent">{experience.duration}</span>
              </div>
              <p className="mt-1 text-accent">{experience.company}</p>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
                My first real job, and the one that taught me the most. I build apps for startups and small businesses here — the kind of work where an actual client is waiting on the other end. A bit of what that looks like:
              </p>
              <motion.ul
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2"
              >
                {experience.points.map((pt) => (
                  <motion.li variants={rise} key={pt} className="flex gap-3 text-[15px] text-ink-soft">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {pt}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </Reveal>
        </Chapter>

        {/* ================= TOOLKIT ================= */}
        <Chapter n="05" title="Toolkit">
          <div className="grid gap-8 sm:grid-cols-2">
            {Object.entries(skills).map(([group, items]) => (
              <Reveal key={group}>
                <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">{group}</h4>
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-wrap gap-2">
                  {items.map((it) => (
                    <motion.span
                      key={it}
                      variants={{ hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE } } }}
                      whileHover={{ y: -3, borderColor: "var(--accent)", color: "var(--accent)" }}
                      className="cursor-default rounded-full border border-card-line bg-card px-3.5 py-1.5 text-[13.5px] transition-colors"
                    >
                      {it}
                    </motion.span>
                  ))}
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Chapter>

        {/* ================= BEYOND THE CODE ================= */}
        <Chapter n="06" title="Beyond the code">
          <div className="flex flex-wrap gap-3">
            {softSkills.map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.04 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-full border border-card-line bg-card px-5 py-2.5 font-display text-lg italic"
              >
                {s}
              </motion.span>
            ))}
          </div>
        </Chapter>

        {/* ================= PATH ================= */}
        <Chapter n="07" title="Path">
          <div className="relative">
            <div className="absolute left-[7px] top-2 h-full w-px bg-line" />
            <div className="space-y-9">
              {timeline.map((t, i) => (
                <Reveal key={t.title} delay={i * 0.05}>
                  <div className="relative pl-9">
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 400, damping: 16, delay: i * 0.05 }}
                      className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-accent"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-bg" />
                    </motion.span>
                    <p className="font-mono text-[12px] text-accent">{t.year}</p>
                    <h3 className="mt-0.5 font-display text-2xl">{t.title}</h3>
                    <p className="text-[15px] text-ink-soft">{t.org}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-2.5">
              {certifications.map((c) => (
                <span key={c} className="rounded-xl border border-card-line bg-card px-3.5 py-2 text-[12.5px] text-ink-soft">
                  <span className="text-accent">✦</span> {c}
                </span>
              ))}
            </div>
          </Reveal>
        </Chapter>

        {/* ================= CONTACT ================= */}
        <section className="py-16 sm:py-24">
          <Reveal>
            <p className="mb-6 font-mono text-[12px] uppercase tracking-[0.3em] text-ink-soft">08 — Say hello</p>
          </Reveal>
          <Magnetic strength={0.2}>
            <a href={`mailto:${profile.email}`} className="group block font-display text-[11vw] italic leading-[1.02] tracking-tight text-accent sm:text-[80px]">
              <Words text="Let’s" />
              <span className="block not-italic text-ink transition-colors group-hover:text-accent">
                <Words text="talk." />
              </span>
            </a>
          </Magnetic>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-soft">
              Looking for an intern or a freelancer? Or you just want to bounce an idea around? Either way, my inbox is open — and I actually reply.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[14px] text-ink-soft">
              <a href={`mailto:${profile.email}`} className="link-underline text-ink">{profile.email}</a>
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="link-underline">GitHub ↗</a>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="link-underline">LinkedIn ↗</a>
              <a href={`tel:${profile.phone}`} className="link-underline">{profile.phone}</a>
            </div>
          </Reveal>
        </section>

        <footer className="border-t border-line py-12">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <Reveal>
                <p className="mb-2 font-mono text-[11px] text-ink-soft">{personal.signOff}</p>
                <Signature />
              </Reveal>
            </div>
            <button
              onClick={() => setSurface("workspace")}
              className="link-underline font-mono text-[12px] hover:text-accent"
            >
              enter the workspace →
            </button>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 font-mono text-[10.5px] uppercase tracking-wider text-ink-soft">
            <span>© Vijaya Pardhu — 2026</span>
            <span>Designed &amp; built from scratch · Next.js + Motion</span>
            <LocalTime />
          </div>
        </footer>
        </div>
      </div>
    </div>
  );
}

/* ---------------- section wrapper ---------------- */
function Chapter({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start center"] });
  const x = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const o = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section className="relative border-t border-line py-14 sm:py-20">
      <motion.div ref={ref} style={{ opacity: o, x }} className="mb-8 flex items-center gap-4 sm:mb-12">
        <span className="font-mono text-[12px] uppercase tracking-[0.3em] text-accent">{n}</span>
        <span className="h-px flex-1 bg-line" />
        <h2 className="font-display text-xl italic text-ink-soft">{title}</h2>
      </motion.div>
      {children}
    </section>
  );
}

/* ---------------- work row ---------------- */
function WorkRow({ p, i }: { p: (typeof projects)[number]; i: number }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.a
      href={p.live ?? p.github ?? "#"}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE, delay: i * 0.06 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="group relative block border-t border-line py-8 first:border-t-0"
    >
      <motion.span
        aria-hidden
        className="absolute inset-x-[-24px] inset-y-0 -z-10 rounded-2xl"
        animate={{ backgroundColor: hover ? "var(--card)" : "rgba(0,0,0,0)" }}
        transition={{ duration: 0.3 }}
      />
      <div className="flex items-start gap-6">
        <span className="w-8 pt-2 font-mono text-[13px] text-ink-soft">0{i + 1}</span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <motion.span className="h-2.5 w-2.5 rounded-full" style={{ background: p.accent }} animate={{ scale: hover ? [1, 1.5, 1] : 1 }} transition={{ duration: 0.5 }} />
            <h3 className="font-display text-3xl transition-transform duration-300 group-hover:translate-x-1 sm:text-4xl">{p.name}</h3>
            <span className="font-mono text-[11px] text-ink-soft">· {p.type} · {p.year}</span>
          </div>
          <motion.div
            initial={false}
            animate={{ height: hover ? "auto" : 0, opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pt-3 sm:max-w-2xl">
              <p className="text-[15px] leading-relaxed text-ink-soft">{p.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.highlights.map((h) => (
                  <span key={h} className="rounded-md px-2 py-0.5 font-mono text-[11px]" style={{ background: `${p.accent}18`, color: p.accent }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        <div className="hidden items-center gap-3 pt-2 sm:flex">
          <span className="font-mono text-[11px] text-ink-soft">{p.stack.slice(0, 3).join(" · ")}</span>
          <motion.span animate={{ rotate: hover ? 45 : 0, color: hover ? p.accent : "var(--ink-soft)" }} className="text-xl">↗</motion.span>
        </div>
      </div>
    </motion.a>
  );
}

/* ---------------- infinite tech marquee ---------------- */
function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="relative -mx-5 overflow-hidden border-y border-line py-5 sm:-mx-10 lg:-mx-20">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-10 whitespace-nowrap will-change-transform">
        {items.map((m, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl italic text-ink-soft">
            {m}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function LocalTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      }).format(new Date());
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 1000 * 20);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t ? `Kakinada · ${t} IST` : "Kakinada · IST"}</span>;
}

function Signature() {
  return (
    <div className="relative inline-block">
      <span className="font-display text-4xl italic sm:text-5xl">Vijaya Pardhu</span>
      <svg viewBox="0 0 220 12" className="mt-1 h-3 w-48 text-accent" fill="none" preserveAspectRatio="none">
        <motion.path
          d="M2 8 C 40 2, 80 12, 120 6 S 200 2, 218 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
        />
      </svg>
    </div>
  );
}

/* ---------------- magnetic hover ---------------- */
function Magnetic({ children, strength = 0.4 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [xy, setXy] = useState({ x: 0, y: 0 });
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setXy({ x: (e.clientX - (r.left + r.width / 2)) * strength, y: (e.clientY - (r.top + r.height / 2)) * strength });
      }}
      onMouseLeave={() => setXy({ x: 0, y: 0 })}
      animate={{ x: xy.x, y: xy.y }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
