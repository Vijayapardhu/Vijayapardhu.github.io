import { notFound } from "next/navigation";
import { fetchRepo, fetchRepoReadme, fetchRepoLanguages } from "@/lib/github";
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

  // Find project by slug to get the exact repo name (case-sensitive)
  const project = completedProjects.find((p) => p.id === slug);
  if (!project) notFound();

  const repoName = project.repo;

  const repo = await fetchRepo(repoName).catch(() => null);
  if (!repo) notFound();

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
      readmeHtml = decoded
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/^# (.+)$/gm, '<h2 class="text-2xl font-bold mt-4 mb-2">$1</h2>')
        .replace(/^## (.+)$/gm, '<h3 class="text-xl font-bold mt-3 mb-1">$1</h3>')
        .replace(/^### (.+)$/gm, '<h4 class="text-lg font-bold mt-2 mb-1">$1</h4>')
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br>");
      readmeHtml = `<p>${readmeHtml}</p>`;
    } catch {
      readmeHtml = "";
    }
  }

  const updated = new Date(repo.updated_at).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const created = new Date(repo.created_at).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const langMap = (langRes ?? {}) as Record<string, number>;
  const langEntries = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <main className="min-h-dvh bg-bg text-ink">
      <nav className="border-b border-line bg-bg/50 sticky top-0 z-20 backdrop-blur">
        <div className="mx-auto max-w-5xl px-5 py-3">
          <a
            href="/"
            className="text-accent font-mono text-[12px] hover:text-ink transition-colors"
          >
            ← Back to portfolio
          </a>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-10 lg:px-20">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: langColor[repo.language] || "var(--line)" }}
            />
            <span className="font-mono text-[10px] text-ink-soft">
              {repo.language}
            </span>
            {repo.forks_count > 0 && (
              <span className="font-mono text-[10px] text-ink-soft">
                · {repo.forks_count} forks
              </span>
            )}
            {repo.stargazers_count > 0 && (
              <span className="font-mono text-[10px] text-ink-soft">
                · ★ {repo.stargazers_count}
              </span>
            )}
          </div>
          <h1 className="font-display text-[3rem] leading-[1.05] tracking-tight mb-4">
            {repo.name}
          </h1>
          <p className="text-lg leading-relaxed text-ink-soft max-w-2xl">
            {repo.description || "No description available"}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-[13px] font-medium text-bg hover:shadow-[0_10px_30px_-8px_var(--accent)] transition-all"
            >
              View on GitHub →
            </a>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-2.5 text-[13px] font-medium text-ink hover:border-accent transition-all"
              >
                Live Demo →
              </a>
            )}
          </div>
          <p className="mt-4 font-mono text-[11px] text-ink-soft">
            Updated {updated} · Created {created}
          </p>
        </div>

        {langEntries.length > 0 && (
          <section className="mb-10">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink-soft">
              Languages
            </p>
            <div className="flex flex-wrap gap-2">
              {langEntries.map(([lang, bytes]) => {
                const total = Object.values(langMap).reduce(
                  (acc: number, b: number) => acc + b,
                  0
                );
                const pct = total > 0 ? Math.round((bytes / total) * 100) : 0;
                return (
                  <div
                    key={lang}
                    className="flex flex-col items-center gap-1"
                    title={`${lang} ${pct}%`}
                  >
                    <span
                      className="h-2 w-12 rounded-full shrink-0 bg-accent/20"
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

        {readmeHtml && (
          <section className="mb-10">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ink-soft">
              Readme
            </p>
            <div
              className="rounded-2xl border border-card-line bg-card p-8 sm:p-10 card-shadow prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: readmeHtml }}
            />
          </section>
        )}

        <section className="border-t border-line pt-8">
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-1">
                Repository
              </p>
              <p className="text-[13px] text-ink">{repo.full_name}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-1">
                Default branch
              </p>
              <p className="text-[13px] font-mono text-ink">
                {repo.default_branch}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-1">
                Size
              </p>
              <p className="text-[13px] text-ink">
                {(repo.size / 1024).toFixed(1)} MB
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-1">
                License
              </p>
              <p className="text-[13px] text-ink">
                {repo.license?.name || "None"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
