"use client";

import { useFastSearch } from "@/components/wrappers/FastSearch";
import { Button } from "@/components/ui/button";

export function SearchTrigger() {
  const { openModal } = useFastSearch();

  return (
    <Button
      variant="outline"
      onClick={openModal}
      className="justify-start text-muted-foreground hover:text-foreground"
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      Search...
      <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
        ⌘K
      </kbd>
    </Button>
  );
}
