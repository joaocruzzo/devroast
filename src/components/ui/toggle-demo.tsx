"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

export function ToggleDemo() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);

  return (
    <div className="flex flex-wrap gap-8">
      <Toggle
        checked={checked1}
        label="roast mode"
        onChange={(checked) => setChecked1(checked)}
      />
      <Toggle
        checked={checked2}
        label="roast mode"
        onChange={(checked) => setChecked2(checked)}
      />
    </div>
  );
}
