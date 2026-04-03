import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-xs uppercase tracking-widest text-brand-gray">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full border-b border-brand-border bg-transparent px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-brand-gray focus:border-brand-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
