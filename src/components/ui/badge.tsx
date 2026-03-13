import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 text-xs font-normal",
  {
    variants: {
      variant: {
        critical: "text-accent-red",
        warning: "text-accent-amber",
        good: "text-accent-green",
        verdict: "text-accent-red",
      },
      size: {
        default: "text-xs",
        sm: "text-[10px]",
        lg: "text-sm",
      },
    },
    defaultVariants: {
      variant: "good",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, dot = true, ...props }, ref) => {
    const dotColor =
      {
        critical: "bg-accent-red",
        warning: "bg-accent-amber",
        good: "bg-accent-green",
        verdict: "bg-accent-red",
      }[variant || "good"] || "bg-accent-green";

    return (
      <div
        className={badgeVariants({ variant, size, className })}
        ref={ref}
        {...props}
      >
        {dot && <span className={cn("h-2 w-2 rounded-full", dotColor)} />}
      </div>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
