"use client";

import { Switch } from "@base-ui/react/switch";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

const toggleVariants = cva("inline-flex items-center gap-3", {
  variants: {
    size: {
      default: "",
      sm: "text-xs",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const trackVariants = cva(
  "flex cursor-pointer items-center rounded-full p-[3px] transition-colors disabled:opacity-50",
  {
    variants: {
      checked: {
        true: "bg-accent-green",
        false: "bg-border-primary",
      },
      size: {
        default: "h-[22px] w-[40px]",
        sm: "h-[18px] w-[34px]",
        lg: "h-[26px] w-[48px]",
      },
    },
    defaultVariants: {
      checked: false,
      size: "default",
    },
  },
);

const thumbVariants = cva(
  "block cursor-pointer rounded-full shadow-sm transition-transform disabled:pointer-events-none",
  {
    variants: {
      checked: {
        true: "translate-x-[18px] bg-text-primary",
        false: "translate-x-[3px] bg-text-tertiary",
      },
      size: {
        default: "h-4 w-4",
        sm: "h-3 w-3",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      checked: false,
      size: "default",
    },
  },
);

export interface ToggleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof toggleVariants> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const Toggle = forwardRef<HTMLDivElement, ToggleProps>(
  (
    {
      className,
      checked = false,
      size = "default",
      label,
      onChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={toggleVariants({ size, className })} ref={ref} {...props}>
        <Switch.Root
          checked={checked}
          onCheckedChange={(checked) => onChange?.(checked)}
          disabled={disabled}
          className={trackVariants({ checked, size })}
        >
          <Switch.Thumb className={thumbVariants({ checked, size })} />
        </Switch.Root>
        {label && (
          <span
            className={checked ? "text-accent-green" : "text-text-secondary"}
          >
            {label}
          </span>
        )}
      </div>
    );
  },
);

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
