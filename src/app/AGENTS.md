# Padrões de Páginas

## Estrutura de Diretórios

```
src/app/
├── page.tsx              # Home
├── layout.tsx           # Layout raiz
├── leaderboard/
│   └── page.tsx         # Página do leaderboard
├── roast/
│   └── [id]/
│       └── page.tsx     # Página de resultado (dinâmica)
└── components/
    └── page.tsx         # Biblioteca de componentes
```

## Páginas Estáticas (SSR)

Use **Server Components** (funções async) para páginas com dados estáticos ou que não requerem interatividade do usuário.

```tsx
export default async function LeaderboardPage() {
  return (
    <main className="flex flex-col gap-10 px-20 py-10">
      ...
    </main>
  );
}
```

## Queries Paralelas com Promise.all

Em Server Components, use `Promise.all` para executar múltiplas queries/操作 em paralelo em vez de sequential awaits.

```tsx
// ✅ Correto - executa em paralelo
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments(),
]);

// ❌ Incorreto - executa sequencialmente
const users = await fetchUsers();
const posts = await fetchPosts();
const comments = await fetchComments();
```

### Exemplo com Shiki (Syntax Highlighting)

```tsx
async function LeaderboardTable({ entries }) {
  const entriesWithHighlights = await Promise.all(
    entries.map(async (entry) => {
      const highlightedLines = await Promise.all(
        entry.lines.map(async (line) => {
          const html = await codeToHtml(line, { lang, theme: "vesper" });
          return html;
        }),
      );
      return { ...entry, highlightedLines };
    }),
  );
  // ...
}
```

## Suspense API

Para loading states, use `<Suspense>` com fallback:

```tsx
import { Suspense } from "react";
import { SomeComponent } from "./some-component";
import { SomeSkeleton } from "@/components/ui/some-skeleton";

function DataLoader() {
  return <SomeComponent />;
}

export default function Page() {
  return (
    <Suspense fallback={<SomeSkeleton />}>
      <DataLoader />
    </Suspense>
  );
}
```

## Páginas Dinâmicas

Para rotas com parâmetros (ex: `/roast/[id]`):

```tsx
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoastResultPage({ params }: PageProps) {
  await params;
  return <main>...</main>;
}
```

## Layout Principal

O `layout.tsx` contém a Navbar global e define o container principal:

```tsx
<main className="mx-auto px-10">{children}</main>
```

**Nota**: Não definir `max-w-*` no `<main>` - cada página define sua própria largura.

## Estrutura Comum de Página

```tsx
<main className="flex flex-col gap-10 px-20 py-10">
  {/* Hero Section */}
  <div className="flex flex-col gap-4">
    <h1 className="flex items-center gap-3 font-mono text-[28px] font-bold">
      <span className="text-accent-green">{">"}</span>
      <span className="text-text-primary">page_title</span>
    </h1>
    <p className="font-mono text-sm text-text-secondary">
      {"// description"}
    </p>
  </div>

  {/* Content Sections */}
  <div>...</div>

  {/* Divider */}
  <div className="h-px bg-border-primary" />

  {/* More Content */}
  <div>...</div>

  {/* Back Link */}
  <Link href="/">{"< back to home"}</Link>
</main>
```

## Páginas Implementadas

### Home (`/`)
- Hero com título e editor
- Editor: `w-[780px]` (fixo)
- Leaderboard preview: `w-[960px]` (fixo)

### Leaderboard (`/leaderboard`)
- Título: `> shame_leaderboard`
- Lista de entries com CodeBlock
- Syntax highlighting via Shiki

### Roast Result (`/roast/[id]`)
- Score Ring com componente reutilizável
- Badge de verdict
- CodeBlock com código submetido
- Grid de IssueCards
- DiffBlock com suggested fix

## Regras de Largura

| Página/Seção | Largura |
|--------------|---------|
| Home Editor | `780px` |
| Home Leaderboard Preview | `960px` |
| Leaderboard | `960px` |
| Roast Result | `960px` |

Use larguras fixas (ex: `w-[960px]`) quando especificado no design, não use `max-w-*`.
