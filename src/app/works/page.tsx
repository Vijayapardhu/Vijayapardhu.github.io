import Link from "next/link";
import { completedProjects } from "@/data/projects";

export default function WorksPage() {
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

      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-10 lg:px-20">
        <div className="mb-12">
          <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-accent">
            03 — Works
          </p>
          <h1 className="font-display text-[3rem] leading-[1.05] tracking-tight mt-3 sm:text-[5rem]">
            All Works
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft max-w-2xl">
            Completed and shipped projects across web, mobile, and desktop.
          </p>
          <p className="mt-4 font-mono text-[11px] text-ink-soft">
            {completedProjects.length} projects shipped ·{' '}
            {completedProjects.reduce((acc, p) => acc + p.stack.length, 0)} technologies used
          </p>
        </div>

        <div className="grid gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {completedProjects.map((p, i) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}/`}
              className="group relative block border border-card-line bg-card rounded-2xl overflow-hidden hover:border-accent transition-colors"
            >
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
                <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                  {p.name}
                </h3>
                <p className="text-[14px] leading-relaxed text-ink-soft mb-5">
                  {p.blurb}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.stack.slice(0, 6).map((s) => (
                    <span
                      key={s}
                      className="rounded-md px-2.5 py-1 font-mono text-[11px] shrink-0"
                      style={{ background: `${p.accent}18`, color: p.accent }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-ink-soft">
                    Live →
                  </span>
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-ink px-3 py-1.5 text-[11px] font-medium text-bg hover:shadow-[0_10px_30px_-8px_var(--accent)] transition-all"
                    >
                      Open
                    </a>
                  )}
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-line px-3 py-1.5 text-[11px] font-medium text-ink hover:border-accent transition-all"
                    >
                      Code
                    </a>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
