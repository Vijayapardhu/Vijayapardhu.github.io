import Link from "next/link";
import { completedProjects } from "@/data/projects";

export default function WorksPage() {
  const totalStacks = new Set(
    completedProjects.flatMap((p) => p.stack)
  ).size;

  return (
    <main className="min-h-dvh bg-bg text-ink">
      <nav className="border-b border-line bg-bg/50 sticky top-0 z-20 backdrop-blur">
        <div className="mx-auto max-w-5xl px-5 py-3 sm:px-10 lg:px-20">
          <Link
            href="/"
            className="text-accent font-mono text-[12px] hover:text-ink transition-colors"
          >
            ← Back to portfolio
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-10 lg:px-20">
        <div className="mb-16">
          <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-accent">
            03 — Works
          </p>
          <h1 className="font-display text-[4rem] leading-[1] tracking-tight mt-2 sm:text-[6rem]">
            All Works
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft max-w-2xl">
            Completed and shipped projects across web, mobile, and desktop —
            built for real clients, not just side projects.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1 text-ink-soft">
              {completedProjects.length} projects shipped
            </span>
            <span className="flex items-center gap-1 text-ink-soft">
              {totalStacks} technologies
            </span>
            <span className="flex items-center gap-1 text-ink-soft">
              {completedProjects.filter((p) => p.live).length} live demos
            </span>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {completedProjects.map((p, i) => (
            <article
              key={p.id}
              className="group relative border border-card-line bg-card rounded-2xl overflow-hidden hover:border-accent transition-all duration-300"
            >
              {/* Accent top border */}
              <div
                className="absolute left-0 top-0 right-0 h-1"
                style={{ background: p.accent }}
              />

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: p.accent }}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                    {p.year}
                  </span>
                  <span className="ml-auto font-mono text-[11px] text-accent">
                    {p.type}
                  </span>
                </div>
                <Link
                  href={`/projects/${p.id}/`}
                  className="group-hover:text-accent transition-colors"
                >
                  <h3 className="font-display text-2xl font-bold mb-2">
                    {p.name}
                  </h3>
                </Link>
                <p className="text-[14px] leading-relaxed text-ink-soft mb-5 line-clamp-2">
                  {p.blurb}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.stack.slice(0, 5).map((s) => (
                    <span
                      key={s}
                      className="rounded-md px-2.5 py-1 font-mono text-[11px] shrink-0"
                      style={{ background: `${p.accent}18`, color: p.accent }}
                    >
                      {s}
                    </span>
                  ))}
                  {p.stack.length > 5 && (
                    <span className="rounded-md px-2.5 py-1 font-mono text-[11px] shrink-0 bg-line text-ink-soft">
                      +{p.stack.length - 5}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {p.live && (
                    <Link
                      href={p.live}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-ink px-3.5 py-2 text-[11.5px] font-medium text-bg hover:shadow-[0_10px_30px_-8px_var(--accent)] transition-all"
                    >
                      Live Demo ↗
                    </Link>
                  )}
                  {p.github && (
                    <Link
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-line px-3.5 py-2 text-[11.5px] font-medium text-ink hover:border-accent hover:text-accent transition-all"
                    >
                      Code ↗
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 border-t border-line pt-10 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
            © Vijaya Pardhu — 2026
          </span>
          <Link
            href="/"
            className="text-accent font-mono text-[12px] hover:text-ink transition-colors"
          >
            Back to portfolio →
          </Link>
        </div>
      </div>
    </main>
  );
}
