# Especificação: tRPC + TanStack React Query

## Decisões

- **tRPC**: v11 com TanStack React Query
- **Validação**: Zod
- **Adapter**: Fetch (Next.js App Router)
- **Context**: `createTRPCContext` para providers
- **Server Components**: `createTRPCOptionsProxy` + `createCallerFactory`

## Estrutura de Arquivos

```
src/trpc/
├── init.ts              # initTRPC, createTRPCContext, createTRPCRouter
├── query-client.ts      # makeQueryClient factory
├── client.tsx           # TRPCProvider (Client Component)
├── server.tsx           # trpc proxy, caller, helpers (Server Only)
└── routers/
    └── _app.ts          # AppRouter definition
```

## API Route

```ts
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
```

## Stack Técnica

### Server Components
- `trpc.proxy.queryOptions()` para prefetch
- `HydrationBoundary` + `dehydrate` para streaming
- `caller` para queries diretas em Server Components

### Client Components
- `useTRPC()` hook para acessar o client
- `useQuery` / `useMutation` com `queryOptions()` / `mutationOptions()`

### Providers
```tsx
// layout.tsx
<TRPCReactProvider>
  {children}
</TRPCReactProvider>
```

## To-Do

- [ ] Instalar deps: `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`, `@tanstack/react-query`, `zod`, `client-only`, `server-only`
- [ ] Criar `src/trpc/init.ts`
- [ ] Criar `src/trpc/query-client.ts`
- [ ] Criar `src/trpc/client.tsx` (TRPCProvider)
- [ ] Criar `src/trpc/server.tsx` (trpc proxy + caller)
- [ ] Criar `app/api/trpc/[trpc]/route.ts`
- [ ] Criar `src/trpc/routers/_app.ts` (AppRouter)
- [ ] Integrar `TRPCReactProvider` no layout
- [ ] Migrar queries existentes (submissions, leaderboard, analyses)
