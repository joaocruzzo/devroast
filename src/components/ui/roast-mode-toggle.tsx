"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

export function RoastModeToggle() {
  const [checked, setChecked] = useState(true);

  return (
    <Toggle
      checked={checked}
      label="roast mode"
      onChange={(checked) => setChecked(checked)}
    />
  );
}
