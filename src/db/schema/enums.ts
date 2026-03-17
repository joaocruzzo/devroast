import { pgEnum } from "drizzle-orm/pg-core";

export const languageEnum = pgEnum("language", [
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
]);

export const severityLevelEnum = pgEnum("severity_level", [
  "critical",
  "warning",
  "good",
]);

export type Language = (typeof languageEnum.enumValues)[number];
export type SeverityLevel = (typeof severityLevelEnum.enumValues)[number];
