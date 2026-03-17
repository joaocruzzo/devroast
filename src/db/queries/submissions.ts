import { sql } from "drizzle-orm";
import { db } from "../index";
import { type NewSubmission, type Submission, submissions } from "../schema";

export async function insertSubmission(data: NewSubmission) {
  const [row] = await db.insert(submissions).values(data).returning();
  return row as Submission;
}

export async function getSubmissionById(id: string) {
  const result = await db.execute<Submission>(
    sql`SELECT * FROM submissions WHERE id = ${id}`,
  );
  return result.rows[0];
}
