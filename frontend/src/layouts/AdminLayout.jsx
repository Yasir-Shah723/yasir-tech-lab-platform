import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  FileQuestion,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Services', path: '/admin/services', icon: Briefcase },
    { label: 'Experience', path: '/admin/experience', icon: GraduationCap },
    { label: 'Certificates', path: '/admin/certificates', icon: Award },
    { label: 'Messages', path: '/admin/messages', icon: Mail },
    { label: 'Quote Requests', path: '/admin/quotes', icon: FileQuestion },
    { label: 'Settings & Bio', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 border-r border-light-border dark:border-dark-border bg-white dark:bg-dark-surface p-5 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between pb-6 border-b border-light-border dark:border-dark-border mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary/30">
                YTL
              </div>
              <div>
                <h2 className="font-bold text-sm leading-tight">Admin Console</h2>
                <p className="text-[10px] text-light-muted dark:text-dark-muted">v1.0.0 Production</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg border border-light-border dark:border-dark-border cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                        : 'text-light-muted dark:text-dark-muted hover:bg-light-bg dark:hover:bg-dark-card hover:text-light-text dark:hover:text-dark-text'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-light-border dark:border-dark-border space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-light-muted dark:text-dark-muted hover:text-primary transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> View Live Website
            </span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 px-6 border-b border-light-border dark:border-dark-border bg-white/50 dark:bg-dark-surface/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <span className="text-xs text-light-muted dark:text-dark-muted">Signed in as: </span>
            <span className="text-xs font-semibold text-light-text dark:text-dark-text">{user?.email}</span>
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-card hover:border-primary transition-all text-xs flex items-center gap-2 cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-500" />
                  <span className="hidden md:inline">Dark</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;