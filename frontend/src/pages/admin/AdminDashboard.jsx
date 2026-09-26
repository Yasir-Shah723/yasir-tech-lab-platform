import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FolderGit2, Mail, FileQuestion, Briefcase, Plus, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();

  const statCards = [
    { title: 'Total Projects', count: '4', subtext: 'Ready for MongoDB sync', icon: FolderGit2, to: '/admin/projects' },
    { title: 'New Messages', count: '0', subtext: 'Client contact inquiries', icon: Mail, to: '/admin/messages' },
    { title: 'Quote Requests', count: '0', subtext: 'Commercial project briefs', icon: FileQuestion, to: '/admin/quotes' },
    { title: 'Active Services', count: '14', subtext: 'Web solutions catalog', icon: Briefcase, to: '/admin/services' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Admin Console Operational
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {user?.username || 'Yasir'}
          </h1>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
            System authenticated: Full administrative control over projects, services, and inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium inline-flex items-center gap-2 shadow-md shadow-primary/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Projects</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.to}
              className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-light-muted dark:text-dark-muted group-hover:text-primary transition-colors" />
              </div>
              <div className="text-2xl font-bold tracking-tight mb-1">{card.count}</div>
              <div className="text-sm font-medium text-light-text dark:text-dark-text">{card.title}</div>
              <div className="text-xs text-light-muted dark:text-dark-muted mt-0.5">{card.subtext}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;