import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const scoreRingVariants = cva(
  "relative inline-flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "h-24 w-24",
        default: "h-[180px] w-[180px]",
        lg: "h-64 w-64",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface ScoreRingProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scoreRingVariants> {
  score: number;
  maxScore?: number;
}

const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, size, score = 0, maxScore = 10, ...props }, ref) => {
    const percentage = (score / maxScore) * 100;

    const getScoreColor = (score: number) => {
      if (score >= 7) return "text-accent-green";
      if (score >= 4) return "text-accent-amber";
      return "text-accent-red";
    };

    return (
      <div
        ref={ref}
        className={scoreRingVariants({ size, className })}
        {...props}
      >
        <svg
          className="absolute h-full w-full -rotate-90"
          viewBox="0 0 180 180"
          role="img"
          aria-label={`Score: ${score} out of ${maxScore}`}
        >
          <circle
            cx="90"
            cy="90"
            r="86"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-border-primary"
          />
          <circle
            cx="90"
            cy="90"
            r="86"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeDasharray={`${(percentage / 100) * 540} 540`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-mono text-5xl font-bold leading-none",
              getScoreColor(score),
            )}
          >
            {score}
          </span>
          <span className="font-mono text-base text-text-tertiary leading-none">
            /{maxScore}
          </span>
        </div>
      </div>
    );
  },
);

ScoreRing.displayName = "ScoreRing";

export { ScoreRing, scoreRingVariants };
