import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const suggestedFixes = pgTable("suggested_fixes", {
  id: uuid("id").primaryKey().defaultRandom(),
  issueId: uuid("issue_id").notNull(),
  originalCode: text("original_code").notNull(),
  fullCode: text("full_code").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  diffJson: text("diff_json").notNull(),
});

export type SuggestedFix = typeof suggestedFixes.$inferSelect;
export type NewSuggestedFix = typeof suggestedFixes.$inferInsert;
