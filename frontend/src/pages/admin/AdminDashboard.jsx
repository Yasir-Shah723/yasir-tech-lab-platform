import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  FolderGit2,
  Briefcase,
  Award,
  BookOpen,
  Mail,
  FileQuestion,
  ArrowRight,
  Loader2,
  ExternalLink,
  User,
} from 'lucide-react';

const AdminDashboard = () => {
  // Read logged-in admin user info from localStorage
  const storedUser = JSON.parse(
    localStorage.getItem('adminUser') || localStorage.getItem('user') || '{}'
  );
  const adminName = storedUser.name || storedUser.email || 'Syed Yasir Shah';

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalServices: 0,
    totalCertificates: 0,
    totalBlogs: 0,
    unreadMessages: 0,
    totalMessages: 0,
    totalTestimonials: 0,
    pendingQuotes: 0,
    totalQuotes: 0,
    recentMessages: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/auth/admin/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Unread Messages',
      value: stats.unreadMessages || 0,
      subtitle: `${stats.totalMessages || 0} total received`,
      icon: Mail,
      link: '/admin/messages',
      highlight: (stats.unreadMessages || 0) > 0,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Quote Requests',
      value: stats.pendingQuotes || 0,
      subtitle: `${stats.totalQuotes || 0} total briefs`,
      icon: FileQuestion,
      link: '/admin/quotes',
      highlight: (stats.pendingQuotes || 0) > 0,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Projects',
      value: stats.totalProjects || 0,
      subtitle: 'Engineered case studies',
      icon: FolderGit2,
      link: '/admin/projects',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Services',
      value: stats.totalServices || 0,
      subtitle: 'Development offerings',
      icon: Briefcase,
      link: '/admin/services',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Certificates',
      value: stats.totalCertificates || 0,
      subtitle: 'Verified credentials',
      icon: Award,
      link: '/admin/certificates',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Articles',
      value: stats.totalBlogs || 0,
      subtitle: 'Published insights',
      icon: BookOpen,
      link: '/admin/blogs',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-xs text-light-muted dark:text-dark-muted">Loading live database metrics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Welcome Banner with Signed In Admin Info */}
      <div className="p-6 sm:p-8 rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-light-muted dark:text-dark-muted mb-1">
            <User className="w-3.5 h-3.5 text-primary" />
           <span>Signed in as:</span>
            <span className="font-bold text-light-text dark:text-dark-text text-primary">
              {adminName}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">System Overview</h1>
          <p className="text-xs sm:text-sm text-light-muted dark:text-dark-muted">
            Live telemetry, content tallies, and pending communications across Yasir Tech Lab.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border hover:border-primary text-xs font-semibold inline-flex items-center gap-2 transition-all"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group hover:shadow-md ${
                card.highlight
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/30'
                  : 'border-light-border dark:border-dark-border bg-white dark:bg-dark-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-light-muted dark:text-dark-muted truncate">
                  {card.label}
                </span>
                <div className={`w-8 h-8 rounded-xl ${card.bgColor} ${card.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <p className="text-3xl font-extrabold tracking-tight">{card.value}</p>
                <p className="text-[11px] text-light-muted dark:text-dark-muted mt-1 truncate">
                  {card.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-light-border dark:border-dark-border flex items-center justify-between text-[11px] font-semibold text-primary">
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Messages Activity Box */}
      <div className="p-6 sm:p-8 rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold tracking-tight">Recent Inquiries</h2>
          </div>
          <Link
            to="/admin/messages"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>View All Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentMessages.length === 0 ? (
          <p className="text-xs text-light-muted dark:text-dark-muted py-6 text-center">
            No inquiries received yet.
          </p>
        ) : (
          <div className="divide-y divide-light-border dark:divide-dark-border">
            {stats.recentMessages.map((msg) => (
              <div key={msg._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        msg.status === 'unread'
                          ? 'bg-primary text-white'
                          : 'bg-light-bg dark:bg-dark-bg text-light-muted dark:text-dark-muted'
                      }`}
                    >
                      {msg.status}
                    </span>
                    <strong className="text-xs">{msg.name}</strong>
                    <span className="text-xs text-light-muted dark:text-dark-muted">({msg.email})</span>
                  </div>
                  <p className="text-xs text-light-muted dark:text-dark-muted line-clamp-1">
                    {msg.subject}: {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs text-light-muted dark:text-dark-muted">
                  <span className="text-[11px]">
                    {new Date(msg.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <Link
                    to="/admin/messages"
                    className="px-2.5 py-1 rounded-lg border border-light-border dark:border-dark-border hover:border-primary text-xs font-medium text-light-text dark:text-dark-text"
                  >
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;