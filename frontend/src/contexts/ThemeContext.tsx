'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'corporate',
  setTheme: () => {}
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>('corporate');

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    document.documentElement.setAttribute('data-theme', newTheme);
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
      updateTheme(storedTheme);
    } else {
      const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      updateTheme(userPrefersDark ? 'business' : 'corporate');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};