"use client";

import { diffLines } from "diff";
import { Suspense, useState } from "react";
import { BackLink } from "@/components/ui/back-link";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffBlock, type DiffLineData } from "@/components/ui/diff-block";
import { IssueCard } from "@/components/ui/issue-card";
import { ScoreRing } from "@/components/ui/score-ring";

type Issue = {
  id: string;
  category: string;
  message: string;
  severity: string;
};

type SuggestedFix = {
  id: string;
  issueId: string;
  originalCode: string;
  fullCode: string;
  explanation: string | null;
  createdAt: Date;
  diffJson: string;
};

type Submission = {
  id: string;
  score: number;
  overallFeedback: string;
  language: string;
  code: string;
  issues: Issue[];
  suggestedFixes: SuggestedFix[];
};

type RoastContentProps = {
  submission: Submission;
};

function stripComments(line: string): string {
  let result = line;
  result = result.replace(/\/\*.*?\*\//g, "");
  result = result.replace(/\/\/.*$/, "");
  return result;
}

function filterCodeLines(code: string): string[] {
  return code
    .split("\n")
    .map((line) => stripComments(line))
    .filter((line) => line.length > 0);
}

function computeDiff(fix: SuggestedFix): DiffLineData[] {
  if (!fix.originalCode || !fix.fullCode) {
    return [];
  }

  const originalLines = filterCodeLines(fix.originalCode);
  const fixedLines = filterCodeLines(fix.fullCode);
  const lines: DiffLineData[] = [];

  const diffResult = diffLines(originalLines.join("\n"), fixedLines.join("\n"));

  for (const part of diffResult) {
    const partLines = part.value.split("\n");
    for (const line of partLines) {
      if (line.length === 0) continue;
      if (part.added) {
        lines.push({ type: "added", content: line });
      } else if (part.removed) {
        lines.push({ type: "removed", content: line });
      } else {
        lines.push({ type: "context", content: line });
      }
    }
  }

  return lines;
}

export function RoastContent({ submission }: RoastContentProps) {
  const [shareText] = useState("$ share_roast");

  const severityMap: Record<string, "error" | "warning" | "info"> = {
    critical: "error",
    warning: "warning",
    good: "info",
  };

  const getVerdict = (score: number) => {
    if (score >= 7) return { color: "green", text: "verdict: excellent_code" };
    if (score >= 4)
      return { color: "amber", text: "verdict: needs_improvement" };
    return { color: "red", text: "verdict: needs_serious_help" };
  };

  const firstFix = submission.suggestedFixes[0];
  const diffLines = firstFix ? computeDiff(firstFix) : [];
  const verdict = getVerdict(submission.score);

  return (
    <main className="flex flex-col gap-10 px-20 py-10">
      <div className="flex items-center gap-12">
        <ScoreRing score={submission.score} />

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={
                verdict.color === "green"
                  ? "size-2 rounded-full bg-accent-green"
                  : verdict.color === "amber"
                    ? "size-2 rounded-full bg-accent-amber"
                    : "size-2 rounded-full bg-accent-red"
              }
            />
            <span
              className={
                verdict.color === "green"
                  ? "font-mono text-sm font-medium text-accent-green"
                  : verdict.color === "amber"
                    ? "font-mono text-sm font-medium text-accent-amber"
                    : "font-mono text-sm font-medium text-accent-red"
              }
            >
              {verdict.text}
            </span>
          </div>

          <p className="font-mono text-xl text-text-primary leading-relaxed">
            "{submission.overallFeedback}"
          </p>

          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-text-tertiary">
              lang: {submission.language}
            </span>
            <span className="font-mono text-xs text-text-tertiary">·</span>
            <span className="font-mono text-xs text-text-tertiary">
              {submission.code.split("\n").length} lines
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border border-border-primary hover:bg-bg-surface transition-colors"
            >
              <span className="font-mono text-xs text-text-secondary">
                {shareText}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="h-px bg-border-primary" />

      <div className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 font-mono text-sm font-bold">
          <span className="text-accent-green">{"//"}</span>
          <span className="text-text-primary">your_submission</span>
        </h2>
        <Suspense
          fallback={
            <div className="h-48 border border-border-primary bg-bg-surface animate-pulse" />
          }
        >
          <CodeBlock code={submission.code} lang={submission.language as any} />
        </Suspense>
      </div>

      <div className="h-px bg-border-primary" />

      <div className="flex flex-col gap-6">
        <h2 className="flex items-center gap-2 font-mono text-sm font-bold">
          <span className="text-accent-green">{"//"}</span>
          <span className="text-text-primary">detailed_analysis</span>
        </h2>
        <div className="grid grid-cols-2 gap-5">
          {submission.issues.map((issue) => (
            <IssueCard
              key={issue.id}
              title={issue.category}
              description={issue.message}
              severity={severityMap[issue.severity] || "info"}
            />
          ))}
        </div>
      </div>

      {diffLines.length > 0 && (
        <>
          <div className="h-px bg-border-primary" />
          <div className="flex flex-col gap-6">
            <h2 className="flex items-center gap-2 font-mono text-sm font-bold">
              <span className="text-accent-green">{"//"}</span>
              <span className="text-text-primary">suggested_fix</span>
            </h2>
            <DiffBlock
              filename={`your_code.${submission.language} → improved_code.${submission.language}`}
              lines={diffLines}
            />
          </div>
        </>
      )}

      <Suspense fallback={null}>
        <BackLink />
      </Suspense>
    </main>
  );
}
