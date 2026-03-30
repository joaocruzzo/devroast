# tRPC Query Patterns & Data Fetching Guide

## Architecture Overview

The application uses **tRPC** for type-safe API queries with the following setup:

```
┌─────────────────────────────────────────────────────────────┐
│  Pages (Server & Client Components)                         │
├─────────────────────────────────────────────────────────────┤
│  - Server: Direct DB queries via tRPC server module         │
│  - Client: React Query + tRPC client via httpBatchLink      │
├─────────────────────────────────────────────────────────────┤
│  tRPC Router (src/trpc/router.ts)                           │
│  ├── roast.getStats()                                       │
│  ├── roast.getLeaderboard()                                 │
│  ├── roast.getSubmission()                                  │
│  └── roast.create() [mutation]                              │
├─────────────────────────────────────────────────────────────┤
│  API Route Handler (app/api/trpc/[trpc]/route.ts)           │
├─────────────────────────────────────────────────────────────┤
│  Database Queries (src/db/queries/)                         │
│  ├── leaderboard.ts                                         │
│  ├── submissions.ts                                         │
│  ├── analyses.ts                                            │
│  └── issues.ts                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Current tRPC Query Patterns in Server Components

### Pattern 1: Direct Server Query with Manual QueryOptions (home-stats.tsx)

```tsx
// src/app/home-stats.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@/trpc/client";

export function HomeStats() {
  // Client component calling tRPC via React Query
  const { data } = useQuery(queryOptions.roast.getStats());

  return (
    <div className="flex items-center gap-6 justify-center pt-8">
      <span className="font-mono text-xs text-text-tertiary">
        <NumberFlow value={data?.totalRoasts ?? 0} />
        codes roasted
      </span>
    </div>
  );
}
```

**How it works:**
1. `queryOptions.roast.getStats()` returns a React Query QueryOption object
2. `queryKey: ["roast", "getStats"]` - unique cache key
3. `queryFn` - calls `trpcClient.roast.getStats.query()` via HTTP
4. Component fetches data on mount (client-side)

**Location:** `src/trpc/client.ts` (lines 30-36)

```tsx
export const queryOptions = {
  roast: {
    getStats: () => ({
      queryKey: ["roast", "getStats"],
      queryFn: () => trpcClient.roast.getStats.query(),
    }),
  },
};
```

### Pattern 2: HydrateClient Wrapper (home page)

```tsx
// src/app/page.tsx
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function HomePage() {
  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section>...</section>
      
      {/* Client component wrapped with HydrateClient */}
      <HydrateClient>
        <HomeStats />
      </HydrateClient>
    </main>
  );
}
```

**Current HydrateClient implementation:** (src/trpc/server.ts, lines 25-27)

```tsx
export function HydrateClient({ children }: { children: React.ReactNode }) {
  return children;  // Currently just renders children (no hydration)
}
```

**Note:** HydrateClient is a placeholder for future hydration with pre-fetched data. Currently it just renders children without special hydration logic.

### Pattern 3: Client Component with tRPC useQuery Hook (leaderboard page)

```tsx
// src/app/leaderboard/page.tsx
"use client";

import { trpc } from "@/trpc/client";

function LeaderboardContent() {
  const [page, setPage] = useState(0);
  const limit = 5;
  const offset = page * limit;

  // Using tRPC React Query hook directly
  const { data: entries, isLoading, error } = trpc.roast.getLeaderboard.useQuery({
    limit,
    offset,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-5">
      {entries?.map((entry) => (
        <div key={entry.id}>
          {/* Render entry */}
        </div>
      ))}
    </div>
  );
}
```

**Key points:**
- Uses `trpc.roast.getLeaderboard.useQuery()` - the tRPC React hook
- Automatically handles loading, error, and caching via React Query
- Pagination with state management
- Works only in client components

---

## 2. How getLeaderboard Query Works

### tRPC Route Definition

**File:** `src/trpc/routers/roast.ts` (lines 26-36)

```tsx
export const roastRouter = router({
  getLeaderboard: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(5),
        offset: z.number().int().min(0).default(0),
      }),
    )
    .query(async ({ input }) => {
      const entries = await getTopSubmissions(input.limit, input.offset);
      return entries;
    }),
});
```

**Key features:**
- `publicProcedure` - no authentication required
- Zod schema validation - limit (1-100), offset (0+)
- Calls `getTopSubmissions()` database function
- Returns array of `LeaderboardEntry[]`

### Database Query Implementation

**File:** `src/db/queries/leaderboard.ts` (lines 30-43)

```tsx
export interface LeaderboardEntry {
  id: string;
  code: string;
  language: string;
  score: number;
  createdAt: Date;
}

export async function getTopSubmissions(
  limit = 10,
  offset = 0,
): Promise<LeaderboardEntry[]> {
  const result = await db.execute(sql`
    SELECT s.id, s.code, s.language, a.score, a.created_at as "createdAt"
    FROM submissions s
    JOIN analyses a ON a.submission_id = s.id
    ORDER BY a.score DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `);
  return result.rows as unknown as LeaderboardEntry[];
}
```

**Query flow:**
1. Joins submissions with analyses (to get scores)
2. Orders by score descending (worst code first)
3. Applies LIMIT and OFFSET for pagination
4. Returns typed LeaderboardEntry array

---

## 3. Current Prefetch Pattern and HydrateClient Setup

### Prefetch Implementation

**File:** `src/trpc/server.ts` (lines 3-5)

```tsx
export async function prefetch(promise: Promise<any>) {
  await promise;
}
```

**Current status:** This is a placeholder function that just awaits a promise. Not actively used.

### HydrateClient Implementation

**File:** `src/trpc/server.ts` (lines 25-27)

```tsx
export function HydrateClient({ children }: { children: React.ReactNode }) {
  return children;
}
```

**Current status:** This is a wrapper component that renders children without hydration. Designed for future integration with server-side prefetched data.

### What Prefetching Could Look Like (Future Implementation)

To implement real prefetching with React Query hydration:

```tsx
// Future pattern:
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export async function HydrateClient({ 
  children,
  prefetchQueries = []
}: { 
  children: React.ReactNode;
  prefetchQueries?: Array<{ queryKey: string[]; queryFn: () => Promise<any> }>;
}) {
  const queryClient = new QueryClient();

  // Prefetch data server-side
  await Promise.all(
    prefetchQueries.map(({ queryKey, queryFn }) =>
      queryClient.prefetchQuery({ queryKey, queryFn })
    )
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
```

---

## 4. Data Flow: Server to Client Component with Pre-rendered HTML

### Current Flow (Client-Side Query)

```
User visits page
        ↓
[Server] renders page HTML (no data)
        ↓
[Client] receives HTML with hydration boundary
        ↓
[Client] React Query fetches data via tRPC
        ↓
[Client] renders with received data
```

**Example in home page:**

```tsx
// src/app/page.tsx
export default async function HomePage() {
  // Server-side: no data fetching, just static markup
  return (
    <main>
      <HydrateClient>
        <HomeStats />  {/* Will fetch client-side */}
      </HydrateClient>
    </main>
  );
}
```

### How Props Flow from Server to Client Component

**Pattern 1: Dire
