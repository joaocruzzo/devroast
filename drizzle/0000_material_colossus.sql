CREATE TYPE "public"."language" AS ENUM('javascript', 'typescript', 'python', 'rust', 'go', 'java', 'csharp', 'cpp', 'sql', 'html', 'css', 'json', 'yaml', 'markdown', 'bash', 'other');--> statement-breakpoint
CREATE TYPE "public"."severity_level" AS ENUM('critical', 'warning', 'good');--> statement-breakpoint
CREATE TABLE "analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"score" real NOT NULL,
	"overall_feedback" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"analysis_id" uuid NOT NULL,
	"severity" "severity_level" NOT NULL,
	"category" text NOT NULL,
	"message" text NOT NULL,
	"line_start" integer,
	"line_end" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"language" "language" NOT NULL,
	"roast_mode" boolean DEFAULT true NOT NULL,
	"ip_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suggested_fixes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"issue_id" uuid NOT NULL,
	"original_code" text NOT NULL,
	"fixed_code" text NOT NULL,
	"explanation" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
