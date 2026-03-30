import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const leaderboardRowVariants = cva("flex px-5 py-4", {
  variants: {
    border: {
      true: "border-b border-border-primary",
      false: "",
    },
  },
  defaultVariants: {
    border: true,
  },
});

export interface LeaderboardRowRootProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof leaderboardRowVariants> {
  children: ReactNode;
}

const LeaderboardRowRoot = forwardRef<HTMLDivElement, LeaderboardRowRootProps>(
  ({ className, border, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(leaderboardRowVariants({ border, className }))}
        {...props}
      >
        {children}
      </div>
    );
  },
);

LeaderboardRowRoot.displayName = "LeaderboardRowRoot";

const LeaderboardRowRank = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("w-12 font-mono text-xs", className)}
      {...props}
    />
  );
});

LeaderboardRowRank.displayName = "LeaderboardRowRank";

interface LeaderboardRowScoreProps extends HTMLAttributes<HTMLSpanElement> {
  value: number;
}

const LeaderboardRowScore = forwardRef<
  HTMLSpanElement,
  LeaderboardRowScoreProps
>(({ className, value, ...props }, ref) => {
  const getScoreColor = (score: number) => {
    if (score <= 3) return "text-accent-red";
    if (score <= 6) return "text-accent-amber";
    return "text-accent-green";
  };

  return (
    <span
      ref={ref}
      className={cn(
        "w-18 font-mono text-xs font-bold",
        getScoreColor(value),
        className,
      )}
      {...props}
    >
      {value.toFixed(1)}
    </span>
  );
});

LeaderboardRowScore.displayName = "LeaderboardRowScore";

const LeaderboardRowCode = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 flex flex-col gap-2.5", className)}
      {...props}
    />
  );
});

LeaderboardRowCode.displayName = "LeaderboardRowCode";

const LeaderboardRowLanguage = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "w-24 font-mono text-xs text-text-secondary text-right",
        className,
      )}
      {...props}
    />
  );
});

LeaderboardRowLanguage.displayName = "LeaderboardRowLanguage";

export {
  LeaderboardRowCode,
  LeaderboardRowLanguage,
  LeaderboardRowRank,
  LeaderboardRowRoot,
  LeaderboardRowScore,
  leaderboardRowVariants,
};
