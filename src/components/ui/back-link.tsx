"use client";

import { useRouter } from "next/navigation";

type BackLinkProps = {
  fallback?: string;
};

export function BackLink({ fallback = "/leaderboard" }: BackLinkProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors text-left cursor-pointer"
    >
      {"< back to leaderboard"}
    </button>
  );
}
