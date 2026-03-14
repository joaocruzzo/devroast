import { cva, type VariantProps } from "class-variance-authority";

const navbarVariants = cva(
  "flex h-14 w-full items-center justify-between border-b border-border-primary bg-bg-page px-10",
  {
    variants: {
      size: {
        default: "h-14",
        sm: "h-12",
        lg: "h-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface NavbarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof navbarVariants> {
  logo?: string;
  links?: { label: string; href: string }[];
}

export function Navbar({
  className,
  size,
  logo = "devroast",
  links = [],
  ...props
}: NavbarProps) {
  return (
    <nav className={navbarVariants({ size, className })} {...props}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xl font-bold text-accent-green">
          &gt;
        </span>
        <span className="font-mono text-lg font-medium text-text-primary">
          {logo}
        </span>
      </div>
      <div className="flex items-center gap-6">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-mono text-sm text-text-secondary hover:text-text-primary"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export { navbarVariants };
