import { pgTable, uuid, text, integer, timestamp, real, boolean, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const language = pgEnum("language", ['javascript', 'typescript', 'python', 'rust', 'go', 'java', 'csharp', 'cpp', 'sql', 'html', 'css', 'json', 'yaml', 'markdown', 'bash', 'other'])
export const severityLevel = pgEnum("severity_level", ['critical', 'warning', 'good'])


export const issues = pgTable("issues", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	analysisId: uuid("analysis_id").notNull(),
	severity: severityLevel().notNull(),
	category: text().notNull(),
	message: text().notNull(),
	lineStart: integer("line_start"),
	lineEnd: integer("line_end"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const analyses = pgTable("analyses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	submissionId: uuid("submission_id").notNull(),
	score: real().notNull(),
	overallFeedback: text("overall_feedback").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const submissions = pgTable("submissions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: text().notNull(),
	language: language().notNull(),
	roastMode: boolean("roast_mode").default(true).notNull(),
	ipHash: text("ip_hash"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const suggestedFixes = pgTable("suggested_fixes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	issueId: uuid("issue_id").notNull(),
	originalCode: text("original_code").notNull(),
	fullCode: text("full_code").notNull(),
	explanation: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	diffJson: text("diff_json").notNull(),
});
