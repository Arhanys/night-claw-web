"use client";
// Imports
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { SunIcon, MoonIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFastSearch } from "@/components/wrappers/FastSearch";

// NavBar Component
export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const { openModal } = useFastSearch();

  const themeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // template
  return (
    <nav className="flex items-center h-16 border-b px-4 mb-6 sticky top-0 z-10 bg-background">
      <Link href="/">
        <h1 className="text-xl font-bold">NightClaw</h1>
      </Link>
      <ul className="ml-auto flex items-center gap-4">
        <li className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            className="text-xs justify-start"
            onClick={openModal}
          >
            Search Documentation...
            <kbd className="ml-2 rounded bg-accent/20 px-1.5 py-0.5 font-mono text-xs font-medium">
              Ctrl + K
            </kbd>
          </Button>
          <Link href="/guide" className="link-underline text-text font-medium">
            Guide
          </Link>
          <Link href="/about" className="link-underline text-text font-medium">
            About
          </Link>
        </li>
        <li className="flex items-center gap-2">
          <Button onClick={themeToggle} variant="ghost" size="sm">
            {!mounted ? null : theme === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
          <Button>Log In</Button>
        </li>
      </ul>
    </nav>
  );
}
