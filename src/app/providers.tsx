"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/trpc/client";
import { getQueryClient } from "@/trpc/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
