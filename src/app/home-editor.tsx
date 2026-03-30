"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { trpc } from "@/trpc/client";

const MAX_CHARS = 1000;

function HomeEditor() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);
  const [language, setLanguage] = useState<"javascript" | "typescript">(
    "javascript",
  );

  const mutation = trpc.roast.create.useMutation({
    onSuccess: (data) => {
      router.push(`/roast/${data.id}`);
    },
  });

  const isOverLimit = code.length > MAX_CHARS;
  const isEmpty = code.trim().length === 0;

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <CodeEditor
        value={code}
        onChange={setCode}
        className="w-full"
        maxChars={MAX_CHARS}
      />

      {/* Actions Bar */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Toggle
            checked={roastMode}
            onChange={setRoastMode}
            label="roast mode"
          />
          <span className="font-mono text-xs text-text-tertiary">
            {"// maximum sarcasm enabled"}
          </span>
        </div>

        <Button
          variant="primary"
          size="lg"
          disabled={isEmpty || isOverLimit || mutation.isPending}
          onClick={() => {
            mutation.mutate({
              code,
              language,
              roastMode,
            });
          }}
        >
          {mutation.isPending ? "$ analyzing..." : "$ roast_my_code"}
        </Button>
      </div>

      {mutation.isError && (
        <div className="w-full p-4 border border-accent-red bg-red-950 rounded font-mono text-sm text-accent-red">
          Error: {mutation.error.message}
        </div>
      )}
    </div>
  );
}

export { HomeEditor };
