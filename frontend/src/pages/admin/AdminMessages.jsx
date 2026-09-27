import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Mail,
  Search,
  Trash2,
  CheckCircle,
  Clock,
  Reply,
  Loader2,
  AlertCircle,
  Archive,
  Phone,
  Calendar,
} from 'lucide-react';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/contact/admin/all?status=${statusFilter}&search=${search}`);
      if (res.data.success) {
        setMessages(res.data.data);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inbox messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.patch(`/contact/admin/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
        );
        showToast(`Message marked as ${newStatus}`);
      }
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (id, senderName) => {
    if (!window.confirm(`Permanently delete message from "${senderName}"?`)) return;

    try {
      const res = await api.delete(`/contact/admin/${id}`);
      if (res.data.success) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        showToast('Message deleted');
      }
    } catch (err) {
      setError('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">Inquiries & Messages</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
            Incoming communication from the public contact form and quote requests.
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
          {['all', 'unread', 'read', 'replied', 'archived'].map((status) => (
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
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Message List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-2">
          <Mail className="w-10 h-10 text-light-muted dark:text-dark-muted mx-auto opacity-30" />
          <p className="text-sm font-semibold">No messages in this folder</p>
          <p className="text-xs text-light-muted dark:text-dark-muted">
            New contact submissions will be stored and organized here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg._id}
              className={`p-6 rounded-2xl border transition-all space-y-4 ${
                msg.status === 'unread'
                  ? 'bg-white dark:bg-dark-card border-primary/50 shadow-sm'
                  : 'bg-white/80 dark:bg-dark-card/60 border-light-border dark:border-dark-border opacity-90'
              }`}
            >
              {/* Top Meta Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-light-border dark:border-dark-border pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      msg.status === 'unread'
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : msg.status === 'replied'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}
                  >
                    {msg.status}
                  </span>
                  <span className="text-xs font-semibold text-light-muted dark:text-dark-muted">
                    {msg.subject}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-light-muted dark:text-dark-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(msg.createdAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>

              {/* Sender Details */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div>
                  <span className="text-light-muted dark:text-dark-muted font-medium">From: </span>
                  <strong className="text-light-text dark:text-dark-text">{msg.name}</strong>
                </div>
                <div>
                  <span className="text-light-muted dark:text-dark-muted font-medium">Email: </span>
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="text-primary hover:underline font-mono"
                  >
                    {msg.email}
                  </a>
                </div>
                {msg.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-500" />
                    <span className="font-mono">{msg.phone}</span>
                  </div>
                )}
              </div>

              {/* Message Body */}
              <div className="p-4 rounded-xl bg-light-bg/60 dark:bg-dark-bg/60 text-xs sm:text-sm text-light-text dark:text-dark-text whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    onClick={() => handleStatusChange(msg._id, 'replied')}
                    className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>

                  {msg.status === 'unread' ? (
                    <button
                      onClick={() => handleStatusChange(msg._id, 'read')}
                      className="px-3 py-1.5 rounded-xl border border-light-border dark:border-dark-border text-xs font-medium hover:border-primary transition-all cursor-pointer"
                    >
                      Mark as Read
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(msg._id, 'unread')}
                      className="px-3 py-1.5 rounded-xl border border-light-border dark:border-dark-border text-xs font-medium hover:border-primary transition-all cursor-pointer"
                    >
                      Mark as Unread
                    </button>
                  )}

                  {msg.status !== 'archived' && (
                    <button
                      onClick={() => handleStatusChange(msg._id, 'archived')}
                      className="px-3 py-1.5 rounded-xl border border-light-border dark:border-dark-border text-xs font-medium text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-all cursor-pointer"
                    >
                      <Archive className="w-3.5 h-3.5 inline mr-1" />
                      Archive
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(msg._id, msg.name)}
                  className="p-2 rounded-xl border border-light-border dark:border-dark-border hover:border-red-500/40 hover:bg-red-500/10 text-light-muted dark:text-dark-muted hover:text-red-500 transition-all cursor-pointer"
                  title="Delete Message"
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

export default AdminMessages;