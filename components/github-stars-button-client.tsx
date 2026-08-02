"use client";

import { Icon, StarIcon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

interface GithubStarsButtonClientProps {
  repo: string;
  starCount: number | null;
}

export function GithubStarsButtonClient({
  repo,
  starCount,
}: GithubStarsButtonClientProps) {
  const t = useT();

  return (
    <Button variant="secondary" asChild>
      <a
        href={`https://github.com/${repo}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon icon={StarIcon} size={16} className="size-4" />
        {t("about.openSource.stars")}
        {starCount !== null ? (
          <span className="font-semibold tabular-nums">{starCount}</span>
        ) : null}
      </a>
    </Button>
  );
}
