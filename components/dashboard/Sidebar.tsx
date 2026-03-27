"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import { LayoutDashboard, Shield, Settings, LogOut, ChevronRight, ArrowUpLeft, Users, Scale, Ticket, Menu, X } from "lucide-react"
import { useCurrentLocale, useScopedI18n } from "@/locales/client"
import LanguageSelector from "@/components/LanguageSelector"

interface Guild {
  id: string
  name: string
  icon: string | null
}

interface Props {
  guilds: Guild[]
  userName: string
  userImage: string | null
}

function iconUrl(guildId: string, icon: string) {
  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.webp?size=64`
}

export function DashboardSidebar({ guilds, userName, userImage }: Props) {
  const pathname = usePathname()
  const locale = useCurrentLocale()
  const t = useScopedI18n("dashboard")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const guildMatch = pathname.match(/\/dashboard\/(\d+)/)
  const activeGuildId = guildMatch?.[1] ?? null

  const SUB_NAV = [
    { label: t("sidebar.overview"),  segment: "",         icon: LayoutDashboard },
    { label: t("sidebar.members"),   segment: "/members", icon: Users },
    { label: t("sidebar.sanctions"), segment: "/sanctions", icon: Shield },
    { label: t("sidebar.config"),    segment: "/config",  icon: Settings },
    { label: t("sidebar.appeals"),   segment: "/appeals", icon: Scale },
    { label: t("sidebar.tickets"),   segment: "/tickets", icon: Ticket },
  ]

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-card/95 backdrop-blur-xl border-b border-border flex items-center px-4 gap-3 shrink-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg hover:bg-elevated transition-colors text-text-muted hover:text-text"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href={`/${locale}/dashboard`} className="text-base font-bold font-display tracking-tight">
          Night<span className="gradient-text">Claw</span>
        </Link>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 md:w-60 bg-card border-r border-border flex flex-col shrink-0 min-h-screen transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo + close */}
        <div className="h-14 flex items-center px-5 shrink-0 border-b border-border">
          <Link href={`/${locale}/dashboard`} className="text-lg font-bold font-display tracking-tight flex-1">
            Night<span className="gradient-text">Claw</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-elevated transition-colors text-text-muted"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Guild list */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {guilds.length === 0 && (
            <p className="text-xs text-text-muted text-center py-8 px-4">
              {t("sidebar.noServers")}
            </p>
          )}

          {guilds.map((guild) => {
            const isActive = guild.id === activeGuildId
            return (
              <div key={guild.id} className="mb-0.5">
                <Link
                  href={`/${locale}/dashboard/${guild.id}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent/10 text-accent border-l-2 border-accent -ml-0.5 pl-[11px]"
                      : "text-text-muted hover:bg-elevated hover:text-text"
                  }`}
                >
                  {guild.icon ? (
                    <Image
                      src={iconUrl(guild.id, guild.icon)}
                      alt={guild.name}
                      width={24}
                      height={24}
                      className="rounded-full shrink-0 ring-1 ring-border"
                    />
                  ) : (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isActive ? "bg-accent/20 text-accent" : "bg-elevated text-text-muted"
                    }`}>
                      {guild.name[0]}
                    </div>
                  )}
                  <span className="truncate flex-1">{guild.name}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />}
                </Link>

                {/* Sub-nav for active guild */}
                {isActive && (
                  <div className="mt-0.5 ml-4 pl-4 border-l border-accent/25 space-y-0.5 mb-1">
                    {SUB_NAV.map(({ label, segment, icon: Icon }) => {
                      const href = `/${locale}/dashboard/${guild.id}${segment}`
                      const isSubActive = pathname === href
                      return (
                        <Link
                          key={segment}
                          href={href}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                            isSubActive
                              ? "text-accent font-semibold bg-accent/8"
                              : "text-text-muted hover:text-text hover:bg-elevated/60"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          {label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="p-2 shrink-0 border-t border-border">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            {userImage ? (
              <Image src={userImage} alt={userName} width={28} height={28} className="rounded-full shrink-0 ring-1 ring-border" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold shrink-0 text-accent">
                {userName[0]}
              </div>
            )}
            <span className="text-sm font-medium truncate flex-1 text-text">
              {userName}
            </span>
          </div>
          <div className="px-3 py-1.5 mb-0.5">
            <LanguageSelector />
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text hover:bg-elevated transition-all"
          >
            <ArrowUpLeft className="h-4 w-4 shrink-0" />
            {t("sidebar.backToWebsite")}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-text-muted hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {t("sidebar.signOut")}
          </button>
        </div>
      </aside>
    </>
  )
}
