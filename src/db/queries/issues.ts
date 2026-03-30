import { sql } from "drizzle-orm";
import { db } from "../index";
import { type Issue, issues, type NewIssue } from "../schema";

export type { Issue, NewIssue };

export async function insertIssue(data: NewIssue) {
  const [row] = await db.insert(issues).values(data).returning();
  return row as Issue;
}

export async function getIssuesByAnalysisId(analysisId: string) {
  const result = await db.execute<Issue>(
    sql`SELECT * FROM issues WHERE analysis_id = ${analysisId} ORDER BY created_at`,
  );
  return result.rows;
}
