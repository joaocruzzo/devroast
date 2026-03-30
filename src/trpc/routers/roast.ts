import { z } from "zod";
import { insertAnalysis, type NewAnalysis } from "@/db/queries/analyses";
import { insertIssue, type NewIssue } from "@/db/queries/issues";
import {
  getStats,
  getSubmissionWithAnalysis,
  getTopSubmissions,
} from "@/db/queries/leaderboard";
import { insertSubmission, type NewSubmission } from "@/db/queries/submissions";
import {
  insertSuggestedFix,
  type NewSuggestedFix,
} from "@/db/queries/suggested-fixes";
import { analyzeCode } from "@/lib/ai";
import { publicProcedure, router } from "@/trpc/init";

export const roastRouter = router({
  getStats: publicProcedure.query(async () => {
    const stats = await getStats();
    return {
      totalRoasts: stats.totalSubmissions,
      avgScore: stats.averageScore,
    };
  }),

  getLeaderboard: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(5),
        offset: z.number().int().min(0).default(0),
      }),
    )
    .query(async ({ input }) => {
      const entries = await getTopSubmissions(input.limit, input.offset);
      return entries;
    }),

  getSubmission: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const submission = await getSubmissionWithAnalysis(input.id);
      if (!submission) {
        throw new Error("Submission not found");
      }
      return submission;
    }),

  create: publicProcedure
    .input(
      z.object({
        code: z.string().min(10).max(1000),
        language: z.enum([
          "javascript",
          "typescript",
          "python",
          "rust",
          "go",
          "java",
          "csharp",
          "cpp",
          "sql",
          "html",
          "css",
          "json",
          "yaml",
          "markdown",
          "bash",
          "other",
        ]),
        roastMode: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input }) => {
      // 1. Save submission
      const submission = await insertSubmission({
        code: input.code,
        language: input.language as never,
        roastMode: input.roastMode,
      } as NewSubmission);

      try {
        // 2. Analyze code with AI
        const analysis = await analyzeCode({
          code: input.code,
          language: input.language,
          roastMode: input.roastMode,
        });

        // 3. Save analysis
        const savedAnalysis = await insertAnalysis({
          submissionId: submission.id,
          score: analysis.score,
          overallFeedback: analysis.overallFeedback,
          roastQuote: analysis.roastQuote,
        } as NewAnalysis);

        // 4. Save issues
        const savedIssues = await Promise.all(
          analysis.issues.map((issue) =>
            insertIssue({
              analysisId: savedAnalysis.id,
              severity: issue.severity,
              category: issue.category,
              message: issue.message,
              lineStart: issue.lineStart,
              lineEnd: issue.lineEnd,
            } as NewIssue),
          ),
        );

        // 5. Save suggested fixes (one per issue with fixes)
        if (analysis.suggestedFix) {
          for (const issue of savedIssues) {
            await insertSuggestedFix({
              issueId: issue.id,
              originalCode: input.code,
              fullCode: analysis.suggestedFix,
              diffJson: "",
              explanation: `Suggested improvement for: ${issue.message}`,
            } as NewSuggestedFix);
          }
        }

        return {
          id: submission.id,
          score: analysis.score,
          totalIssues: analysis.issues.length,
        };
      } catch (error) {
        console.error("Analysis failed:", error);
        throw new Error("Failed to analyze code");
      }
    }),
});
