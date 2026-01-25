"use client";
// Imports
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { SunIcon, MoonIcon, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFastSearch } from "@/components/wrappers/FastSearch";
import { useI18n } from "@/locales/client";
import LanguageSelector from "./LanguageSelector";

// NavBar Component
export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const { openModal } = useFastSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useI18n();

  const themeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // template
  return (
    <nav className="flex items-center h-16 border-b px-4 mb-6 sticky top-0 z-10 bg-background">
      <Link href="/" onClick={closeMobileMenu}>
        <h1 className="text-xl font-bold">NightClaw</h1>
      </Link>

      {/* Desktop Navigation */}
      <ul className="ml-auto hidden lg:flex items-center gap-4">
        <li className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            className="text-xs justify-start"
            onClick={openModal}
          >
            {t("Nav.fastSearch")}
            <kbd className="ml-2 rounded bg-accent/20 px-1.5 py-0.5 font-mono text-xs font-medium">
              Ctrl + K
            </kbd>
          </Button>
          <Link href="/guide" className="link-underline text-text font-medium">
            {t("Nav.guide")}
          </Link>
          <Link href="/about" className="link-underline text-text font-medium">
            {t("Nav.about")}
          </Link>
        </li>
        <li className="flex items-center gap-2">
          <LanguageSelector />
          <Button onClick={themeToggle} variant="ghost" size="sm">
            {!mounted ? null : theme === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
          <Button>{t("Nav.logIn")}</Button>
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <div className="ml-auto lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />

          {/* Mobile Menu */}
          <div className="fixed top-16 right-0 left-0 bg-background border-b shadow-lg z-50 lg:hidden">
            <div className="px-4 py-6 space-y-4">
              {/* Search Button - Mobile */}
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs justify-center"
                onClick={() => {
                  openModal();
                  closeMobileMenu();
                }}
              >
                {t("Nav.fastSearch")}
                <kbd className="ml-2 rounded bg-accent/20 px-1.5 py-0.5 font-mono text-xs font-medium">
                  Ctrl + K
                </kbd>
              </Button>

              {/* Navigation Links */}
              <div className="space-y-3">
                <Link
                  href="/guide"
                  className="block text-text font-medium py-2 px-4 rounded-md hover:bg-muted transition-colors"
                  onClick={closeMobileMenu}
                >
                  {t("Nav.guide")}
                </Link>
                <Link
                  href="/about"
                  className="block text-text font-medium py-2 px-4 rounded-md hover:bg-muted transition-colors"
                  onClick={closeMobileMenu}
                >
                  {t("Nav.about")}
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <LanguageSelector />
                <Button
                  onClick={themeToggle}
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                >
                  {!mounted ? null : theme === "light" ? (
                    <>
                      <MoonIcon className="h-4 w-4 mr-2" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <SunIcon className="h-4 w-4 mr-2" />
                      Light Mode
                    </>
                  )}
                </Button>
                <Button className="flex-1" onClick={closeMobileMenu}>
                  {t("Nav.logIn")}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
