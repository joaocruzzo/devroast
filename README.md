# DevRoast

Paste your code. Get roasted.

DevRoast is a code quality analyzer that gives your code a brutally honest score from 0 to 10. Submit any snippet, enable "roast mode" for maximum sarcasm, and find out just how bad (or good) your code really is.

## Features

- **Code submission** — paste any code snippet and get an instant quality score
- **Roast mode** — toggle brutal sarcasm for a more entertaining analysis
- **Detailed analysis** — get specific feedback on what's wrong (and right) with your code, with severity levels (critical, warning, good)
- **Suggested fixes** — see a diff of what your code could look like with improvements applied
- **Shame leaderboard** — the worst code on the internet, ranked by shame. See how your code compares
- **OpenGraph images** — share your roast results with automatically generated preview images

## Tech Stack

- **Framework**: Next.js 16 with TypeScript + Turbopack
- **Database**: PostgreSQL with Drizzle ORM
- **API**: tRPC for type-safe endpoints
- **Syntax Highlighting**: Shiki
- **UI**: Tailwind CSS v4 with custom design system
- **Deployment**: Ready for Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout with navbar
│   ├── leaderboard/       # Leaderboard page
│   └── roast/[id]/        # Roast result page
├── components/
│   └── ui/                # Reusable UI components
├── db/
│   ├── schema/            # Drizzle schema definitions
│   └── queries/           # Database query functions
└── trpc/                  # tRPC router and client setup
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and API keys

# Push database schema
pnpm db:push

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key for code analysis |

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
pnpm lint         # Run Biome linter
```

## License

MIT
