"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300 flex items-center justify-center relative w-10 h-10"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 absolute transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
      <Moon className="h-5 w-5 absolute transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
