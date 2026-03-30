"use client";

import NumberFlow from "@number-flow/react";

interface StatsDisplayProps {
  totalSubmissions: number;
  averageScore: number;
}

export function StatsDisplay({
  totalSubmissions,
  averageScore,
}: StatsDisplayProps) {
  return (
    <div className="flex items-center gap-6 justify-center pt-8">
      <NumberFlow
        value={totalSubmissions}
        className="font-mono text-xs text-text-tertiary tabular-nums"
      />
      <span className="font-mono text-xs text-text-tertiary">
        codes roasted
      </span>
      <span className="font-mono text-xs text-text-tertiary">·</span>
      <span className="font-mono text-xs text-text-tertiary">avg score: </span>
      <NumberFlow
        value={averageScore}
        className="font-mono text-xs text-text-tertiary tabular-nums"
        format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
      />
      <span className="font-mono text-xs text-text-tertiary">/10</span>
    </div>
  );
}
