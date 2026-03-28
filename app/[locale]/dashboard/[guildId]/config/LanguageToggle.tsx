"use client"

import { useState } from "react"

export function LanguageToggle({
  defaultValue,
  readOnly,
}: {
  defaultValue: string | null
  readOnly: boolean
}) {
  const [value, setValue] = useState<"en" | "fr">(
    defaultValue === "fr" ? "fr" : "en"
  )

  return (
    <div className="flex items-center gap-2">
      <input type="hidden" name="language" value={value} />
      <div className={`flex rounded-lg border border-border bg-elevated p-0.5 ${readOnly ? "opacity-60" : ""}`}>
        {(["en", "fr"] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && setValue(lang)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              value === lang
                ? "bg-accent text-white shadow-sm"
                : "text-text/50 hover:text-text disabled:hover:text-text/50"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
