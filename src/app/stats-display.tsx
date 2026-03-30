"use client";

import NumberFlow from "@number-flow/react";
import { useState } from "react";
import { trpc } from "@/trpc/client";

export function StatsDisplay() {
  const [displayedSubmissions, setDisplayedSubmissions] = useState(0);
  const [displayedAvgScore, setDisplayedAvgScore] = useState(0);

  const { data: stats } = trpc.roast.getStats.useQuery(undefined, {
    staleTime: 1000 * 60 * 60,
  });

  if (stats && stats.totalRoasts !== displayedSubmissions) {
    setDisplayedSubmissions(stats.totalRoasts);
  }
  if (stats && stats.avgScore !== displayedAvgScore) {
    setDisplayedAvgScore(stats.avgScore);
  }

  return (
    <div className="flex items-center gap-6 pt-8">
      <span className="flex items-center gap-2">
        <NumberFlow
          value={displayedSubmissions}
          className="font-mono text-xs text-text-tertiary tabular-nums"
        />
        <span className="font-mono text-xs text-text-tertiary">
          codes roasted
        </span>
      </span>
      <span className="font-mono text-xs text-text-tertiary">·</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-xs text-text-tertiary">avg score:</span>
        <NumberFlow
          value={displayedAvgScore}
          className="font-mono text-xs text-text-tertiary tabular-nums"
        />
        <span className="font-mono text-xs text-text-tertiary">/10</span>
      </span>
    </div>
  );
}
