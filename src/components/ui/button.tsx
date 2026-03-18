import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display text-sm font-semibold uppercase tracking-wider ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-gradient-to-b from-primary to-primary/80 text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.5),0_2px_4px_-2px_hsl(var(--primary)/0.4),inset_0_1px_0_hsl(0_0%_100%/0.1)] hover:scale-[1.03] hover:shadow-[0_0_12px_2px_hsl(var(--primary)/0.5)] active:scale-[0.98]",
        secondary:
          "rounded-full bg-secondary text-secondary-foreground shadow-[0_0_0_1px_hsl(var(--secondary)/0.5)] hover:scale-[1.03] hover:shadow-[0_0_12px_2px_hsl(var(--secondary)/0.4)] active:scale-[0.98]",
        destructive:
          "rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "rounded-full border border-border bg-transparent hover:bg-muted hover:text-foreground",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "rounded-full bg-gradient-to-b from-primary to-primary/80 text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.5),0_4px_8px_-2px_hsl(var(--primary)/0.4),inset_0_1px_0_hsl(0_0%_100%/0.15)] hover:scale-[1.05] hover:shadow-[0_0_20px_4px_hsl(var(--primary)/0.5)] active:scale-[0.97]",
        "hero-secondary":
          "rounded-full border-2 border-neon-yellow/40 bg-transparent text-neon-yellow hover:scale-[1.03] hover:border-neon-yellow/70 hover:shadow-[0_0_12px_2px_hsl(var(--neon-yellow)/0.3)] active:scale-[0.98]",
        accent:
          "rounded-full bg-neon-yellow text-accent-foreground font-bold hover:scale-[1.03] hover:shadow-[0_0_12px_2px_hsl(var(--neon-yellow)/0.4)] active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
