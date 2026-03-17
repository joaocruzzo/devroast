import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { severityLevelEnum } from "./enums";

export const issues = pgTable("issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  analysisId: uuid("analysis_id").notNull(),
  severity: severityLevelEnum("severity").notNull(),
  category: text("category").notNull(),
  message: text("message").notNull(),
  lineStart: integer("line_start"),
  lineEnd: integer("line_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
