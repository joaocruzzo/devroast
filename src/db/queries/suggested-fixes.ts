import { sql } from "drizzle-orm";
import { db } from "../index";
import {
  type NewSuggestedFix,
  type SuggestedFix,
  suggestedFixes,
} from "../schema";

export async function insertSuggestedFix(data: NewSuggestedFix) {
  const [row] = await db.insert(suggestedFixes).values(data).returning();
  return row as SuggestedFix;
}

export async function getSuggestedFixesByIssueId(issueId: string) {
  const result = await db.execute<SuggestedFix>(
    sql`SELECT * FROM suggested_fixes WHERE issue_id = ${issueId} ORDER BY created_at`,
  );
  return result.rows;
}
