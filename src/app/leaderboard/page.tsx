import Link from "next/link";
import { type BundledLanguage, codeToHtml } from "shiki";
import {
  LeaderboardRowCode,
  LeaderboardRowRank,
  LeaderboardRowScore,
} from "@/components/ui/leaderboard-row";

const languageMap: Record<string, BundledLanguage> = {
  javascript: "javascript",
  typescript: "typescript",
  sql: "sql",
  python: "python",
  rust: "rust",
  go: "go",
};

const leaderboardEntries = [
  {
    rank: 1,
    score: 1.2,
    lines: [
      "eval(prompt('enter code'))",
      "document.write(response)",
      "// trust the user lol",
    ],
    language: "javascript",
  },
  {
    rank: 2,
    score: 1.8,
    lines: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ],
    language: "typescript",
  },
  {
    rank: 3,
    score: 2.1,
    lines: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
    language: "sql",
  },
  {
    rank: 4,
    score: 2.5,
    lines: ["function doStuff() {", "  // TODO: implement", "}"],
    language: "javascript",
  },
  {
    rank: 5,
    score: 3.1,
    lines: [
      "try {",
      "  return JSON.parse(data);",
      "} catch {",
      "  return {}; // lol",
      "}",
    ],
    language: "javascript",
  },
];

async function HighlightedCode({ code, lang }: { code: string; lang: string }) {
  const html = await codeToHtml(code, {
    lang: languageMap[lang] || "javascript",
    theme: "vesper",
  });

  return (
    <div
      className="font-mono text-xs leading-tight [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki generates trusted HTML from code strings server-side
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default async function LeaderboardPage() {
  return (
    <main className="flex flex-col gap-10 px-20 py-10">
      {/* Hero Section */}
      <div className="flex flex-col gap-4">
        <h1 className="flex items-center gap-3 font-mono text-[28px] font-bold">
          <span className="text-accent-green">{">"}</span>
          <span className="text-text-primary">shame_leaderboard</span>
        </h1>
        <p className="font-mono text-sm text-text-secondary">
          {"// the most roasted code on the internet"}
        </p>
        <div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
          <span>2,847 submissions</span>
          <span>·</span>
          <span>avg score: 4.2/10</span>
        </div>
      </div>

      {/* Leaderboard Entries */}
      <div className="flex flex-col gap-5">
        {leaderboardEntries.map((entry) => (
          <div
            key={entry.rank}
            className="flex flex-col border border-border-primary"
          >
            {/* Meta Row */}
            <div className="flex items-center justify-between h-12 px-5 bg-bg-surface border-b border-border-primary">
              <div className="flex items-center gap-4">
                <LeaderboardRowRank className="text-accent-amber">
                  <span>#</span>
                  <span> </span>
                  <span>{entry.rank}</span>
                </LeaderboardRowRank>
                <span className="font-mono text-xs text-text-tertiary">
                  score:
                </span>
                <LeaderboardRowScore value={entry.score} />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-text-secondary">
                  {entry.language}
                </span>
                <span className="font-mono text-xs text-text-tertiary">
                  {entry.lines.length} lines
                </span>
              </div>
            </div>

            {/* Code Block */}
            <div className="flex h-[120px] overflow-hidden bg-bg-input">
              {/* Line Numbers */}
              <div className="flex flex-col items-end gap-1.5 w-10 px-2.5 py-3 bg-bg-surface border-r border-border-primary">
                {entry.lines.map((_, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs text-text-tertiary"
                  >
                    {i + 1}
                  </span>
                ))}
              </div>

              {/* Code Content */}
              <div className="flex-1 py-3.5 pl-4 overflow-hidden">
                <LeaderboardRowCode className="gap-1.5">
                  {entry.lines.map((line) => (
                    <HighlightedCode
                      key={line}
                      code={line}
                      lang={entry.language}
                    />
                  ))}
                </LeaderboardRowCode>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Back Link */}
      <Link
        href="/"
        className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        {"< back to home"}
      </Link>
    </main>
  );
}
