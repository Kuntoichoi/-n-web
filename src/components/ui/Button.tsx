import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: "bg-brand-black text-white hover:bg-black/90",
      secondary: "bg-brand-light-gray text-brand-black hover:bg-brand-border",
      outline: "border border-brand-black bg-transparent text-brand-black hover:bg-brand-light-gray",
      ghost: "bg-transparent text-brand-black hover:bg-brand-light-gray",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-12 px-8 text-sm",
      lg: "h-14 px-10 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-black focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
