'use client';

import { Sun, Moon } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-5 h-5 text-yellow-400/60" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-blue-400/60" />
          Dark Mode
        </>
      )}
    </button>
  );
}
