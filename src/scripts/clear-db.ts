import "dotenv/config";
import { db } from "@/db/index";
import { analyses, issues, submissions, suggestedFixes } from "@/db/schema";

async function clear() {
  console.log("Clearing database...");
  await db.delete(suggestedFixes);
  await db.delete(issues);
  await db.delete(analyses);
  await db.delete(submissions);
  console.log("✅ Database cleared!");
  process.exit(0);
}

clear().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
