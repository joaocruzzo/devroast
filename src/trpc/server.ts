import { getLeaderboard, getStats } from "@/db/queries/leaderboard";

export async function prefetch(promise: Promise<any>) {
  await promise;
}

export const trpc = {
  roast: {
    getStats: {
      queryOptions: async () => {
        const stats = await getStats();
        return {
          queryKey: ["roast", "getStats"],
          queryFn: async () => ({
            totalRoasts: stats.totalSubmissions,
            avgScore: stats.averageScore,
          }),
        };
      },
    },
  },
};

export function HydrateClient({ children }: { children: React.ReactNode }) {
  return children;
}
