import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-white hover:bg-accent/85 shadow-lg shadow-accent/20",
        destructive:
          "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25",
        outline:
          "border border-border bg-card text-text hover:bg-elevated hover:border-accent/40",
        secondary:
          "bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/30 hover:bg-accent-secondary/25",
        ghost:
          "text-text-muted hover:text-text hover:bg-elevated",
        link: "text-accent underline-offset-4 hover:underline hover:text-accent/80",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-xl px-7 has-[>svg]:px-5 text-base",
        xl: "h-13 rounded-xl px-9 has-[>svg]:px-7 text-lg",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
