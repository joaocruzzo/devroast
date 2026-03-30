import { sql } from "drizzle-orm";
import { db } from "../index";
import type { Issue, SuggestedFix } from "../schema";

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

export interface SubmissionWithAnalysis {
  id: string;
  code: string;
  language: string;
  roastMode: boolean;
  score: number;
  overallFeedback: string;
  roastQuote: string | null;
  createdAt: Date;
  issues: Issue[];
  suggestedFixes: SuggestedFix[];
}

export async function getTopSubmissions(
  limit = 10,
  offset = 0,
): Promise<LeaderboardEntry[]> {
  const result = await db.execute(sql`
    SELECT s.id, s.code, s.language, a.score, a.created_at as "createdAt"
    FROM submissions s
    JOIN analyses a ON a.submission_id = s.id
    ORDER BY a.score ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `);
  return result.rows as unknown as LeaderboardEntry[];
}

export async function getLeaderboard(params: {
  limit?: number;
  offset?: number;
}): Promise<LeaderboardEntry[]> {
  return getTopSubmissions(params.limit, params.offset);
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

export async function getSubmissionWithAnalysis(
  id: string,
): Promise<SubmissionWithAnalysis | null> {
  const result = await db.execute(sql`
    SELECT 
      s.id,
      s.code,
      s.language,
      s.roast_mode as "roastMode",
      a.score,
      a.overall_feedback as "overallFeedback",
      a.roast_quote as "roastQuote",
      s.created_at as "createdAt"
    FROM submissions s
    JOIN analyses a ON a.submission_id = s.id
    WHERE s.id = ${id}
  `);

  const row = result.rows[0] as any;
  if (!row) return null;

  // Get issues - map snake_case to camelCase
  const issuesResult = await db.execute(
    sql`SELECT * FROM issues WHERE analysis_id = (
      SELECT id FROM analyses WHERE submission_id = ${id}
    ) ORDER BY created_at`,
  );

  const issues = issuesResult.rows.map((r: Record<string, unknown>) => ({
    id: r.id,
    analysisId: r.analysis_id,
    severity: r.severity,
    category: r.category,
    message: r.message,
    lineStart: r.line_start,
    lineEnd: r.line_end,
    createdAt: r.created_at,
  }));

  // Get suggested fixes - map snake_case to camelCase
  const fixesResult = await db.execute(
    sql`SELECT * FROM suggested_fixes WHERE issue_id IN (
      SELECT id FROM issues WHERE analysis_id = (
        SELECT id FROM analyses WHERE submission_id = ${id}
      )
    ) ORDER BY created_at`,
  );

  const suggestedFixes = fixesResult.rows.map((r: Record<string, unknown>) => ({
    id: r.id,
    issueId: r.issue_id,
    originalCode: r.original_code,
    fullCode: r.full_code,
    explanation: r.explanation,
    diffJson: r.diff_json,
    createdAt: r.created_at,
  }));

  return {
    ...row,
    issues,
    suggestedFixes,
  };
}
