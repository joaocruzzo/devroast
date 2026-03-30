import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

const diffLineVariants = cva("flex w-full gap-2 px-4 py-2 font-mono text-xs", {
  variants: {
    variant: {
      removed: "bg-accent-red/10 text-accent-red",
      added: "bg-accent-green/10 text-accent-green",
      context: "bg-transparent text-text-primary",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

const prefixVariants = cva("flex items-center justify-center", {
  variants: {
    variant: {
      removed: "text-accent-red",
      added: "text-accent-green",
      context: "text-text-tertiary",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

export type DiffLineData = {
  type: "context" | "added" | "removed";
  content: string;
};

export interface DiffLineProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "prefix">,
    VariantProps<typeof diffLineVariants> {
  type?: "removed" | "added" | "context";
  prefix?: string;
  children?: ReactNode;
}

const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, type, variant, prefix = " ", children, ...props }, ref) => {
    const resolvedVariant = type || variant;
    return (
      <div
        ref={ref}
        className={diffLineVariants({ variant: resolvedVariant, className })}
        {...props}
      >
        <span
          className={`w-5 flex-shrink-0 ${prefixVariants({ variant: resolvedVariant })}`}
        >
          {prefix}
        </span>
        <span className="flex-1 whitespace-pre">{children}</span>
      </div>
    );
  },
);

DiffLine.displayName = "DiffLine";

export { DiffLine, diffLineVariants, prefixVariants };
