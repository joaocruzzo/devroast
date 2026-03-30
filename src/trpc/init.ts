import { initTRPC } from "@trpc/server";

export const t = initTRPC.context<object>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
