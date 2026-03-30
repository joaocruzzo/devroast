import { HomeStatsWithDelay } from "@/components/ui/home-stats-with-delay";
import { getStats } from "@/db/queries/leaderboard";

export async function HomeStats() {
  const stats = await getStats();

  return (
    <HomeStatsWithDelay
      totalSubmissions={stats.totalSubmissions}
      averageScore={stats.averageScore}
    />
  );
}
