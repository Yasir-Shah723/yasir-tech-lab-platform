import React from 'react';
import { useTheme } from './context/ThemeContext';
import { Sun, Moon, ShieldCheck, Terminal, ExternalLink } from 'lucide-react';

function App() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 md:p-12">
      {/* Top Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-light-border dark:border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/30">
            YTL
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Yasir Tech Lab</h1>
            <p className="text-xs text-light-muted dark:text-dark-muted">Full Stack Web Solutions</p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card hover:border-primary transition-all flex items-center gap-2 text-sm font-medium"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>
      </header>

      {/* Verification Card */}
      <main className="max-w-2xl mx-auto w-full my-auto text-center py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Phase 5 Frontend Foundation Active
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          I Build Modern Digital Experiences That Grow Businesses.
        </h2>

        <p className="text-light-muted dark:text-dark-muted text-base md:text-lg mb-8 max-w-xl mx-auto">
          I'm Yasir, a Full Stack Developer helping businesses, startups and individuals turn ideas into fast, modern and reliable web applications.
        </p>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card">
            <div className="flex items-center gap-2 font-semibold mb-1 text-sm">
              <Terminal className="w-4 h-4 text-primary" />
              <span>Vite + React + Tailwind</span>
            </div>
            <p className="text-xs text-light-muted dark:text-dark-muted">
              Modern styling engine configured with responsive breakpoints and glass effects.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card">
            <div className="flex items-center gap-2 font-semibold mb-1 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Theme Persistence</span>
            </div>
            <p className="text-xs text-light-muted dark:text-dark-muted">
              Current mode: <strong className="capitalize">{theme}</strong> (saved in localStorage).
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-light-muted dark:text-dark-muted py-4 border-t border-light-border dark:border-dark-border">
        © {new Date().getFullYear()} Yasir Tech Lab — Syed Yasir Shah. All rights reserved.
      </footer>
    </div>
  );
}

export default App;