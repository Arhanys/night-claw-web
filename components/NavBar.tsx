"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import { SunIcon, MoonIcon, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useFastSearch } from "@/components/wrappers/FastSearch"
import { useI18n, useCurrentLocale } from "@/locales/client"
import LanguageSelector from "./LanguageSelector"
import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"

export default function NavBar() {
  const { theme, setTheme } = useTheme()
  const { openModal } = useFastSearch()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const t = useI18n()
  const locale = useCurrentLocale()
  const { data: session, status } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const AuthButton = () => {
    if (status === "loading" || !mounted)
      return <Button disabled size="sm">{t("Nav.logIn")}</Button>
    if (session) {
      return (
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/dashboard`}>
            <Button variant="outline" size="sm">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "avatar"}
                  width={18}
                  height={18}
                  className="rounded-full"
                />
              )}
              Dashboard
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      )
    }
    return (
      <Button size="sm" onClick={() => signIn("discord")}>
        {t("Nav.logIn")}
      </Button>
    )
  }

  return (
    <nav
      className={`flex items-center h-16 px-6 sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-card/90 border-b border-border backdrop-blur-xl shadow-2xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <Link href="/" onClick={closeMobileMenu} className="shrink-0">
        <span className="text-xl font-bold font-display tracking-tight">
          Night<span className="gradient-text">Claw</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <ul className="ml-auto hidden lg:flex items-center gap-3">
        <li className="flex gap-1 items-center">
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-text-muted bg-elevated border border-border rounded-lg hover:border-accent/40 hover:text-text transition-all font-mono"
          >
            {t("Nav.fastSearch")}
            <kbd className="bg-accent/10 text-accent border border-accent/20 rounded px-1.5 py-0.5 text-[10px] font-semibold">
              ⌘K
            </kbd>
          </button>
          <Link
            href="/guide"
            className="px-3 py-1.5 text-sm text-text-muted hover:text-text transition-colors rounded-lg hover:bg-elevated"
          >
            {t("Nav.guide")}
          </Link>
          <Link
            href="/about"
            className="px-3 py-1.5 text-sm text-text-muted hover:text-text transition-colors rounded-lg hover:bg-elevated"
          >
            {t("Nav.about")}
          </Link>
        </li>
        <li className="flex items-center gap-2 pl-2 border-l border-border">
          <LanguageSelector />
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-elevated transition-all"
            aria-label="Toggle theme"
          >
            {!mounted ? null : theme === "light" ? (
              <MoonIcon className="h-4 w-4" />
            ) : (
              <SunIcon className="h-4 w-4" />
            )}
          </button>
          <AuthButton />
        </li>
      </ul>

      {/* Mobile menu button */}
      <div className="ml-auto lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-elevated transition-all"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation — animated dropdown */}
      <div
        className={`fixed top-16 left-0 right-0 z-50 lg:hidden transition-all duration-200 origin-top ${
          mobileMenuOpen
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        {/* Backdrop tap area */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-[-1]" onClick={closeMobileMenu} />
        )}

        <div className="bg-card/98 backdrop-blur-xl border-b border-border shadow-2xl shadow-black/30 px-4 py-4 space-y-1">
          <button
            onClick={() => { openModal(); closeMobileMenu() }}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-text-muted hover:text-text rounded-xl hover:bg-elevated transition-colors"
          >
            {t("Nav.fastSearch")}
            <kbd className="ml-auto bg-elevated border border-border rounded px-1.5 py-0.5 text-[10px] font-mono text-text-muted">⌘K</kbd>
          </button>
          <Link
            href="/guide"
            className="flex items-center px-3 py-2.5 text-sm text-text-muted hover:text-text rounded-xl hover:bg-elevated transition-colors"
            onClick={closeMobileMenu}
          >
            {t("Nav.guide")}
          </Link>
          <Link
            href="/about"
            className="flex items-center px-3 py-2.5 text-sm text-text-muted hover:text-text rounded-xl hover:bg-elevated transition-colors"
            onClick={closeMobileMenu}
          >
            {t("Nav.about")}
          </Link>

          <div className="flex items-center gap-2 pt-2 mt-2 border-t border-border">
            <LanguageSelector />
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-elevated transition-colors"
            >
              {!mounted ? null : theme === "light" ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
            </button>
            <div className="ml-auto" onClick={closeMobileMenu}><AuthButton /></div>
          </div>
        </div>
      </div>
    </nav>
  )
}
