const GITHUB_USER = "Vijayapardhu";
const REPO = "Vijayapardhu";

async function githubFetch(path: string) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "vijayapardhu-portfolio",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
  return res.json();
}

export async function fetchUserRepos() {
  return githubFetch(`/users/${GITHUB_USER}/repos?sort=updated&per_page=50`);
}

export async function fetchUserEvents() {
  return githubFetch(`/users/${GITHUB_USER}/events?per_page=20`);
}

export async function fetchRepo(name: string) {
  return githubFetch(`/repos/${GITHUB_USER}/${name}`);
}

export async function fetchRepoReadme(name: string) {
  return githubFetch(`/repos/${GITHUB_USER}/${name}/readme`);
}

export async function fetchRepoLanguages(name: string) {
  return githubFetch(`/repos/${GITHUB_USER}/${name}/languages`);
}

export async function fetchProfileReadme() {
  const data = await githubFetch(`/repos/${GITHUB_USER}/${REPO}/readme`);
  if (!data?.content) return "";
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  return decoded;
}

/**
 * Extract featured projects from the README.
 * Looks for the "Featured Projects" section and parses [[Name](url)] links.
 * Returns projects sorted by their order in the README.
 */
export async function fetchFeaturedProjects() {
  const readme = await fetchProfileReadme().catch(() => "");

  // Find the Featured Projects section
  const featuredMatch = readme.match(/#+\s*Featured Projects[\s\S]*?(?=#+\s|$)/i);
  const section = featuredMatch ? featuredMatch[0] : readme;

  // Parse [[Project Name](https://github.com/Vijayapardhu/RepoName)] patterns
  const projects: Array<{
    name: string;
    repo: string;
    github: string;
    id: string;
  }> = [];

  const linkRegex = /\[\[([^\]]+)\]\((https?:\/\/github\.com\/[^)]+)\)\]/g;
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(section)) !== null) {
    const name = match[1].trim();
    const url = match[2].trim();
    const repo = url.split("/").pop() || url;
    const id = repo.toLowerCase().replace(/[^a-z0-9]/g, "-");
    projects.push({ name, repo, github: url, id });
  }

  return projects;
}
