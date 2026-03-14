import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const AnalysisCardRoot = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-3 rounded-md border border-border-primary bg-bg-page p-5",
        className,
      )}
      {...props}
    />
  );
});

AnalysisCardRoot.displayName = "AnalysisCardRoot";

const AnalysisCardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        "font-mono text-sm font-normal text-text-primary",
        className,
      )}
      {...props}
    />
  );
});

AnalysisCardTitle.displayName = "AnalysisCardTitle";

const AnalysisCardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "font-mono text-xs font-normal leading-[1.5] text-text-secondary",
        className,
      )}
      {...props}
    />
  );
});

AnalysisCardDescription.displayName = "AnalysisCardDescription";

export { AnalysisCardDescription, AnalysisCardRoot, AnalysisCardTitle };
