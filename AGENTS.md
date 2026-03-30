# DevRoast - Padrões de Desenvolvimento

## Tech Stack

- **Framework**: Next.js 16 + TypeScript + Turbopack
- **Estilização**: Tailwind CSS v4 (theme variables em `globals.css`)
- **Componentes UI**: Base UI (`@base-ui/react`)
- **Syntax Highlighting**: Shiki
- **Linting/Format**: Biome

## Scripts

```bash
npm run dev           # development
npm run build         # production build
npx biome check --write  # lint + format
```

## Estrutura de Páginas

### Páginas Estáticas (SSR)
Páginas com dados estáticos devem usar **Server Components** (async) para boa indexação SEO.

```tsx
// src/app/[route]/page.tsx
export default async function PageName() {
  // dados estáticos ou fetch server-side
  return <main>...</main>;
}
```

### Páginas com Estado
Páginas com interação do usuário usam **Client Components**.

```tsx
// src/app/[route]/page.tsx
"use client";

export default function PageName() {
  const [state, setState] = useState();
  return <main>...</main>;
}
```

## Padrões de Layout

### Larguras Fixas
Conforme especificado no design (Pencil):

| Elemento | Largura |
|----------|---------|
| Editor (home) | `780px` |
| Leaderboard | `960px` |
| Score Ring | `180px × 180px` |

### Estrutura de Página
- Hero Section com título e elementos principais
- Divisors: `<div className="h-px bg-border-primary" />`
- Seções com `gap-10` (main) e `gap-4` a `gap-6` (interno)
- Link de retorno: `<Link href="/">{"< back to home"}</Link>`

## Componentes UI (`src/components/ui/`)

Ver `src/components/ui/AGENTS.md` para padrões específicos.

### Componentes Server/Client

| Componente | Tipo | Motivo |
|------------|------|--------|
| `CodeBlock` | Server (async) | Shiki executa no servidor |
| `CodeEditor` | Client | Editável pelo usuário |
| `ScoreRing` | Client | Interatividade |
| `IssueCard` | Client | Composição |

### Composição

Componentes com partes internas usam padrão de composição:

```tsx
<ComponentRoot>
  <ComponentPart>...</ComponentPart>
</ComponentRoot>
```

Exemplos: `AnalysisCard*`, `LeaderboardRow*`, `IssueCard`

### Shiki

CodeBlock é **Server Component** (async). CodeEditor é **Client Component**.

## Roteamento

### Rotas Dinâmicas
Para rotas com parâmetros, use a estrutura de diretório:

```
src/app/roast/[id]/page.tsx  →  /roast/:id
```

```tsx
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  await params;
  // ...
}
```

## Tailwind

Usar theme variables, não valores arbitrários.

## Validação e Linting

Antes de cada commit ou PR:

```bash
npx biome check --write src/
npm run build
```

## Convenções de Nomenclatura

- **Arquivos**: kebab-case (`score-ring.tsx`, `home-editor.tsx`)
- **Componentes**: PascalCase (`ScoreRing`, `HomeEditor`)
- **Variáveis e funções**: camelCase
- **Constantes**: SCREAMING_SNAKE_CASE para valores mágicos

```tsx
const MAX_CHARS = 1000;
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```
