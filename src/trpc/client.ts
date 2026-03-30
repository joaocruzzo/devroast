"use client";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/trpc/router";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${baseUrl}/api/trpc`,
    }),
  ],
});

// Create query options helper
export function createQueryOptions<T extends any[], R>(
  key: string[],
  fn: (...args: T) => Promise<R>,
) {
  return (...args: T) => ({
    queryKey: key,
    queryFn: () => fn(...args),
  });
}

export const queryOptions = {
  roast: {
    getStats: () => ({
      queryKey: ["roast", "getStats"],
      queryFn: () => trpcClient.roast.getStats.query(),
    }),
  },
};
