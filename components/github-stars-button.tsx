import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const GITHUB_REPO = "shahrulestar/tukarqr";

async function getGitHubStarCount() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response.ok) return null;

    const data = (await response.json()) as { stargazers_count: number };
    return data.stargazers_count;
  } catch {
    return null;
  }
}

export async function GithubStarsButton() {
  const starCount = await getGitHubStarCount();

  return (
    <Button variant="secondary" asChild>
      <a
        href={`https://github.com/${GITHUB_REPO}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Star />
        stars
        {starCount !== null ? (
          <span className="font-semibold tabular-nums">{starCount}</span>
        ) : null}
      </a>
    </Button>
  );
}
