"use client";

import type React from "react";
import { useState } from "react";
import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";

const languageMap: Record<string, BundledLanguage> = {
  javascript: "javascript",
  typescript: "typescript",
  sql: "sql",
  python: "python",
  rust: "rust",
  go: "go",
};

interface LeaderboardEntry {
  id: string;
  code: string;
  language: string;
  score: number;
  createdAt: Date;
}

interface PreviewData {
  htmlLines: string[];
  isCollapsible: boolean;
  totalLines: number;
}

async function processCodePreview(
  code: string,
  language: string,
): Promise<PreviewData> {
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

function scoreColor(score: number): string {
  if (score <= 3) return "text-accent-red";
  if (score <= 6) return "text-accent-amber";
  return "text-accent-green";
}

function SkeletonRow() {
  return (
    <div className="flex items-start px-5 py-4 gap-4 border-b border-border-primary">
      <div className="w-12 h-4 bg-bg-surface animate-pulse rounded" />
      <div className="w-18 h-4 bg-bg-surface animate-pulse rounded" />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="w-full h-4 bg-bg-surface animate-pulse rounded" />
        <div className="w-3/4 h-4 bg-bg-surface animate-pulse rounded" />
        <div className="w-1/2 h-4 bg-bg-surface animate-pulse rounded" />
      </div>
      <div className="w-24 h-4 bg-bg-surface animate-pulse rounded" />
    </div>
  );
}

export function LeaderboardRows({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <>
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className={`flex items-start px-5 py-4 gap-4 ${
            index < entries.length - 1 ? "border-b border-border-primary" : ""
          }`}
        >
          <span
            className={`w-12 font-mono text-xs flex-shrink-0 pt-1 ${
              index === 0 ? "text-accent-amber" : "text-text-secondary"
            }`}
          >
            {index + 1}
          </span>
          <span
            className={`w-18 font-mono text-xs font-bold flex-shrink-0 pt-1 ${scoreColor(entry.score)}`}
          >
            {entry.score.toFixed(1)}
          </span>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="font-mono text-xs text-text-tertiary">
              loading preview...
            </div>
          </div>
          <span className="w-24 font-mono text-xs text-text-secondary text-right flex-shrink-0 pt-1">
            {entry.language}
          </span>
        </div>
      ))}
    </>
  );
}

export function LeaderboardRowsStatic({
  entries,
}: {
  entries: (LeaderboardEntry & { preview: PreviewData })[];
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <>
      {entries.map((entry, index) => {
        const isExpanded = expandedIds.has(entry.id);
        const linesToShow = isExpanded
          ? entry.preview.htmlLines
          : entry.preview.htmlLines.slice(0, 3);

        return (
          <div
            key={entry.id}
            className={`flex items-start px-5 py-4 ${
              index < entries.length - 1 ? "border-b border-border-primary" : ""
            }`}
          >
            <span
              className={`w-12 font-mono text-xs flex-shrink-0 pt-1 ${
                index === 0 ? "text-accent-amber" : "text-text-secondary"
              }`}
            >
              {index + 1}
            </span>
            <span
              className={`w-18 font-mono text-xs font-bold flex-shrink-0 pt-1 ${scoreColor(entry.score)}`}
            >
              {entry.score.toFixed(1)}
            </span>
            <div className="flex-1 flex flex-col gap-3">
              {linesToShow.map((html, idx) => (
                <div
                  key={idx}
                  className="font-mono text-xs leading-tight [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ))}
              {entry.preview.isCollapsible && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExpand(entry.id);
                  }}
                  className="font-mono text-xs text-text-tertiary hover:text-text-secondary text-left cursor-pointer"
                >
                  {isExpanded
                    ? `- collapse`
                    : `+ ${entry.preview.totalLines - 3} more lines`}
                </button>
              )}
            </div>
            <span className="w-24 font-mono text-xs text-text-secondary flex-shrink-0 pt-1">
              {entry.language}
            </span>
          </div>
        );
      })}
    </>
  );
}

export function LeaderboardLoading() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </>
  );
}

export type { LeaderboardEntry, PreviewData };
export { processCodePreview };
