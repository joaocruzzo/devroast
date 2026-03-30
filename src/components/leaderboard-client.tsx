"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";
import { Button } from "@/components/ui/button";
import {
  LeaderboardRowCode,
  LeaderboardRowRank,
  LeaderboardRowScore,
} from "@/components/ui/leaderboard-row";
import { trpc } from "@/trpc/client";

interface ProcessedEntry {
  id: string;
  rank: number;
  score: number;
  language: string;
  totalLines: number;
  htmlLines: string[];
}

interface LeaderboardEntryCardProps {
  entry: ProcessedEntry;
}

const languageMap: Record<string, BundledLanguage> = {
  javascript: "javascript",
  typescript: "typescript",
  sql: "sql",
  python: "python",
  rust: "rust",
  go: "go",
};

function LeaderboardEntryCard({ entry }: LeaderboardEntryCardProps) {
  const isLongCode = entry.totalLines > 8;

  return (
    <Link
      href={`/roast/${entry.id}`}
      className="block border border-border-primary hover:border-accent-green transition-colors"
    >
      <div className="flex items-center justify-between h-12 px-5 bg-bg-surface border-b border-border-primary">
        <div className="flex items-center gap-4">
          <LeaderboardRowRank className="text-accent-amber">
            <span>#</span>
            <span> </span>
            <span>{entry.rank}</span>
          </LeaderboardRowRank>
          <span className="font-mono text-xs text-text-tertiary">score:</span>
          <LeaderboardRowScore value={entry.score} />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-secondary">
            {entry.language}
          </span>
          <span className="font-mono text-xs text-text-tertiary">
            {entry.totalLines} lines
          </span>
        </div>
      </div>

      <div
        className={`flex bg-bg-input ${isLongCode ? "max-h-60" : ""} ${isLongCode ? "overflow-y-auto" : ""}`}
      >
        <div className="flex flex-col items-end gap-2.5 py-3 px-2.5 w-10 bg-bg-surface border-r border-border-primary flex-shrink-0">
          {entry.htmlLines.map((_, i) => (
            <span
              key={i}
              className="font-mono text-xs leading-tight text-text-tertiary"
            >
              {i + 1}
            </span>
          ))}
        </div>

        <div className="flex-1 p-3 overflow-x-auto">
          <LeaderboardRowCode className="gap-2.5">
            {entry.htmlLines.map((html, idx) => (
              <div
                key={idx}
                className="font-mono text-xs leading-tight whitespace-pre [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ))}
          </LeaderboardRowCode>
        </div>
      </div>
    </Link>
  );
}

export function LeaderboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam, 10) : 0;

  const [page, setPage] = useState(initialPage);
  const [processedEntries, setProcessedEntries] = useState<ProcessedEntry[]>(
    [],
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const limit = 5;
  const offset = page * limit;

  useEffect(() => {
    const param = searchParams.get("page");
    const urlPage = param ? parseInt(param, 10) : 0;
    setPage(urlPage);
  }, [searchParams]);

  const createQueryString = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage === 0) {
        params.delete("page");
      } else {
        params.set("page", newPage.toString());
      }
      return params.toString();
    },
    [searchParams],
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.replace(`/leaderboard?${createQueryString(newPage)}`, {
      scroll: false,
    });
  };

  const { data: entries, isLoading } = trpc.roast.getLeaderboard.useQuery({
    limit: limit + 1,
    offset,
  });

  useEffect(() => {
    if (!entries) return;

    setIsProcessing(true);
    const displayEntries = entries.slice(0, limit);

    Promise.all(
      displayEntries.map(async (entry, idx) => {
        const lines = entry.code.split("\n");
        const htmlLines = await Promise.all(
          lines.map((line) =>
            codeToHtml(line, {
              lang: (languageMap[entry.language] ||
                "javascript") as BundledLanguage,
              theme: "vesper",
            }),
          ),
        );
        return {
          id: entry.id,
          rank: offset + idx + 1,
          score: entry.score,
          language: entry.language,
          totalLines: lines.length,
          htmlLines,
        };
      }),
    ).then((processed) => {
      setProcessedEntries(processed);
      setIsProcessing(false);
    });
  }, [entries, offset]);

  const hasMore = (entries?.length || 0) > limit;
  const showLoading = isLoading || isProcessing;

  return (
    <div className="flex flex-col gap-5">
      {showLoading && (
        <div className="text-center py-10 font-mono text-sm text-text-tertiary">
          Loading...
        </div>
      )}

      {!showLoading && processedEntries.length === 0 && (
        <div className="text-center py-10 font-mono text-sm text-text-tertiary">
          No entries found.
        </div>
      )}

      {processedEntries.map((entry) => (
        <LeaderboardEntryCard key={entry.id} entry={entry} />
      ))}

      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={() => handlePageChange(Math.max(0, page - 1))}
          disabled={page === 0 || showLoading}
          variant="secondary"
        >
          Previous
        </Button>
        <span className="font-mono text-sm text-text-secondary">
          Page {page + 1}
        </span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasMore || showLoading}
          variant="secondary"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
