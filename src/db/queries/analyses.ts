import { sql } from "drizzle-orm";
import { db } from "../index";
import { type Analysis, analyses, type NewAnalysis } from "../schema";

export async function insertAnalysis(data: NewAnalysis) {
  const [row] = await db.insert(analyses).values(data).returning();
  return row as Analysis;
}

export async function getAnalysisBySubmissionId(submissionId: string) {
  const result = await db.execute<Analysis>(
    sql`SELECT * FROM analyses WHERE submission_id = ${submissionId} ORDER BY created_at DESC LIMIT 1`,
  );
  return result.rows[0];
}

export async function getAnalysisById(id: string) {
  const result = await db.execute<Analysis>(
    sql`SELECT * FROM analyses WHERE id = ${id}`,
  );
  return result.rows[0];
}
