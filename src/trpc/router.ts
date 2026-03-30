import { router } from "@/trpc/init";
import { roastRouter } from "@/trpc/routers/roast";

export const appRouter = router({
  roast: roastRouter,
});

export type AppRouter = typeof appRouter;
