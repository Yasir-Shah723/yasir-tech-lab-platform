import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { Sun, Moon, ShieldCheck, Terminal, ArrowRight, Lock } from 'lucide-react';

import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Public landing placeholder while we construct backend models
const PublicHome = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 md:p-12">
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

        <div className="flex items-center gap-3">
          <Link
            to="/admin/login"
            className="p-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card hover:border-primary transition-all flex items-center gap-2 text-xs font-medium"
          >
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Admin Login</span>
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card hover:border-primary transition-all flex items-center gap-2 text-xs font-medium cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto w-full my-auto text-center py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Full Stack Architecture In Progress
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
          I Build Modern Digital Experiences That Grow Businesses.
        </h2>

        <p className="text-light-muted dark:text-dark-muted text-base md:text-lg mb-8 max-w-xl mx-auto">
          I'm Yasir, a Full Stack Developer helping businesses, startups and individuals turn ideas into fast, modern and reliable web applications.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/admin/login"
            className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium text-sm inline-flex items-center gap-2 shadow-lg shadow-primary/25 transition-all cursor-pointer"
          >
            <span>Enter Admin Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-light-muted dark:text-dark-muted py-4 border-t border-light-border dark:border-dark-border">
        © {new Date().getFullYear()} Yasir Tech Lab — Syed Yasir Shah. All rights reserved.
      </footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Future admin sections will be nested here */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<PublicHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;