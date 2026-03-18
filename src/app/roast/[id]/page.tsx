import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffBlock } from "@/components/ui/diff-block";
import { IssueCard } from "@/components/ui/issue-card";
import { ScoreRing } from "@/components/ui/score-ring";

type RoastResultPageProps = {
  params: Promise<{ id: string }>;
};

const staticCode = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const issues = [
  {
    title: "Naming convention violation",
    description:
      "Variable names should use camelCase. 'calculateTotal' should be 'calculate_total' in snake_case.",
    severity: "warning" as const,
  },
  {
    title: "Simplifiable loop",
    description:
      "This loop can be replaced with items.reduce((sum, item) => sum + item.price, 0) for better readability.",
    severity: "info" as const,
  },
  {
    title: "Missing input validation",
    description:
      "No check if items is an array or if price is a valid number. This could cause runtime errors.",
    severity: "error" as const,
  },
  {
    title: "Use of var instead of const/let",
    description:
      "The loop variable 'i' should use const in modern JavaScript for better scoping.",
    severity: "info" as const,
  },
];

const diffLines = [
  {
    type: "context" as const,
    content: "function calculateTotal(items) {",
    lineNumber: 1,
  },
  { type: "context" as const, content: "  let total = 0;", lineNumber: 2 },
  {
    type: "removed" as const,
    content: "  for (let i = 0; i < items.length; i++) {",
    lineNumber: 3,
  },
  {
    type: "removed" as const,
    content: "    total += items[i].price;",
    lineNumber: 4,
  },
  { type: "removed" as const, content: "  }", lineNumber: 5 },
  {
    type: "added" as const,
    content: "  return items.reduce((sum, item) => sum + item.price, 0);",
    lineNumber: 3,
  },
  { type: "context" as const, content: "}", lineNumber: 4 },
];

export default async function RoastResultPage({
  params,
}: RoastResultPageProps) {
  await params;

  return (
    <main className="flex flex-col gap-10 px-20 py-10">
      {/* Score Hero */}
      <div className="flex items-center gap-12">
        {/* Score Ring */}
        <ScoreRing score={3.5} />

        {/* Roast Summary */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Badge */}
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent-red" />
            <span className="font-mono text-sm font-medium text-accent-red">
              verdict: needs_serious_help
            </span>
          </div>

          {/* Quote */}
          <p className="font-mono text-xl text-text-primary leading-relaxed">
            "this code looks like it was written during a power outage... in
            2005."
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-text-tertiary">
              lang: javascript
            </span>
            <span className="font-mono text-xs text-text-tertiary">·</span>
            <span className="font-mono text-xs text-text-tertiary">
              7 lines
            </span>
          </div>

          {/* Share */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border border-border-primary hover:bg-bg-surface transition-colors"
            >
              <span className="font-mono text-xs text-text-secondary">
                $ share_roast
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
        <CodeBlock code={staticCode} lang="javascript" />
      </div>
      <div className="h-px bg-border-primary" />
      <div className="flex flex-col gap-6">
        <h2 className="flex items-center gap-2 font-mono text-sm font-bold">
          <span className="text-accent-green">{"//"}</span>
          <span className="text-text-primary">detailed_analysis</span>
        </h2>
        <div className="grid grid-cols-2 gap-5">
          {issues.map((issue) => (
            <IssueCard
              key={issue.title}
              title={issue.title}
              description={issue.description}
              severity={issue.severity}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-border-primary" />
      <div className="flex flex-col gap-6">
        <h2 className="flex items-center gap-2 font-mono text-sm font-bold">
          <span className="text-accent-green">{"//"}</span>
          <span className="text-text-primary">suggested_fix</span>
        </h2>
        <DiffBlock
          filename="your_code.js → improved_code.js"
          lines={diffLines}
        />
      </div>

      <Link
        href="/"
        className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        {"< back to home"}
      </Link>
    </main>
  );
}
