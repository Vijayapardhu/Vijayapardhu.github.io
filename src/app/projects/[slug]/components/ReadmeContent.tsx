"use client";

import { useEffect, useState } from "react";

const GITHUB_USER = "Vijayapardhu";

export function ReadmeContent({ repo }: { repo: string }) {
  const [readmeHtml, setReadmeHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const rawBase = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo}/main/`;

      try {
        const readmeRes = await fetch(
          `https://api.github.com/repos/${GITHUB_USER}/${repo}/readme`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              "User-Agent": "vijayapardhu-portfolio",
            },
          },
        ).catch(() => null);

        if (readmeRes?.ok) {
          const data = await readmeRes.json();
          if (data?.content) {
            const decoded = Buffer.from(data.content, "base64").toString(
              "utf-8",
            );

            // Rewrite relative image URLs to GitHub raw content
            let text = decoded
              // HTML <img src="...">
              .replace(
                /<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/gi,
                (match, before, url, after) => {
                  const absUrl =
                    url.startsWith("http") || url.startsWith("//")
                      ? url
                      : rawBase + url.replace(/^\//, "");
                  return `<img${before}src="${absUrl}"${after}>`;
                },
              )
              // Markdown ![alt](url)
              .replace(
                /!\[([^\]]*)\]\(([^)]+)\)/g,
                (match, alt, url) => {
                  const absUrl =
                    url.startsWith("http") || url.startsWith("//")
                      ? url
                      : rawBase + url.replace(/^\//, "");
                  return `![${alt}](${absUrl})`;
                },
              );

            // Protect code blocks and <details> blocks
            const protectedBlocks: string[] = [];
            const protect = (t: string, regex: RegExp) =>
              t.replace(regex, (m) => {
                protectedBlocks.push(m);
                return `___BLOCK_${protectedBlocks.length - 1}___`;
              });

            text = protect(text, /```[\s\S]*?```/g);
            text = protect(text, /<details[\s\S]*?<\/details>/g);

            // Convert headers
            text = text
              .replace(
                /^# (.+)$/gm,
                '<h1 class="text-3xl font-bold mt-6 mb-3">$1</h1>',
              )
              .replace(
                /^## (.+)$/gm,
                '<h2 class="text-2xl font-bold mt-5 mb-2">$1</h2>',
              )
              .replace(
                /^### (.+)$/gm,
                '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>',
              )
              .replace(
                /^#### (.+)$/gm,
                '<h4 class="text-lg font-bold mt-3 mb-1">$1</h4>',
              );

            // Split by blank lines into paragraphs
            const parts = text.split(/\n\n+/);

            let html = "";
            for (const part of parts) {
              const trimmed = part.trim();
              if (!trimmed) continue;

              // Restore protected blocks first
              let inner = trimmed.replace(
                /___BLOCK_(\d+)___/g,
                (_, i) => {
                  const block = protectedBlocks[Number(i)];
                  if (block.startsWith("```")) {
                    const code = block
                      .replace(/```\w*/, "")
                      .replace(/```$/, "")
                      .trim();
                    return `<pre class="bg-bg-2 p-4 rounded-lg overflow-x-auto my-4"><code class="text-[11px] font-mono text-ink-soft">${code}</code></pre>`;
                  }
                  return block;
                },
              );

              // If it's already a block element, output as-is
              if (
                inner.startsWith("<h") ||
                inner.startsWith("<div") ||
                inner.startsWith("<table") ||
                inner.startsWith("<hr") ||
                inner.startsWith("</div>") ||
                inner.startsWith("</table>") ||
                inner.startsWith("<pre") ||
                inner.startsWith("<details") ||
                inner.startsWith("</details>")
              ) {
                html += inner + "\n";
                continue;
              }

              // Convert inline markdown
              inner = inner
                // Links [text](url)
                .replace(
                  /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
                  '<a href="$2" target="_blank" rel="noreferrer" class="text-accent hover:underline">$1</a>',
                )
                .replace(
                  /\[([^\]]+)\]\(([^)]+)\)/g,
                  '<a href="$2" class="text-accent hover:underline">$1</a>',
                )
                // Images ![alt](url)
                .replace(
                  /!\[([^\]]*)\]\(([^)]+)\)/g,
                  '<img src="$2" alt="$1" class="max-w-full h-auto my-6 rounded-lg border border-line" loading="lazy" />',
                )
                // Bold **text**
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                // Italic *text*
                .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
                // Inline code `code`
                .replace(
                  /`([^`]+)`/g,
                  '<code class="bg-accent/10 px-1 py-0.5 rounded text-[11px] font-mono text-accent">$1</code>',
                )
                // Bare URLs
                .replace(
                  /(https?:\/\/[^\s<>"']+)/g,
                  '<a href="$1" target="_blank" rel="noreferrer" class="text-accent hover:underline">$1</a>',
                );

              html += `<p class="mb-4 text-[14px] leading-relaxed text-ink-soft">${inner}</p>\n`;
            }

            if (!cancelled) setReadmeHtml(html);
          }
        }
      } catch {
        // Silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [repo]);

  if (loading && !readmeHtml) {
    return (
      <div className="rounded-2xl border border-card-line bg-card p-8 sm:p-12 card-shadow animate-pulse">
        <div className="h-4 w-1/3 mb-3 rounded bg-line" />
        <div className="h-4 w-full mb-3 rounded bg-line" />
        <div className="h-4 w-3/4 rounded bg-line" />
        <div className="h-4 w-full mb-3 rounded bg-line" />
        <div className="h-4 w-1/2 rounded bg-line" />
      </div>
    );
  }

  if (!readmeHtml) return null;

  return (
    <section className="mb-14">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ink-soft">
        Readme
      </p>
      <div
        className="rounded-2xl border border-card-line bg-card p-8 sm:p-12 card-shadow prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: readmeHtml }}
      />
    </section>
  );
}
