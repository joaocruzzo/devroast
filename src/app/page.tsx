import Link from "next/link";
import { Suspense } from "react";
import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";
import { LeaderboardLoading } from "@/components/ui/leaderboard-rows";
import { LeaderboardTableWithDelay } from "@/components/ui/leaderboard-table-with-delay";
import {
  getLeaderboard,
  type LeaderboardEntry,
} from "@/db/queries/leaderboard";
import { HomeEditor } from "./home-editor";
import { HomeStats } from "./home-stats";

const languageMap: Record<string, BundledLanguage> = {
  javascript: "javascript",
  typescript: "typescript",
  sql: "sql",
  python: "python",
  rust: "rust",
  go: "go",
};

async function processCodePreview(code: string, language: string) {
  const lines = code.split("\n");
  const htmlLines = await Promise.all(
    lines.map((line) =>
      codeToHtml(line, {
        lang: (languageMap[language] || "javascript") as BundledLanguage,
        theme: "vesper",
      }),
    ),
  );
  return {
    htmlLines,
    isCollapsible: lines.length > 3,
    totalLines: lines.length,
  };
}

function _scoreColor(score: number): string {
  if (score <= 3) return "text-accent-red";
  if (score <= 6) return "text-accent-amber";
  return "text-accent-green";
}

async function LeaderboardContent() {
  const leaderboardEntries = await getLeaderboard({
    limit: 3,
    offset: 0,
  });

  const enrichedEntries = await Promise.all(
    leaderboardEntries.map(async (entry: LeaderboardEntry) => ({
      ...entry,
      preview: await processCodePreview(entry.code, entry.language),
    })),
  );

  return <LeaderboardTableWithDelay entries={enrichedEntries} />;
}

export default async function HomePage() {
  return (
    <main className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex flex-col items-center gap-3 pt-20 px-10">
        <h1 className="flex items-center gap-3 font-mono text-4xl font-bold">
          <span className="text-accent-green">$</span>
          <span className="text-text-primary">
            paste your code. get roasted.
          </span>
        </h1>
        <p className="font-mono text-sm text-text-secondary">
          {
            "// drop your code below and we'll rate it — brutally honest or full roast mode"
          }
        </p>
      </section>

      {/* Editor */}
      <section className="w-[780px] pt-8">
        <HomeEditor />
      </section>

      {/* Stats */}
      <HomeStats />

      {/* Spacer - 60px between Stats and Leaderboard */}
      <div className="h-[60px]" />

      {/* Leaderboard Preview */}
      <section className="flex flex-col gap-6 w-full max-w-5xl px-10 pb-15">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-accent-green">
              {"//"}
            </span>
            <span className="font-mono text-sm font-bold text-text-primary">
              shame_leaderboard
            </span>
          </div>

          <Link
            href="/leaderboard"
            className="font-mono text-xs text-text-secondary border border-border-primary px-3 py-1.5 hover:bg-bg-surface transition-colors"
          >
            $ view_all {">>"}
          </Link>
        </div>

        {/* Subtitle */}
        <p className="font-mono text-[13px] text-text-tertiary -mt-2">
          {"// the worst code on the internet, ranked by shame"}
        </p>

        {/* Leaderboard Table */}
        <div className="border border-border-primary w-full">
          {/* Table Header */}
          <div className="flex items-center h-10 px-5 bg-bg-surface border-b border-border-primary">
            <span className="w-12 font-mono text-xs font-medium text-text-tertiary">
              #
            </span>
            <span className="w-18 font-mono text-xs font-medium text-text-tertiary">
              score
            </span>
            <span className="flex-1 font-mono text-xs font-medium text-text-tertiary">
              code
            </span>
            <span className="w-24 font-mono text-xs font-medium text-text-tertiary">
              lang
            </span>
          </div>

          {/* Table Rows with Suspense */}
          <Suspense fallback={<LeaderboardLoading />}>
            <LeaderboardContent />
          </Suspense>
        </div>

        {/* Stats Footer */}
        <p className="font-mono text-xs text-text-tertiary text-center">
          showing top 3 ·{" "}
          <Link
            href="/leaderboard"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            view full leaderboard {">>"}
          </Link>
        </p>
      </section>
    </main>
  );
}
