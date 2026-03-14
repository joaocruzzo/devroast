# DevRoast - AGENTS.md

## Tech Stack

- Next.js 16 + TypeScript + Turbopack
- Tailwind CSS v4 (theme variables in `globals.css`)
- Base UI (`@base-ui/react`)
- Shiki for code highlighting
- Biome for lint/format

## Padrões

### Componentes UI (`src/components/ui/`)

- Named exports sempre
- Usar `cva` para variantes
- Props estendem elementos HTML nativos com `forwardRef`
- Não usar `twMerge` com `cva`

### Composição

Componentes com partes internas usam padrão de composição:

```tsx
<ComponentRoot>
  <ComponentPart>...</ComponentPart>
</ComponentRoot>
```

Exemplos: `AnalysisCard*`, `LeaderboardRow*`

### Shiki

CodeBlock é Server Component (async). CodeEditor é Client Component.

### Tailwind

Usar theme variables, não valores arbitrários.

## Scripts

- `npm run dev` - development
- `npm run build` - production build
- `biome check --write` - lint + format
