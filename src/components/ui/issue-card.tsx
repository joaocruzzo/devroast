import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface IssueCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  severity: "error" | "warning" | "info";
}

const severityStyles = {
  error: {
    dot: "bg-accent-red",
    border: "border-accent-red/30",
  },
  warning: {
    dot: "bg-accent-amber",
    border: "border-accent-amber/30",
  },
  info: {
    dot: "bg-accent-green",
    border: "border-accent-green/30",
  },
};

const IssueCard = forwardRef<HTMLDivElement, IssueCardProps>(
  ({ className, title, description, severity, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-3 p-5 border",
          severityStyles[severity].border,
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn("size-2 rounded-full", severityStyles[severity].dot)}
          />
          <span className="font-mono text-sm font-medium text-text-primary">
            {title}
          </span>
        </div>
        <p className="font-mono text-xs text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    );
  },
);

IssueCard.displayName = "IssueCard";

export { IssueCard };
