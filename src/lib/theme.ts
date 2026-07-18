const THEME_STORAGE_KEY = "lms-theme";

export type Theme = "light" | "dark";

export function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/** Applies the persisted (or OS-preferred) theme; call once on app start. */
export function initTheme() {
  document.documentElement.classList.toggle("dark", getStoredTheme() === "dark");
}
