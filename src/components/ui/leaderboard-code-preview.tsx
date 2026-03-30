"use client";

import { useState } from "react";

interface LeaderboardCodePreviewProps {
  htmlLines: string[];
  totalLines: number;
  maxVisibleLines?: number;
}

export function LeaderboardCodePreview({
  htmlLines,
  totalLines,
  maxVisibleLines = 3,
}: LeaderboardCodePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleLines = isExpanded ? htmlLines.length : maxVisibleLines;
  const hiddenLines = totalLines - maxVisibleLines;

  return (
    <div className="flex-1 flex flex-col gap-1.5">
      {htmlLines.slice(0, visibleLines).map((html, idx) => (
        <div
          key={idx}
          className="font-mono text-xs leading-tight [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ))}

      {hiddenLines > 0 && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-text-tertiary hover:text-text-secondary transition-colors pt-1 text-left"
        >
          <span className="font-mono text-xs">
            {isExpanded
              ? `[-] hide ${hiddenLines} line${hiddenLines !== 1 ? "s" : ""}`
              : `[+] show ${hiddenLines} more line${hiddenLines !== 1 ? "s" : ""}`}
          </span>
        </button>
      )}
    </div>
  );
}
