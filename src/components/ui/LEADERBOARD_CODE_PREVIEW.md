# LeaderboardCodePreview Component

## Overview
Interactive code preview component for displaying code snippets in leaderboard with collapsible expand/collapse functionality.

## Usage

```tsx
import { LeaderboardCodePreview } from "@/components/ui/leaderboard-code-preview";

<LeaderboardCodePreview
  code={`line 1\nline 2\nline 3\nline 4`}
  language="javascript"
  maxLines={3}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | string | required | Full code as single string with newlines |
| `language` | string | required | Programming language (javascript, typescript, python, sql, rust, go) |
| `maxLines` | number | 3 | Number of lines to show before "show more" button |

## Features

- **Syntax Highlighting**: Uses Shiki with vesper theme
- **Collapsible**: Shows first N lines, expandable to full code
- **Smart Button**: Only shows button if code > maxLines
- **Animated Icon**: ChevronDown rotates 180° on expand
- **Line Counter**: Shows "X more" or total lines
- **Responsive**: Adapts to container width

## Behavior

### Collapsed State (≤ maxLines)
No button shown, all lines visible with line counter if applicable.

### Collapsed State (> maxLines)
```
line 1
line 2
line 3
+ show more (2 more)
```

### Expanded State
```
line 1
line 2
line 3
line 4
line 5
- hide (5 lines)
```

## Styling

- **Monospace Font**: font-mono, text-xs
- **Syntax Colors**: Language-specific via Shiki
- **Button Hover**: text-tertiary → text-secondary transition
- **Icon Rotation**: 0° → 180° transition
- **Spacing**: gap-1.5 between lines

## Implementation Notes

- Client-side component (uses `useState`)
- Async `HighlightedCode` sub-component for Shiki integration
- Supports JSX rendering in homepages and leaderboard previews
- Consistent styling with main `CodeBlock` component

## Example Integration

```tsx
// In page.tsx
const leaderboardEntries = [
  {
    rank: 1,
    score: 1.2,
    code: `eval(prompt('enter code'))
document.write(response)
// trust the user lol`,
    language: "javascript",
  },
];

{leaderboardEntries.map((entry) => (
  <LeaderboardCodePreview
    code={entry.code}
    language={entry.language}
    maxLines={3}
  />
))}
```
