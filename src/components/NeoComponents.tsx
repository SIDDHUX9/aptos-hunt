import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";

export const NeoButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "neo-button font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-none",
          variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-black dark:border-white",
          variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/90 border-2 border-black dark:border-white",
          variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-2 border-black dark:border-white",
          variant === "outline" && "bg-background border-2 border-black dark:border-white text-foreground hover:bg-accent hover:text-accent-foreground",
          variant === "ghost" && "hover:bg-accent hover:text-accent-foreground text-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
NeoButton.displayName = "NeoButton";

export const NeoCard = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof Card>>(
  ({ className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn("neo-card p-6 border-2 border-black dark:border-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)]", className)}
        {...props}
      />
    );
  }
);
NeoCard.displayName = "NeoCard";

export const NeoBadge = ({ children, className, variant = "default" }: { children: React.ReactNode, className?: string, variant?: "default" | "success" | "warning" | "danger" }) => {
  const variants = {
    default: "bg-primary text-primary-foreground",
    success: "bg-secondary text-secondary-foreground",
    warning: "bg-yellow-400 text-black dark:bg-yellow-500 dark:text-black",
    danger: "bg-destructive text-destructive-foreground",
  };
  
  return (
    <div className={cn(
      "inline-flex items-center rounded-none border-2 border-black dark:border-white px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
};