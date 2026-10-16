import { notFound } from "next/navigation";
import {
  fetchRepoReadme,
  fetchRepoLanguages,
} from "@/lib/github";
import { completedProjects } from "@/data/projects";

export function generateStaticParams() {
  return completedProjects.map((p) => ({
    slug: p.id,
  }));
}

const langColor: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Kotlin: "#a97bff",
  Python: "#3572a5",
  PHP: "#4f5d95",
  Dart: "#00a3e0",
  Java: "#007396",
  HTML: "#e34f26",
  CSS: "#1572b6",
  Cpp: "#00599c",
  C: "#00599c",
  Go: "#00add8",
  Rust: "#dea584",
  Swift: "#ffac45",
  Ruby: "#701516",
  Dockerfile: "#384d54",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Primary source: static project data (always works)
  const project = completedProjects.find((p) => p.id === slug);
  if (!project) notFound();

  // Optional: enhance with GitHub API data (readme, languages, stars)
  const repoName = project.repo;
  const [readmeRes, langRes] = await Promise.all([
    fetchRepoReadme(repoName).catch(() => null),
    fetchRepoLanguages(repoName).catch(() => null),
  ]);

  let readmeHtml = "";
  if (readmeRes?.content) {
    try {
      const decoded = Buffer.from(readmeRes.content, "base64").toString(
        "utf-8",
      );
      // Protect code blocks first
      const codeBlocks: string[] = [];
      const protectedText = decoded.replace(/```[\s\S]*?```/g, (match) => {
        codeBlocks.push(match);
        return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
      });

      // Convert markdown headers, leave raw HTML tags intact
      let html = protectedText
        .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-6 mb-3">$1</h1>')
        .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-5 mb-2">$1</h2>')
        .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
        .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold mt-3 mb-1">$1</h4>')
        .replace(/^\*\*\*(.+?)\*\*\*$/gm, '<strong><em>$1</em></strong>')
        .replace(/^\*\*(.+?)\*\*$/gm, '<strong>$1</strong>')
        .replace(/^\* (.+)$/gm, '<li class="ml-4">$1</li>')
        .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
        .replace(/^---$/gm, '<hr class="my-6 border-line" />');

      // Split into paragraphs and wrap plain text ones
      html = html
        .split(/\n\n+/)
        .map((part) => {
          const trimmed = part.trim();
          if (!trimmed) return "";
          // Already HTML (starts with <) or code block placeholder
          if (trimmed.startsWith("<") || trimmed.startsWith("___CODE_BLOCK_")) {
            return trimmed.replace(/\n/g, "<br>");
          }
          // Restore code blocks in this paragraph
          const restored = trimmed
            .replace(/___CODE_BLOCK_(\d+)___/g, (_, i) => {
              const cb = codeBlocks[Number(i)];
              return `<pre class="bg-bg-2 p-4 rounded-lg overflow-x-auto my-4"><code class="text-[11px] font-mono text-ink-soft">${cb.replace(/```/g, "").trim()}</code></pre>`;
            })
            .replace(/\n/g, "<br>");
          return `<p class="mb-4 text-[14px] leading-relaxed text-ink-soft">${restored}</p>`;
        })
        .join("");

      readmeHtml = html;
    } catch {
      readmeHtml = "";
    }
  }

  const langMap = (langRes ?? {}) as Record<string, number>;
  const langEntries = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const totalLangBytes = Object.values(langMap).reduce(
    (acc: number, b: number) => acc + b,
    0
  );

  return (
    <main className="min-h-dvh bg-bg text-ink">
      <nav className="border-b border-line bg-bg/50 sticky top-0 z-20 backdrop-blur">
        <div className="mx-auto max-w-5xl px-5 py-3 sm:px-10 lg:px-20">
          <a
            href="/"
            className="text-accent font-mono text-[12px] hover:text-ink transition-colors"
          >
            ← Back to portfolio
          </a>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-10 lg:px-20">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: langColor[project.stack[0]] || "var(--line)" }}
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
              {project.stack[0] ?? "Project"}
            </span>
            <span className="ml-auto font-mono text-[11px] text-accent">
              {project.type}
            </span>
          </div>
          <h1 className="font-display text-[3.5rem] leading-[1.02] tracking-tight mb-4 sm:text-[5rem]">
            {project.name}
          </h1>
          <p className="text-lg leading-relaxed text-ink-soft max-w-2xl">
            {project.blurb}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={project.github ?? project.live ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-[13px] font-medium text-bg hover:shadow-[0_10px_30px_-8px_var(--accent)] transition-all"
            >
              {project.github ? "View on GitHub →" : "Open Project →"}
            </a>
            {project.live && project.github && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-2.5 text-[13px] font-medium text-ink hover:border-accent transition-all"
              >
                Live Demo →
              </a>
            )}
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
            {project.year} · {project.kind === "phone" ? "Mobile App" : "Web App"} ·{' '}
            {project.stack.join(" · ")}
          </p>
        </div>

        {/* Tech Stack */}
        {project.stack.length > 0 && (
          <section className="mb-14">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ink-soft">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-3">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-md px-3 py-1.5 font-mono text-[11.5px] shrink-0"
                  style={{ background: `${project.accent}18`, color: project.accent }}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* GitHub Languages */}
        {langEntries.length > 0 && (
          <section className="mb-14">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ink-soft">
              GitHub Languages
            </p>
            <div className="flex flex-wrap gap-2">
              {langEntries.map(([lang, bytes]) => {
                const pct =
                  totalLangBytes > 0 ? Math.round((bytes / totalLangBytes) * 100) : 0;
                return (
                  <div
                    key={lang}
                    className="flex flex-col items-center gap-1"
                    title={`${lang} ${pct}%`}
                  >
                    <span
                      className="h-2 w-16 rounded-full shrink-0 bg-accent/20"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    >
                      <span
                        className="h-full rounded-full shrink-0"
                        style={{
                          width: `${Math.max(pct, 5)}%`,
                          background: langColor[lang] || "var(--line)",
                        }}
                      />
                    </span>
                    <span className="font-mono text-[10px] text-ink-soft">
                      {lang}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Readme */}
        {readmeHtml && (
          <section className="mb-14">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ink-soft">
              Readme
            </p>
            <div
              className="rounded-2xl border border-card-line bg-card p-8 sm:p-12 card-shadow prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: readmeHtml }}
            />
          </section>
        )}

        {/* Highlights */}
        {project.highlights.length > 0 && (
          <section className="mb-14">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ink-soft">
              Highlights
            </p>
            <ul className="space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[14px] leading-relaxed text-ink-soft">
                  <span className="mt-[2px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
