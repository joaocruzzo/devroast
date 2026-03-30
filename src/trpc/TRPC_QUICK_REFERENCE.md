# tRPC Quick Reference & Cheat Sheet

## 1. Current Query Patterns in Use

### Client-Side Query Pattern (Most Common)

```typescript
// Client Component - src/app/home-stats.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@/trpc/client";

export function HomeStats() {
  const { data, isLoading } = useQuery(queryOptions.roast.getStats());
  
  return <div>{data?.totalRoasts} roasts</div>;
}
```

### tRPC Hook Pattern (Alternative)

```typescript
// Client Component - src/app/leaderboard/page.tsx
"use client";

import { trpc } from "@/trpc/client";

function LeaderboardContent() {
  const { data, isLoading } = trpc.roast.getLeaderboard.useQuery({
    limit: 5,
    offset: 0,
  });
  
  return <div>{data?.map(...)}</div>;
}
```

---

## 2. getLeaderboard Query Structure

### Router Definition (src/trpc/routers/roast.ts)
```
publicProcedure
  ├─ input: { limit: 1-100, offset: 0+ }
  ├─ query: (input) => getTopSubmissions(limit, offset)
  └─ returns: LeaderboardEntry[]
```

### Database Query (src/db/queries/leaderboard.ts)
```sql
SELECT s.id, s.code, s.language, a.score, a.created_at
FROM submissions s
JOIN analyses a ON a.submission_id = s.id
ORDER BY a.score DESC
LIMIT ${limit}
OFFSET ${offset}
```

### Return Type
```typescript
interface LeaderboardEntry {
  id: string;
  code: string;
  language: string;
  score: number;
  createdAt: Date;
}
```

---

## 3. Prefetch & Hydration Setup

### Current Implementation (No-op)

```typescript
// src/trpc/server.ts
export function HydrateClient({ children }) {
  return children;  // Currently does nothing
}

export async function prefetch(promise) {
  await promise;  // Just awaits
}
```

### Recommended Future Pattern

```typescript
// Server Component - src/app/page.tsx
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getStats } from "@/db/queries/leaderboard";

export default async function HomePage() {
  const queryClient = new QueryClient();
  
  // Prefetch on server
  await queryClient.prefetchQuery({
    queryKey: ["roast", "getStats"],
    queryFn: () => getStats(),  // Direct DB call
  });
  
  // Hydrate client with prefetched data
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeStats />
    </HydrationBoundary>
  );
}

// Client Component - src/app/home-stats.tsx
"use client";

export function HomeStats() {
  // Gets data from hydrated cache, not HTTP!
  const { data } = useQuery(queryOptions.roast.getStats());
  return <div>{data?.totalRoasts}</div>;
}
```

---

## 4. Data Flow Diagrams

### Current Flow (Client-Side Fetch)
```
User Request
    ↓
Server renders HTML (no data)
    ↓
Browser renders empty page
    ↓
Client fetches via HTTP to /api/trpc
    ↓
tRPC queries database
    ↓
Response sent to client
    ↓
Client renders with data
    ↓
Page fully interactive
```

### Recommended Flow (Server-Side Prefetch)
```
User Request
    ↓
Server queries database directly
    ↓
Server caches in QueryClient
    ↓
Server dehydrates cache
    ↓
Server renders HTML + hydration state
    ↓
Browser renders with data
    ↓
Client hydrates cache from HTML
    ↓
Page instantly interactive (no fetch needed!)
```

---

## 5. From Server to Client: Data Passing Methods

### Method 1: Direct Props
```typescript
// Server Component (fetches data)
async function Page() {
  const data = await getStats();
  return <ClientComponent data={data} />;
}

// Client Component (receives props)
"use client";
function ClientComponent({ data }) {
  return <div>{data.value}</div>;
}
```

### Method 2: Query Cache Hydration (RECOMMENDED)
```typescript
// Server Component (prefetches)
async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["roast", "getStats"],
    queryFn: () => getStats(),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientComponent />  {/* No props needed */}
    </HydrationBoundary>
  );
}

// Client Component (queries cache)
"use client";
function ClientComponent() {
  const { data } = useQuery(queryOptions.roast.getStats());
  return <div>{data.value}</div>;
}
```

