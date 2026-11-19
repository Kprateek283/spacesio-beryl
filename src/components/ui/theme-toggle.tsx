"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn("w-10 h-10 rounded-full border border-current/20", className)} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative w-10 h-10 rounded-full border border-current/20 flex items-center justify-center overflow-hidden transition-all duration-500 hover:border-current/50 focus:outline-none group",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-full h-full flex items-center justify-center text-current">
        <Sun 
          className={cn(
            "absolute w-4 h-4 transition-all duration-500", 
            isDark ? "-translate-y-10 opacity-0 rotate-90" : "translate-y-0 opacity-100 rotate-0"
          )} 
        />
        <Moon 
          className={cn(
            "absolute w-4 h-4 transition-all duration-500", 
            isDark ? "translate-y-0 opacity-100 rotate-0" : "translate-y-10 opacity-0 -rotate-90"
          )} 
        />
      </div>
    </button>
  );
}
