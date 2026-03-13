import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "flex flex-col gap-3 rounded-md border border-border-primary bg-bg-page p-5",
  {
    variants: {
      variant: {
        default: "border-border-primary",
        critical: "border-accent-red/30 bg-bg-page",
        warning: "border-accent-amber/30 bg-bg-page",
        success: "border-accent-green/30 bg-bg-page",
      },
      width: {
        default: "",
        full: "w-full",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      width: "default",
    },
  },
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, width, ...props }, ref) => {
    return (
      <div
        className={cardVariants({ variant, width, className })}
        ref={ref}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      />
    );
  },
);

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
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

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
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

CardDescription.displayName = "CardDescription";

export { Card, CardDescription, CardHeader, CardTitle, cardVariants };
