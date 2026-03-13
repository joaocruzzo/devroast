import { codeToHtml } from "shiki";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  theme?: string;
  className?: string;
}

async function processLine(
  line: string,
  language: string,
  theme: string,
): Promise<string> {
  const html = await codeToHtml(line || " ", {
    lang: language,
    theme,
  });

  return html
    .replace(
      "<pre",
      '<pre style="font-family: JetBrains Mono, monospace; font-size: 13px; line-height: 1.5; margin: 0; padding: 0; background: transparent;"',
    )
    .replace(/<pre style="([^"]*)">/, '<pre style="$1">')
    .replace(/<code style="([^"]*)">/, '<code style="$1">');
}

export async function CodeBlock({
  code,
  language = "javascript",
  showLineNumbers = true,
  theme = "vesper",
  className,
}: CodeBlockProps) {
  const lines = code.split("\n");
  const processedLines = await Promise.all(
    lines.map((line) => processLine(line, language, theme)),
  );

  return (
    <div
      className={cn(
        "flex w-[560px] flex-col rounded-md border border-border-primary bg-bg-input",
        className,
      )}
    >
      <div className="flex h-10 items-center gap-3 border-b border-border-primary px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
        <div className="flex-1" />
        <span className="font-mono text-xs text-text-tertiary">{language}</span>
      </div>
      <div className="flex">
        {showLineNumbers && (
          <div className="flex w-10 flex-col items-end gap-1.5 border-r border-border-primary bg-bg-surface px-[10px] py-3 font-mono text-sm leading-[19.5px] text-text-tertiary select-none">
            {lines.map((_line, i) => (
              <span key={`line-${i}`}>{i + 1}</span>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-1.5 p-3">
          {processedLines.map((html, i) => (
            <div key={`code-${i}`} className="flex gap-6">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
