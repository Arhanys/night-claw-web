"use client"

import { useRouter, usePathname } from "next/navigation"
import { Globe, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const languages = [
  { code: "en", label: "EN", name: "English", flag: "🇺🇸" },
  { code: "fr", label: "FR", name: "Français", flag: "🇫🇷" },
]

export default function LanguageSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentLocale = pathname.split("/")[1] || "en"
  const current = languages.find((l) => l.code === currentLocale) ?? languages[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (code: string) => {
    const segments = pathname.split("/")
    segments[1] = code
    router.push(segments.join("/"))
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 p-2 rounded-lg text-text-muted hover:text-text hover:bg-elevated transition-all"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="text-xs font-medium">{current.label}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-36 bg-card border border-border rounded-xl shadow-lg shadow-black/20 overflow-hidden z-50 py-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors ${
                lang.code === currentLocale
                  ? "text-text bg-elevated"
                  : "text-text-muted hover:text-text hover:bg-elevated"
              }`}
            >
              <span>{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
