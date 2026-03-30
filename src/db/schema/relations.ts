import { relations } from "drizzle-orm";
import { analyses } from "./analyses";
import { issues } from "./issues";
import { submissions } from "./submissions";
import { suggestedFixes } from "./suggested-fixes";

export const submissionsRelations = relations(submissions, ({ one }) => ({
  analysis: one(analyses, {
    fields: [submissions.id],
    references: [analyses.submissionId],
  }),
}));

export const analysesRelations = relations(analyses, ({ one, many }) => ({
  submission: one(submissions, {
    fields: [analyses.submissionId],
    references: [submissions.id],
  }),
  issues: many(issues),
}));

export const issuesRelations = relations(issues, ({ one, many }) => ({
  analysis: one(analyses, {
    fields: [issues.analysisId],
    references: [analyses.id],
  }),
  suggestedFixes: many(suggestedFixes),
}));

export const suggestedFixesRelations = relations(suggestedFixes, ({ one }) => ({
  issue: one(issues, {
    fields: [suggestedFixes.issueId],
    references: [issues.id],
  }),
}));
