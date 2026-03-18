import { cn } from "@/lib/utils";

type DiffLine = {
  type: "context" | "added" | "removed";
  content: string;
  lineNumber?: number;
};

type DiffBlockProps = {
  filename: string;
  lines: DiffLine[];
  className?: string;
};

function DiffBlock({ filename, lines, className }: DiffBlockProps) {
  return (
    <div
      className={cn("border border-border-primary overflow-hidden", className)}
    >
      {/* Header */}
      <div className="flex items-center h-10 px-4 border-b border-border-primary bg-bg-surface">
        <span className="font-mono text-xs text-text-secondary">
          {filename}
        </span>
      </div>

      {/* Body */}
      <div className="flex bg-bg-input font-mono text-xs">
        {/* Line numbers */}
        <div className="flex flex-col items-end w-12 py-1 px-3 border-r border-border-primary bg-bg-surface select-none">
          {lines.map((line, i) => (
            <span key={i} className="h-7 leading-7 text-text-tertiary">
              {line.lineNumber || i + 1}
            </span>
          ))}
        </div>

        {/* Diff content */}
        <div className="flex-1 py-1 px-4">
          {lines.map((line, i) => (
            <div
              key={i}
              className={cn(
                "h-7 leading-7",
                line.type === "added" && "bg-accent-green/10",
                line.type === "removed" && "bg-accent-red/10",
              )}
            >
              <span
                className={cn(
                  "mr-3",
                  line.type === "added" && "text-accent-green",
                  line.type === "removed" && "text-accent-red",
                  line.type === "context" && "text-text-tertiary",
                )}
              >
                {line.type === "added"
                  ? "+"
                  : line.type === "removed"
                    ? "-"
                    : " "}
              </span>
              <span
                className={cn(
                  line.type === "removed" && "text-accent-red/80",
                  line.type === "added" && "text-accent-green/80",
                  line.type === "context" && "text-text-primary",
                )}
              >
                {line.content}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { DiffBlock };
