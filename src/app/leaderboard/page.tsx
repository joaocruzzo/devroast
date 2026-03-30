import Link from "next/link";
import { Suspense } from "react";
import { LeaderboardClient } from "@/components/leaderboard-client";

export default async function LeaderboardPage() {
  return (
    <main className="flex flex-col gap-10 px-20 py-10">
      <div className="flex flex-col gap-4">
        <h1 className="flex items-center gap-3 font-mono text-[28px] font-bold">
          <span className="text-accent-green">{">"}</span>
          <span className="text-text-primary">shame_leaderboard</span>
        </h1>
        <p className="font-mono text-sm text-text-secondary">
          {"// the most roasted code on the internet"}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-10 font-mono text-sm text-text-tertiary">
            Loading...
          </div>
        }
      >
        <LeaderboardClient />
      </Suspense>

      <Link
        href="/"
        className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        {"< back to home"}
      </Link>
    </main>
  );
}
