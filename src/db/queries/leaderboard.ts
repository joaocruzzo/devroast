import { sql } from "drizzle-orm";
import { db } from "../index";

export interface LeaderboardEntry {
  id: string;
  code: string;
  language: string;
  score: number;
  createdAt: Date;
}

export interface Stats {
  totalSubmissions: number;
  averageScore: number;
}

export async function getTopSubmissions(
  limit = 10,
): Promise<LeaderboardEntry[]> {
  const result = await db.execute(sql`
    SELECT s.id, s.code, s.language, a.score, a.created_at as "createdAt"
    FROM submissions s
    JOIN analyses a ON a.submission_id = s.id
    ORDER BY a.score ASC
    LIMIT ${limit}
  `);
  return result.rows as unknown as LeaderboardEntry[];
}

export async function getStats(): Promise<Stats> {
  const result = await db.execute(sql`
    SELECT 
      COUNT(*) as "totalSubmissions",
      AVG(a.score) as "averageScore"
    FROM submissions s
    JOIN analyses a ON a.submission_id = s.id
  `);
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return {
    totalSubmissions: Number(row?.totalSubmissions) || 0,
    averageScore: Number(row?.averageScore) || 0,
  };
}
