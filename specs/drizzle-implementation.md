# Especificação de Database - DevRoast

## Visão Geral

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Docker Compose)
- **Autenticação**: Não (anónimo)

## Docker Compose

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Enums

### Language
Linguagens de programação suportadas.
```ts
export const languageEnum = pgEnum("language", [
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "java",
  "csharp",
  "cpp",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "markdown",
  "bash",
  "other",
]);
```

### SeverityLevel
Nível de severidade dos problemas encontrados.
```ts
export const severityLevelEnum = pgEnum("severity_level", [
  "critical",
  "warning",
  "good",
]);
```

## Tabelas

### submissions
Armazena os códigos submetidos para análise.
```ts
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull(),
  language: languageEnum("language").notNull(),
  roastMode: boolean("roast_mode").notNull().default(true),
  ipHash: text("ip_hash"), // hash simples para evitar duplicates
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### analyses
Resultado da análise do código (score e feedback).
```ts
export const analyses = pgTable("analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .references(() => submissions.id, { onDelete: "cascade" })
    .notNull(),
  score: real("score").notNull(), // 0-10
  overallFeedback: text("overall_feedback").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### issues
Problemas específicos encontrados no código.
```ts
export const issues = pgTable("issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  analysisId: uuid("analysis_id")
    .references(() => analyses.id, { onDelete: "cascade" })
    .notNull(),
  severity: severityLevelEnum("severity").notNull(),
  category: text("category").notNull(), // "security", "performance", "style", "best-practice"
  message: text("message").notNull(),
  lineStart: integer("line_start"),
  lineEnd: integer("line_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### suggestedFixes
Sugestões de correção (diff) para cada issue.
```ts
export const suggestedFixes = pgTable("suggested_fixes", {
  id: uuid("id").primaryKey().defaultRandom(),
  issueId: uuid("issue_id")
    .references(() => issues.id, { onDelete: "cascade" })
    .notNull(),
  originalCode: text("original_code").notNull(),
  fixedCode: text("fixed_code").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

## Relations

```
submissions (1) --> (N) analyses
analyses (1) --> (N) issues
issues (1) --> (N) suggestedFixes
```

## To-Dos de Implementação

### Fase 1: Setup
- [ ] Adicionar dependências: `drizzle-orm`, `drizzle-kit`, `pg`
- [ ] Criar `docker-compose.yml` com Postgres
- [ ] Criar arquivo `.env` com `DATABASE_URL`
- [ ] Criar `drizzle.config.ts`

### Fase 2: Schema
- [ ] Criar pasta `src/db/schema/`
- [ ] Criar `src/db/schema/submissions.ts`
- [ ] Criar `src/db/schema/analyses.ts`
- [ ] Criar `src/db/schema/issues.ts`
- [ ] Criar `src/db/schema/suggested-fixes.ts`
- [ ] Criar `src/db/schema/index.ts` (exports)
- [ ] Criar `src/db/index.ts` (connection)

### Fase 3: Migrations
- [ ] Executar `drizzle-kit generate`
- [ ] Executar `drizzle-kit push` (ou `migrate`)

### Fase 4: Queries (CRUD)
- [ ] Criar `src/db/queries/submissions.ts` - insert, getById
- [ ] Criar `src/db/queries/analyses.ts` - insert, getBySubmissionId
- [ ] Criar `src/db/queries/issues.ts` - insert, getByAnalysisId
- [ ] Criar `src/db/queries/suggested-fixes.ts` - insert, getByIssueId
- [ ] Criar `src/db/queries/leaderboard.ts` - getTopSubmissions

### Fase 5: Integração na UI
- [ ] Criar `src/lib/submission.ts` (server actions)
- [ ] Conectar HomeEditor ao banco
- [ ] Popular leaderboard com dados reais
- [ ] Atualizar contadores (total submissions, avg score)
