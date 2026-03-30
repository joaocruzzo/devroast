ALTER TABLE "suggested_fixes" ADD COLUMN "full_code" text NOT NULL DEFAULT '';
ALTER TABLE "suggested_fixes" ADD COLUMN "diff_json" text NOT NULL DEFAULT '[]';
UPDATE "suggested_fixes" SET "full_code" = "fixed_code", "diff_json" = '[]';
ALTER TABLE "suggested_fixes" DROP COLUMN "fixed_code";
