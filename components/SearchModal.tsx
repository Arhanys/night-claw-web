"use client";

import { useFastSearch } from "@/components/wrappers/FastSearch";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function SearchModal() {
  const {
    isOpen,
    closeModal,
    query,
    setQuery,
    results,
    isLoading,
    hasSearched,
    clearSearch,
    highlightedIndex,
    setHighlightedIndex,
    selectResult,
  } = useFastSearch();

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle result click
  const handleResultClick = (index: number) => {
    selectResult(index);
  };

  // Handle mouse hover
  const handleResultHover = (index: number) => {
    setHighlightedIndex(index);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={closeModal} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4">
        <div className="bg-background border border-border rounded-lg shadow-xl">
          {/* Search Input */}
          <div className="flex items-center border-b border-border px-4">
            <svg
              className="w-5 h-5 text-muted-foreground mr-3"
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
            <input
              ref={inputRef}
              type="text"
              placeholder="Search commands, guides, and pages... (Ctrl+K)"
              className="flex-1 px-2 py-4 bg-transparent text-foreground placeholder-muted-foreground outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="ml-2"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto p-2">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
                <span className="ml-2 text-muted-foreground">Searching...</span>
              </div>
            )}

            {!isLoading && hasSearched && results.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <svg
                  className="w-12 h-12 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64"
                  />
                </svg>
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-1">
                  Try searching for commands like "warn", "mute", or "setup"
                </p>
              </div>
            )}

            {!isLoading && !hasSearched && (
              <div className="text-center py-8 text-muted-foreground">
                <svg
                  className="w-12 h-12 mx-auto mb-4 opacity-50"
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
                <p>Start typing to search...</p>
                <p className="text-sm mt-1">
                  Search commands, guides, and pages
                </p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="space-y-1">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(index)}
                    onMouseEnter={() => handleResultHover(index)}
                    className={`w-full text-left p-3 rounded-md transition-colors group ${
                      index === highlightedIndex
                        ? "bg-accent/10 border-l-2 border-accent"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-medium transition-colors ${
                              index === highlightedIndex
                                ? "text-accent"
                                : "text-foreground group-hover:text-accent"
                            }`}
                          >
                            {result.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-md ${
                              result.category === "commands"
                                ? "bg-accent/20 text-accent"
                                : result.category === "guides"
                                  ? "bg-accent-secondary/20 text-accent-secondary"
                                  : result.category === "parameters"
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {result.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {result.description}
                        </p>
                      </div>
                      <svg
                        className={`w-4 h-4 ml-2 mt-1 transition-colors ${
                          index === highlightedIndex
                            ? "text-accent"
                            : "text-muted-foreground group-hover:text-accent"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-3 bg-muted/20">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>Esc Close</span>
              </div>
              <span>Ctrl+K to open</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
