import { DiffLine, type DiffLineData } from "./diff-line";

type DiffBlockProps = {
  filename: string;
  lines: DiffLineData[];
  className?: string;
};

function DiffBlock({ filename, lines, className }: DiffBlockProps) {
  return (
    <div
      className={`border border-border-primary overflow-hidden bg-bg-input ${className ?? ""}`}
    >
      <div className="flex items-center h-10 px-4 border-b border-border-primary bg-bg-surface">
        <span className="font-mono text-xs text-text-secondary">
          {filename}
        </span>
      </div>

      <div className="py-1 font-mono text-xs">
        {lines.map((line, i) => (
          <DiffLine
            key={i}
            type={line.type}
            prefix={
              line.type === "added" ? "+" : line.type === "removed" ? "-" : " "
            }
          >
            {line.content}
          </DiffLine>
        ))}
      </div>
    </div>
  );
}

export type { DiffLineData };
export { DiffBlock };
