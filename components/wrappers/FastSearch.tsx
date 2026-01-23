"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";

// Types for search functionality
interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: "commands" | "guides" | "pages" | "parameters";
  url: string;
  searchTerms: string[]; // Additional searchable terms
  commandType?: "general" | "moderation";
  parameters?: string[];
}

interface SearchContextType {
  // Modal state
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;

  // Search state
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  hasSearched: boolean;

  // Navigation state
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;

  // Search functions
  performSearch: (searchQuery: string) => void;
  clearSearch: () => void;
  selectResult: (index?: number) => void;
}

// Create the context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Comprehensive search data based on guide content
const createSearchData = (): SearchResult[] => {
  const generalCommands = [
    {
      name: "help",
      description:
        "Shows this comprehensive command guide to help you get started with NightClaw!",
      parameters: [],
    },
    {
      name: "setup",
      parameters: [
        { name: "log_channel", type: "optional" },
        { name: "mod_role", type: "optional" },
        { name: "confess_channel", type: "optional" },
      ],
      description:
        "Configure your server with optional logging channel, moderator role, and confession channel for optimal bot performance.",
    },
    {
      name: "ticketsetup",
      description:
        "Creates an interactive ticket system embed with buttons in the current channel, allowing members to create support tickets.",
      parameters: [],
    },
    {
      name: "confesssetup",
      description:
        "Sets up an anonymous confession system with embed and buttons in the current channel for community engagement.",
      parameters: [],
    },
  ];

  const moderationCommands = [
    {
      name: "warn",
      parameters: [
        { name: "@user", type: "required" },
        { name: "reason", type: "required" },
      ],
      description:
        "Issues a formal warning to the specified user with the given reason, tracked in their moderation history.",
    },
    {
      name: "kick",
      parameters: [
        { name: "@user", type: "required" },
        { name: "reason", type: "required" },
      ],
      description:
        "Removes the user from the server temporarily. They can rejoin with a new invite link if available.",
    },
    {
      name: "mute",
      parameters: [
        { name: "@user", type: "required" },
        { name: "duration (minutes)", type: "required" },
        { name: "reason", type: "required" },
      ],
      description:
        "Temporarily mutes the specified user for the given duration, preventing them from sending messages or speaking in voice channels.",
    },
    {
      name: "unmute",
      parameters: [{ name: "@user", type: "required" }],
      description:
        "Removes the mute from the specified user, restoring their ability to participate in the server.",
    },
    {
      name: "clear",
      parameters: [
        { name: "message_count", type: "required" },
        { name: "reason", type: "required" },
        { name: "@user", type: "optional" },
      ],
      description:
        "Bulk deletes the specified number of messages. If a user is mentioned, only their messages will be removed.",
    },
    {
      name: "ban",
      parameters: [
        { name: "@user", type: "required" },
        { name: "reason", type: "required" },
      ],
      description:
        "Permanently bans the specified user from the server, preventing them from rejoining unless unbanned.",
    },
    {
      name: "sanction",
      parameters: [{ name: "@user", type: "required" }],
      description:
        "Displays a comprehensive overview of all moderation actions taken against the specified user with detailed information.",
    },
  ];

  const searchResults: SearchResult[] = [];
  let idCounter = 1;

  // Process general commands
  generalCommands.forEach((cmd) => {
    const params = cmd.parameters?.map((p) => p.name) || [];
    searchResults.push({
      id: String(idCounter++),
      title: `/${cmd.name}`,
      description: cmd.description,
      category: "commands",
      commandType: "general",
      url: `/guide#${cmd.name}`,
      parameters: params,
      searchTerms: [
        cmd.name,
        "general",
        "setup",
        "configure",
        ...params,
        ...cmd.description.toLowerCase().split(" "),
      ],
    });

    // Add parameter-specific search results
    cmd.parameters?.forEach((param) => {
      searchResults.push({
        id: String(idCounter++),
        title: `${param.name} parameter`,
        description: `${param.type} parameter for /${cmd.name} command`,
        category: "parameters",
        url: `/guide#${cmd.name}`,
        searchTerms: [param.name, param.type, cmd.name, "parameter"],
      });
    });
  });

  // Process moderation commands
  moderationCommands.forEach((cmd) => {
    const params = cmd.parameters?.map((p) => p.name) || [];
    searchResults.push({
      id: String(idCounter++),
      title: `/${cmd.name}`,
      description: cmd.description,
      category: "commands",
      commandType: "moderation",
      url: `/guide#${cmd.name}`,
      parameters: params,
      searchTerms: [
        cmd.name,
        "moderation",
        "mod",
        ...params,
        ...cmd.description.toLowerCase().split(" "),
      ],
    });

    // Add parameter-specific search results
    cmd.parameters?.forEach((param) => {
      searchResults.push({
        id: String(idCounter++),
        title: `${param.name} parameter`,
        description: `${param.type} parameter for /${cmd.name} command`,
        category: "parameters",
        url: `/guide#${cmd.name}`,
        searchTerms: [param.name, param.type, cmd.name, "parameter"],
      });
    });
  });

  // Add general guide sections
  searchResults.push(
    {
      id: String(idCounter++),
      title: "Commands Guide",
      description:
        "Complete reference of all NightClaw commands with examples and usage",
      category: "guides",
      url: "/guide",
      searchTerms: ["guide", "commands", "help", "documentation", "reference"],
    },
    {
      id: String(idCounter++),
      title: "General Commands",
      description: "Setup and configuration commands for your server",
      category: "guides",
      url: "/guide#general",
      searchTerms: ["general", "setup", "configure", "server", "bot"],
    },
    {
      id: String(idCounter++),
      title: "Moderation Commands",
      description: "Advanced moderation tools for server management",
      category: "guides",
      url: "/guide#moderation",
      searchTerms: [
        "moderation",
        "mod",
        "ban",
        "kick",
        "mute",
        "warn",
        "manage",
      ],
    },
    {
      id: String(idCounter++),
      title: "About NightClaw",
      description: "Learn about the story and developer behind NightClaw",
      category: "pages",
      url: "/about",
      searchTerms: [
        "about",
        "story",
        "developer",
        "ahranys",
        "noah",
        "background",
      ],
    },
  );

  return searchResults;
};

