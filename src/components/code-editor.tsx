"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { twMerge } from "tailwind-merge";

export type CodeEditorLanguage =
  | "javascript"
  | "typescript"
  | "jsx"
  | "tsx"
  | "python"
  | "java"
  | "go"
  | "rust"
  | "c"
  | "cpp"
  | "csharp"
  | "html"
  | "css"
  | "scss"
  | "sql"
  | "json"
  | "yaml"
  | "ruby"
  | "php"
  | "swift"
  | "kotlin"
  | "markdown"
  | "bash"
  | "graphql"
  | "dockerfile";

const SUPPORTED_LANGUAGES: { value: CodeEditorLanguage; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "jsx", label: "JSX" },
  { value: "tsx", label: "TSX" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "scss", label: "SCSS" },
  { value: "sql", label: "SQL" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "markdown", label: "Markdown" },
  { value: "bash", label: "Bash" },
  { value: "graphql", label: "GraphQL" },
  { value: "dockerfile", label: "Dockerfile" },
];

function detectLanguage(code: string): CodeEditorLanguage {
  const trimmed = code.trim();
  if (!trimmed) return "javascript";

  const firstLine = trimmed.split("\n")[0] || "";

  // HTML detection
  if (
    trimmed.startsWith("<!DOCTYPE html") ||
    trimmed.startsWith("<html") ||
    trimmed.startsWith("<!doctype html")
  ) {
    return "html";
  }

  // PHP detection
  if (/^<\?php/i.test(trimmed)) {
    return "php";
  }

  // JSON detection
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {
      // Not valid JSON
    }
  }

  // SQL detection
  if (/^(select|insert|update|delete|create|alter|drop)\s/i.test(trimmed)) {
    return "sql";
  }

  // Bash detection
  if (firstLine.startsWith("#!") && /bash|sh|zsh/.test(firstLine)) {
    return "bash";
  }

  // Dockerfile detection
  if (/^FROM|RUN|CMD|COPY|WORKDIR|ENV/i.test(trimmed)) {
    return "dockerfile";
  }

  // GraphQL detection
  if (/^(query|mutation|subscription|type|schema)\s*[{{]/i.test(trimmed)) {
    return "graphql";
  }

  // YAML detection
  if (/^(---|\w+:)/m.test(trimmed) && !/^\s*[{#.]/m.test(trimmed)) {
    return "yaml";
  }

  // CSS/SCSS detection
  if (/^\s*(@[a-z]+\s*{|@import|@media|:root\s*{)/m.test(trimmed)) {
    return firstLine.includes("@") ? "scss" : "css";
  }

  // C/C++ detection
  if (/^\s*#include\s*</m.test(trimmed)) {
    if (/std::|cout|cin|endl|mock/i.test(trimmed)) {
      return "cpp";
    }
    return "c";
  }

  // Java detection
  if (
    /^\s*(public\s+class|private\s+|System\.out|import\s+java\.|@Override)/m.test(
      trimmed,
    )
  ) {
    return "java";
  }

  // Swift detection
  if (
    /^\s*(import\s+swift|func\s+\w+\(|guard\s+let|var\s+\w+:\s+\w+|@IBOutlet)/m.test(
      trimmed,
    )
  ) {
    return "swift";
  }

  // Kotlin detection
  if (
    /^\s*(fun\s+\w+|val\s+\w+|var\s+\w+:|data\s+class|object\s+\w+)/m.test(
      trimmed,
    )
  ) {
    return "kotlin";
  }

  // C# detection
  if (
    /^\s*(using\s+System|namespace\s+\w+|public\s+class|private\s+void)/m.test(
      trimmed,
    )
  ) {
    return "csharp";
  }

  // Ruby detection
  if (
    /^\s*(def\s+\w+|end$|class\s+\w+\s*<|require\s+['"]|attr_)/m.test(trimmed)
  ) {
    return "ruby";
  }

  // Rust detection
  if (/^\s*(fn\s+\w+|let\s+mut|impl\s+|struct\s+|enum\s+|#\[)/m.test(trimmed)) {
    return "rust";
  }

  // Go detection - more restrictive
  if (/^package\s+main|func\s+main\s*\(|fmt\.(Print|Sprintf)/.test(trimmed)) {
    return "go";
  }

  // TypeScript/JavaScript detection - BEFORE markdown
  const hasReactType = /React\.(ReactNode|FC|Component|Element)\b/.test(
    trimmed,
  );
  const hasTypeImport = /import\s+type\s+/.test(trimmed);
  const hasExportType = /export\s+type\s+/.test(trimmed);
  const hasTypeAnnotation =
    /:\s*(string|number|boolean|any|void|never|unknown|object)\b/.test(trimmed);
  const hasGeneric = /<\w+(\s*,\s*\w+)*>/.test(trimmed);
  const hasReadonly = /Readonly<|ReadonlyArray</.test(trimmed);
  const hasAsCast =
    /\bas\s+(string|number|boolean|any|never|unknown|const)/.test(trimmed);
  const hasTSX = /<[A-Z]\w+[^>]*>|<\w+[^>]*\s+\w+\s*=\s*[{"{]/.test(trimmed);

  const tsScore = [
    hasReactType,
    hasTypeImport,
    hasExportType,
    hasTypeAnnotation,
    hasGeneric,
    hasReadonly,
    hasAsCast,
  ].filter(Boolean).length;

  if (tsScore >= 1 || hasTypeImport || hasExportType || hasTypeAnnotation) {
    if (hasTSX) return "tsx";
    return "typescript";
  }

  if (hasTSX) {
    return "jsx";
  }

  const hasJSImport = /\b(import|export)\b/.test(trimmed);
  const hasJSConst = /\b(const|let|var)\s+\w+\s*=/.test(trimmed);
  const hasArrowFn = /=>\s*[{(]/.test(trimmed);
  const hasFunctionKeyword = /\bfunction\s+\w+/.test(trimmed);

  if (hasJSImport || hasJSConst || hasArrowFn || hasFunctionKeyword) {
    return "javascript";
  }

  // Markdown detection - LAST (less specific)
  if (
    /^\s*(#\s+|```\w*|```$)/m.test(trimmed) &&
    !hasJSImport &&
    !hasTypeAnnotation
  ) {
    return "markdown";
  }

  return "javascript";
}

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

function CodeEditor({ value, onChange, className }: CodeEditorProps) {
  const [language, setLanguage] = useState<CodeEditorLanguage>("javascript");
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const lastDetectedLang = useRef<CodeEditorLanguage | null>(null);
  const prevValueLength = useRef<number>(0);

  // Auto-detect language when code changes significantly
  useEffect(() => {
    const valueLength = value.trim().length;
    const wasEmpty = prevValueLength.current === 0;
    const pastedALot = valueLength - prevValueLength.current > 20;

    if ((wasEmpty || pastedALot) && value.trim().length > 5) {
      const detected = detectLanguage(value);
      if (detected !== lastDetectedLang.current) {
        lastDetectedLang.current = detected;
        setLanguage(detected);
      }
    }

    prevValueLength.current = valueLength;
  }, [value]);

  useEffect(() => {
    createHighlighter({
      themes: ["vesper"],
      langs: SUPPORTED_LANGUAGES.map((l) => l.value),
    }).then(setHighlighter);
  }, []);

  useEffect(() => {
    if (!highlighter || !value) {
      setHighlightedCode("");
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        const html = highlighter.codeToHtml(value, {
          lang: language,
          theme: "vesper",
        });
        setHighlightedCode(html);
      } catch {
        setHighlightedCode("");
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [value, language, highlighter]);

  useEffect(() => {
    const valueLength = value.trim().length;
    const wasEmpty = prevValueLength.current === 0;
    const pastedALot = valueLength - prevValueLength.current > 50;

    if ((wasEmpty || pastedALot) && value.trim().length > 10) {
      const detected = detectLanguage(value);
      if (detected !== lastDetectedLang.current && detected !== language) {
        lastDetectedLang.current = detected;
        setLanguage(detected);
      }
    }

    prevValueLength.current = valueLength;
  }, [value, language]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as CodeEditorLanguage;
    setLanguage(newLang);
  };

  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;
    const highlightedCode = codeRef.current;
    if (!textarea) return;

    if (highlightedCode) {
      highlightedCode.scrollTop = textarea.scrollTop;
      highlightedCode.scrollLeft = textarea.scrollLeft;
    }
    if (lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop;
    }
  }, []);

  const lines = value.split("\n");
  const lineCount = Math.max(lines.length, 13);

  const currentLanguageLabel = SUPPORTED_LANGUAGES.find(
    (l) => l.value === language,
  )?.label;

  return (
    <div
      className={twMerge(
        "border border-border-primary overflow-hidden flex flex-col",
        className,
      )}
    >
      {/* Window Header */}
      <div className="flex items-center gap-2 h-10 px-4 border-b border-border-primary">
        <span className="size-3 rounded-full bg-accent-red" />
        <span className="size-3 rounded-full bg-accent-amber" />
        <span className="size-3 rounded-full bg-accent-green" />

        {/* Language Selector */}
        <div className="ml-auto mr-2 relative flex items-center">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="appearance-none bg-transparent border-none pr-5 font-mono text-xs text-text-secondary outline-none cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option
                key={lang.value}
                value={lang.value}
                style={{ backgroundColor: "#171717", color: "#a3a3a3" }}
              >
                {lang.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-0 size-3 text-text-tertiary pointer-events-none" />
        </div>
      </div>

      {/* Code Area */}
      <div className="flex flex-1 bg-bg-input max-h-80 overflow-hidden">
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="flex flex-col items-end gap-0 py-[11px] px-3 w-12 border-r border-border-primary bg-bg-surface select-none overflow-hidden"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <span
              key={i}
              className="font-mono text-xs leading-6 text-text-tertiary"
            >
              {i + 1}
            </span>
          ))}
        </div>

        {/* Code Display + Textarea Overlay */}
        <div className="flex-1 relative">
          {/* Highlighted Code - synchronized with textarea via handleScroll */}
          <div
            ref={codeRef}
            className="absolute inset-0 py-[11px] px-4 font-mono text-xs leading-6 pointer-events-none overflow-hidden whitespace-pre"
          >
            {highlightedCode ? (
              <div
                className="shiki-container"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki generates trusted HTML from code strings
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            ) : (
              <pre className="text-text-tertiary m-0 p-0 leading-6 whitespace-pre">
                {value || " "}
              </pre>
            )}
          </div>

          {/* Textarea Overlay - controls the scroll */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            placeholder="// paste your code here..."
            spellCheck={false}
            className="absolute inset-0 w-full py-[11px] px-4 bg-transparent font-mono text-xs leading-6 text-transparent caret-text-primary placeholder:text-text-tertiary outline-none resize-none whitespace-pre overflow-y-auto overflow-x-hidden z-10"
            style={{
              caretColor: "#a1a1aa",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export type { CodeEditorProps };
export { CodeEditor, SUPPORTED_LANGUAGES };