---

## 6. Pre-rendered HTML with Data

### Without Prefetch (Current)
```html
<body>
  <main>
    <div data-react-root><!-- Empty until client fetches --></div>
  </main>
</body>
```

### With Prefetch (Recommended)
```html
<body>
  <main>
    <div data-react-root>
      <div>1,234 codes roasted</div>
    </div>
    <!-- Hidden hydration state -->
    <script id="__REACT_QUERY_STATE__">
      {
        "roast": {
          "getStats": {
            "state": { "data": { "totalRoasts": 1234 } }
          }
        }
      }
    </script>
  </main>
</body>
```

---

## 7. Key Files Map

```
tRPC Setup
├── src/trpc/init.ts                 [tRPC initialization]
├── src/trpc/router.ts              [Main router definition]
├── src/trpc/client.ts              [Client-side setup + queryOptions]
├── src/trpc/server.ts              [Server utilities]
├── src/trpc/react-query.ts         [React Query config]
└── src/trpc/routers/roast.ts       [Roast procedures]

API Layer
└── app/api/trpc/[trpc]/route.ts    [HTTP handler]

Database Layer
└── src/db/queries/leaderboard.ts   [DB functions]

UI Components
├── src/app/home-stats.tsx           [Client: Queries stats]
├── src/app/leaderboard/page.tsx     [Client: Paginated list]
└── src/app/roast/[id]/page.tsx     [Client: Result page]
```

---

## 8. Type Safety Examples

### Typed Query Options
```typescript
// Define in client
export const queryOptions = {
  roast: {
    getStats: () => ({
      queryKey: ["roast", "getStats"],
      queryFn: () => trpcClient.roast.getStats.query(),
      // return type inferred: { totalRoasts: number; avgScore: number }
    }),
  },
};

// Use in component
const { data } = useQuery(queryOptions.roast.getStats());
// data type: { totalRoasts: number; avgScore: number } ✅ Fully typed
```

### Typed tRPC Hook
```typescript
// Hook automatically typed from router
const { data } = trpc.roast.getLeaderboard.useQuery({ limit: 5 });
// data type: LeaderboardEntry[] ✅ Fully typed
// error: TRPCClientErrorLike<AppRouter> ✅ Fully typed
```

---

## 9. Cache Configuration

### Stale Time (5 minutes)
```typescript
// src/trpc/react-query.ts
defaultOptions: {
  queries: {
    staleTime: 1000 * 60 * 5,  // 5 minutes
  },
}

// This means:
// - Data fetched at 10:00
// - Still considered "fresh" until 10:05
// - useQuery won't refetch if called between 10:00-10:05
// - After 10:05, data is "stale" and will refetch if component remounts
```

---

## 10. Common Patterns

### Pattern: Pagination
```typescript
"use client";

function LeaderboardContent() {
  const [page, setPage] = useState(0);
  
  // Query key changes with page → new fetch!
  const { data } = trpc.roast.getLeaderboard.useQuery({
    limit: 5,
    offset: page * 5,  // Changes when page changes
  });
  
  return (
    <div>
      {data?.map(...)}
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
```

### Pattern: Error Handling
```typescript
"use client";

function LeaderboardContent() {
  const { data, error, isLoading } = trpc.roast.getLeaderboard.useQuery({
    limit: 5,
    offset: 0,
  });
  
  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  
  return <List data={data} />;
}
```

### Pattern: Loading States
```typescript
"use client";

function LeaderboardContent() {
  const { data, isPending } = trpc.roast.getLeaderboard.useQuery({
    limit: 5,
    offset: 0,
  });
  
  return (
    <div>
      {isPending && <Skeleton />}
      {data && <List data={data} />}
    </div>
  );
}
```

---

## 11. tRPC + React Query Integration

### How They Work Together
```
tRPC (Type Safety)
  ├─ Defines procedures in router
  ├─ Validates inputs with Zod
  ├─ Provides TypeScript inference
  └─ Generates client hooks

React Query (Data Management)
  ├─ Manages cache
  ├─ Handles refetching
  ├─ Provides loading/error states
  └─ Optimizes network requests
```

#