const searchData = createSearchData();

// Provider component
export function FastSearchProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Modal control functions
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    // Clear search when closing modal
    setQuery("");
    setResults([]);
    setHasSearched(false);
  }, []);
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  // Navigation functions
  const selectResult = useCallback(
    (index?: number) => {
      const targetIndex = index !== undefined ? index : highlightedIndex;
      if (targetIndex >= 0 && targetIndex < results.length) {
        const result = results[targetIndex];
        const url = new URL(result.url, window.location.origin);
        const targetPath = url.pathname;
        const targetHash = url.hash;

        // If we're on the same page, just scroll to the anchor or top
        if (pathname === targetPath) {
          if (targetHash) {
            // Scroll to the specific element
            const element = document.querySelector(targetHash);
            element?.scrollIntoView({ behavior: "smooth" });
          } else {
            // Scroll to top of the page
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          closeModal();
        } else {
          // Navigate to different page
          if (targetHash) {
            // For pages with anchors, navigate without hash first, then scroll
            router.push(targetPath);
            // Wait for navigation, then scroll to anchor
            setTimeout(() => {
              const element = document.querySelector(targetHash);
              element?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          } else {
            // Navigate to page normally
            router.push(result.url);
          }
          closeModal();
        }
      }
    },
    [highlightedIndex, results, closeModal, router, pathname],
  );

  // Smart search function with weighted scoring
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    // Simulate API delay
    setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();
      const words = query.split(" ").filter((word) => word.length > 0);

      const scoredResults = searchData.map((item) => {
        let score = 0;

        // Exact title match (highest priority)
        if (item.title.toLowerCase() === query) score += 100;
        else if (item.title.toLowerCase().includes(query)) score += 50;

        // Command name match (high priority for /command searches)
        if (query.startsWith("/") && item.title.toLowerCase().includes(query))
          score += 80;

        // Search terms match
        item.searchTerms?.forEach((term) => {
          if (term.toLowerCase() === query) score += 40;
          else if (term.toLowerCase().includes(query)) score += 20;
        });

        // Description match
        if (item.description.toLowerCase().includes(query)) score += 30;

        // Parameter match
        item.parameters?.forEach((param) => {
          if (param.toLowerCase().includes(query)) score += 25;
        });

        // Multi-word matching
        words.forEach((word) => {
          if (word.length < 2) return; // Skip very short words

          if (item.title.toLowerCase().includes(word)) score += 15;
          if (item.description.toLowerCase().includes(word)) score += 10;

          item.searchTerms?.forEach((term) => {
            if (term.toLowerCase().includes(word)) score += 8;
          });
        });

        // Category boost for common searches
        if (query.includes("command") && item.category === "commands")
          score += 20;
        if (query.includes("mod") && item.commandType === "moderation")
          score += 20;
        if (query.includes("setup") && item.commandType === "general")
          score += 20;

        return { ...item, score };
      });

      // Filter and sort by score
      const filteredResults = scoredResults
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10) // Limit to top 10 results
        .map(({ score, ...item }) => item); // Remove score from final results

      setResults(filteredResults);
      setIsLoading(false);
      setHighlightedIndex(-1); // Reset highlight when new results come in
    }, 200); // Reduced delay for better UX
  }, []);

  // Clear search function
  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setHighlightedIndex(-1);
  }, []);

  // Auto-search when query changes
  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  // Keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        toggleModal();
      }

      // Handle keyboard navigation when modal is open
      if (isOpen) {
        switch (event.key) {
          case "Escape":
            closeModal();
            break;
          case "ArrowDown":
            event.preventDefault();
            setHighlightedIndex((prev) =>
              prev < results.length - 1 ? prev + 1 : 0,
            );
            break;
          case "ArrowUp":
            event.preventDefault();
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : results.length - 1,
            );
            break;
          case "Enter":
            event.preventDefault();
            selectResult();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleModal, closeModal, results.length, selectResult]);

  const contextValue: SearchContextType = {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    query,
    setQuery,
    results,
    isLoading,
    hasSearched,
    highlightedIndex,
    setHighlightedIndex,
    performSearch,
    clearSearch,
    selectResult,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}

// Custom hook to use the search context
export function useFastSearch() {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error("useFastSearch must be used within a FastSearchProvider");
  }

  return context;
}

// Export both the provider and hook
export default FastSearchProvider;
