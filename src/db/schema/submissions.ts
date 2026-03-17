import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { languageEnum } from "./enums";

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull(),
  language: languageEnum("language").notNull(),
  roastMode: boolean("roast_mode").notNull().default(true),
  ipHash: text("ip_hash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
