import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";
import { getLeaderboard } from "@/db/queries/leaderboard";

const languageMap: Record<string, BundledLanguage> = {
  javascript: "javascript",
  typescript: "typescript",
  sql: "sql",
  python: "python",
  rust: "rust",
  go: "go",
};

interface ProcessedEntry {
  id: string;
  rank: number;
  score: number;
  language: string;
  totalLines: number;
  htmlLines: string[];
}

async function processCode(code: string, language: string): Promise<string[]> {
  const lines = code.split("\n");
  const htmlLines = await Promise.all(
    lines.map((line) =>
      codeToHtml(line, {
        lang: (languageMap[language] || "javascript") as BundledLanguage,
        theme: "vesper",
      }),
    ),
  );
  return htmlLines;
}

export interface LeaderboardServerProps {
  page?: number;
  limit?: number;
}

export async function LeaderboardServer({
  page = 0,
  limit = 5,
}: LeaderboardServerProps) {
  const offset = page * limit;
  const entries = await getLeaderboard({ limit: limit + 1, offset });

  const hasMore = entries.length > limit;
  const displayEntries = entries.slice(0, limit);

  const processedEntries: ProcessedEntry[] = await Promise.all(
    displayEntries.map(async (entry, idx) => {
      const htmlLines = await processCode(entry.code, entry.language);
      return {
        id: entry.id,
        rank: offset + idx + 1,
        score: entry.score,
        language: entry.language,
        totalLines: entry.code.split("\n").length,
        htmlLines,
      };
    }),
  );

  return {
    entries: processedEntries,
    hasMore,
  };
}

export type { ProcessedEntry };
