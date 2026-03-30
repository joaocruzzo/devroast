"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";

interface HomeStatsWithDelayProps {
  totalSubmissions: number;
  averageScore: number;
}

export function HomeStatsWithDelay({
  totalSubmissions,
  averageScore,
}: HomeStatsWithDelayProps) {
  const [displayedSubmissions, setDisplayedSubmissions] = useState(0);
  const [displayedAvgScore, setDisplayedAvgScore] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDisplayedSubmissions(totalSubmissions);
      setDisplayedAvgScore(averageScore);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [totalSubmissions, averageScore]);

  return (
    <div className="flex items-center gap-4 justify-center pt-8 pb-8">
      <NumberFlow
        value={displayedSubmissions}
        className="font-mono text-xs text-text-tertiary tabular-nums"
      />
      <span className="font-mono text-xs text-text-tertiary">
        codes roasted
      </span>
      <span className="font-mono text-xs text-text-tertiary">·</span>
      <span className="font-mono text-xs text-text-tertiary">
        avg score:{" "}
        <NumberFlow
          value={displayedAvgScore}
          className="font-mono text-xs text-text-tertiary tabular-nums"
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        />
        /10
      </span>
    </div>
  );
}
