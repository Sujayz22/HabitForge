import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"

export type Theme = "system" | "dark" | "light"

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  /** The resolved mode that's actually applied (never "system") */
  resolvedTheme: "dark" | "light"
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "habitforge-theme"
const MQ = "(prefers-color-scheme: dark)"

function getSystemPref(): "dark" | "light" {
  return window.matchMedia(MQ).matches ? "dark" : "light"
}

function applyToDOM(resolved: "dark" | "light") {
  const root = document.documentElement
  if (resolved === "light") {
    root.classList.add("light")
  } else {
    root.classList.remove("light")
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "dark" || stored === "light" || stored === "system") return stored
    return "system"
  })

  const [systemPref, setSystemPref] = useState<"dark" | "light">(getSystemPref)

  const resolved: "dark" | "light" = theme === "system" ? systemPref : theme

  // Listen for OS theme changes
  useEffect(() => {
    const mql = window.matchMedia(MQ)
    const handler = (e: MediaQueryListEvent) => setSystemPref(e.matches ? "dark" : "light")
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  // Apply to DOM whenever resolved theme changes
  useEffect(() => {
    applyToDOM(resolved)
  }, [resolved])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem(STORAGE_KEY, t)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme: resolved }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>")
  return ctx
}
