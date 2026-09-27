import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  FileQuestion,
  Search,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Phone,
  Building,
  Reply,
  DollarSign,
  Clock,
  Sparkles,
} from 'lucide-react';

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/quotes/admin/all?status=${statusFilter}&search=${search}`);
      if (res.data.success) {
        setQuotes(res.data.data);
        setPendingCount(res.data.pendingCount || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter]);

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.patch(`/quotes/admin/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setQuotes((prev) =>
          prev.map((q) => (q._id === id ? { ...q, status: newStatus } : q))
        );
        showToast(`Quote marked as ${newStatus}`);
      }
    } catch (err) {
      setError('Failed to update quote status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete project quote from "${name}"?`)) return;

    try {
      const res = await api.delete(`/quotes/admin/${id}`);
      if (res.data.success) {
        setQuotes((prev) => prev.filter((q) => q._id !== id));
        showToast('Quote deleted');
      }
    } catch (err) {
      setError('Failed to delete quote');
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    const term = search.toLowerCase();
    return (
      q.clientName.toLowerCase().includes(term) ||
      q.email.toLowerCase().includes(term) ||
      q.projectType.toLowerCase().includes(term) ||
      q.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">Project Quote Requests</h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                {pendingCount} pending review
              </span>
            )}
          </div>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
            Scoped project estimate briefs submitted through the interactive estimation modal.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'pending', 'reviewed', 'estimated', 'declined'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-light-muted dark:text-dark-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search briefs..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Quote List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-2">
          <FileQuestion className="w-10 h-10 text-light-muted dark:text-dark-muted mx-auto opacity-30" />
          <p className="text-sm font-semibold">No project quote requests found</p>
          <p className="text-xs text-light-muted dark:text-dark-muted">
            Incoming custom architecture requests will be organized here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredQuotes.map((q) => (
            <div
              key={q._id}
              className={`p-6 rounded-2xl border transition-all space-y-4 ${
                q.status === 'pending'
                  ? 'bg-white dark:bg-dark-card border-amber-500/50 shadow-sm'
                  : 'bg-white/80 dark:bg-dark-card/60 border-light-border dark:border-dark-border opacity-90'
              }`}
            >
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-light-border dark:border-dark-border pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      q.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : q.status === 'estimated'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : q.status === 'reviewed'
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}
                  >
                    {q.status}
                  </span>
                  <span className="text-xs font-bold text-light-text dark:text-dark-text">
                    {q.projectType}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-light-muted dark:text-dark-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(q.createdAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>

              {/* Client & Scope Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-3 rounded-xl bg-light-bg/50 dark:bg-dark-bg/60 border border-light-border dark:border-dark-border">
                <div>
                  <span className="text-light-muted dark:text-dark-muted block text-[10px] font-semibold uppercase">Client</span>
                  <strong className="text-light-text dark:text-dark-text">{q.clientName}</strong>
                </div>

                <div>
                  <span className="text-light-muted dark:text-dark-muted block text-[10px] font-semibold uppercase">Budget Band</span>
                  <span className="font-semibold text-emerald-500">{q.budgetRange}</span>
                </div>

                <div>
                  <span className="text-light-muted dark:text-dark-muted block text-[10px] font-semibold uppercase">Timeline</span>
                  <span className="font-medium text-light-text dark:text-dark-text">{q.timeline}</span>
                </div>

                <div>
                  <span className="text-light-muted dark:text-dark-muted block text-[10px] font-semibold uppercase">Email</span>
                  <a
                    href={`mailto:${q.email}?subject=Project Estimate: ${encodeURIComponent(q.projectType)}`}
                    className="text-primary hover:underline font-mono truncate block"
                  >
                    {q.email}
                  </a>
                </div>
              </div>

              {/* Features Selected */}
              {q.features && q.features.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-light-muted dark:text-dark-muted uppercase">
                    Requested Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {q.features.map((feat) => (
                      <span
                        key={feat}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Description */}
              <div className="p-4 rounded-xl bg-light-bg/60 dark:bg-dark-bg/60 text-xs sm:text-sm text-light-text dark:text-dark-text whitespace-pre-wrap leading-relaxed">
                {q.description}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${q.email}?subject=Technical Estimate & Architecture Scope: ${encodeURIComponent(
                      q.projectType
                    )}&body=Hi ${encodeURIComponent(q.clientName)},%0D%0A%0D%0AThank you for reaching out regarding your project: ${encodeURIComponent(
                      q.projectType
                    )}.`}
                    onClick={() => handleStatusChange(q._id, 'estimated')}
                    className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Send Technical Estimate</span>
                  </a>

                  <select
                    value={q.status}
                    onChange={(e) => handleStatusChange(q._id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="estimated">Estimated</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <button
                  onClick={() => handleDelete(q._id, q.clientName)}
                  className="p-2 rounded-xl border border-light-border dark:border-dark-border hover:border-red-500/40 hover:bg-red-500/10 text-light-muted dark:text-dark-muted hover:text-red-500 transition-all cursor-pointer"
                  title="Delete Brief"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;