# Padrões de Componentes UI

## Estrutura de Arquivos

```
src/
├── components/ui/
│   ├── button.tsx
│   ├── score-ring.tsx
│   ├── code-block.tsx
│   └── agents.md        # Este arquivo
└── lib/
    └── utils.ts        # Função cn() (clsx + tailwind-merge)
```

## Regras para Criação de Componentes

### 1. Named Exports
- **Sempre** use named exports, nunca default exports
- Exporte o componente e as variants separadamente

```tsx
export interface ButtonProps { ... }
export { Button, buttonVariants };
```

### 2. Propriedades Nativas
- Extenda as propriedades nativas do elemento HTML correspondente
- Use `forwardRef` para permitir ref forwarding

```tsx
import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}
```

### 3. Variantes com cva
- Use `class-variance-authority` (cva) para gerenciar variantes
- **Não** use `twMerge` junto com `cva` - passe `className` diretamente
- O cva faz o merge automaticamente

```tsx
const buttonVariants = cva("classes-base", {
  variants: {
    variant: {
      primary: "bg-green-500 ...",
      secondary: "bg-neutral-100 ...",
    },
    size: {
      default: "h-10 px-6",
      sm: "h-8 px-3",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

// Uso no componente
className={buttonVariants({ variant, size, className })}
```

### 4. Tailwind
- Use classes Tailwind para estilização
- Mantenha consistência com o design system

### 5. Função cn()
- Use `cn()` (de `@/lib/utils`) apenas para merging manual de classes
- Não é necessária com cva (veja item 3)

```tsx
import { cn } from "@/lib/utils";

// Para merging manual
className={cn("base-class", conditional && "conditional-class")}
```

### 6. Biome
- Configure `biome.json` com indent de 2 espaços
- Organize imports automaticamente com `biome check --write`

## Componentes Específicos

### CodeBlock (Server Component)
- Componente **async** para uso com Shiki (syntax highlighting)
- Recebe `code`, `lang` (BundledLanguage do Shiki), `filename?` e `className?`
- Altura **adaptável** ao conteúdo (não usar altura fixa)
- Linhas numeradas à esquerda

```tsx
import { CodeBlock } from "@/components/ui/code-block";

<CodeBlock code={code} lang="javascript" filename="example.js" />
```

### ScoreRing
- Componente com variantes de tamanho via `cva`
- Calcula preenchimento da borda baseado em `(score / maxScore) * 100`
- Gradiente de cores: verde → âmbar → vermelho
- Raio do círculo: `r="86"` com strokeWidth 4px

```tsx
import { ScoreRing } from "@/components/ui/score-ring";

<ScoreRing score={3.5} /> {/* size="default" */}
<ScoreRing score={7.2} size="sm" />
<ScoreRing score={1.0} size="lg" />
```

### IssueCard
- Card para exibir issues/análises
- Props: `title`, `description`, `severity` ("error" | "warning" | "info")
- Borda colorida conforme severidade

### DiffBlock
- Bloco para exibir diffs de código
- Props: `filename`, `lines` (array com `type`, `content`, `lineNumber?`)
- Tipos de linha: "context" | "added" | "removed"

## Checklist para Novo Componente

- [ ] Criar arquivo em `src/components/ui/[component-name].tsx`
- [ ] Usar named exports
- [ ] Estender props nativos do elemento HTML
- [ ] Usar `forwardRef`
- [ ] Usar `cva` para variantes
- [ ] Não usar `twMerge` com `cva`
- [ ] Passar `className` diretamente para `cva`
- [ ] Verificar build: `npm run build`
- [ ] Verificar biome: `biome check src/`
- [ ] Formatar: `biome format --write src/`
