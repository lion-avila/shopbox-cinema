import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const THEME_STORAGE_KEY = 'shopbox_cinema_theme_v1';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

interface BrandLogoProps {
  className?: string;
  alt?: string;
  forceVariant?: 'white' | 'black';
}

/**
 * Renders the pure Shopbox Cinema emblem without any enclosing box,
 * automatically switching between logo-white.svg (dark mode) and logo-black.svg (light mode).
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'w-9 h-9',
  alt = 'Shopbox Cinema',
  forceVariant,
}) => {
  const { theme } = useTheme();
  const variant = forceVariant || (theme === 'dark' ? 'white' : 'black');

  return (
    <img
      src={variant === 'white' ? '/assets/logo-white.svg' : '/assets/logo-black.svg'}
      alt={alt}
      className={`${className} object-contain shrink-0 select-none`}
    />
  );
};

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false, className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      title={`Current: ${theme === 'dark' ? 'Screening Room Dark' : 'Archival Paper Light'} — Click to switch`}
      className={`inline-flex items-center space-x-2 px-2.5 py-2 border border-[var(--border-subtle)] hover:border-[var(--accent-brass)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono text-[11px] uppercase tracking-wider transition-all active:scale-95 ${className}`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
          {!compact && <span className="hidden lg:inline">Light</span>}
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-[#9A7428] shrink-0" />
          {!compact && <span className="hidden lg:inline">Dark</span>}
        </>
      )}
    </button>
  );
};
