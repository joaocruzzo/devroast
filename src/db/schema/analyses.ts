import { pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const analyses = pgTable("analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id").notNull(),
  score: real("score").notNull(),
  overallFeedback: text("overall_feedback").notNull(),
  roastQuote: text("roast_quote"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Analysis = typeof analyses.$inferSelect;
export type NewAnalysis = typeof analyses.$inferInsert;
