import { GithubStarsButtonClient } from "@/components/github-stars-button-client";

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
    <GithubStarsButtonClient
      repo={GITHUB_REPO}
      starCount={starCount}
    />
  );
}
