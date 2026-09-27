import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  MessageSquareQuote,
  Plus,
  Star,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: 'Business Owner',
    company: '',
    content: '',
    rating: 5,
    projectRef: '',
    published: true,
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await api.get('/testimonials/admin/all');
      if (res.data.success) {
        setTestimonials(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleTogglePublish = async (id) => {
    try {
      const res = await api.patch(`/testimonials/admin/${id}/toggle-publish`);
      if (res.data.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t._id === id ? { ...t, published: res.data.data.published } : t))
        );
        showToast(res.data.message);
      }
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;

    try {
      const res = await api.delete(`/testimonials/admin/${id}`);
      if (res.data.success) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
        showToast('Review removed');
      }
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/testimonials/admin', formData);
      if (res.data.success) {
        showToast('Testimonial saved');
        setShowModal(false);
        setFormData({
          clientName: '',
          clientRole: 'Business Owner',
          company: '',
          content: '',
          rating: 5,
          projectRef: '',
          published: true,
        });
        fetchTestimonials();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Testimonials Management</h1>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
            Manage genuine client reviews and testimonials.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium inline-flex items-center gap-2 shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Genuine Review</span>
        </button>
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

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-2">
          <MessageSquareQuote className="w-10 h-10 text-light-muted dark:text-dark-muted mx-auto opacity-30" />
          <p className="text-sm font-semibold">No Client Testimonials Yet</p>
          <p className="text-xs text-light-muted dark:text-dark-muted max-w-sm mx-auto">
            The public website is currently displaying the honest "Client Collaboration & Standards" banner. Add reviews here as clients deliver feedback.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      t.published
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}
                  >
                    {t.published ? 'Published' : 'Hidden'}
                  </span>
                  {t.projectRef && (
                    <span className="text-xs text-light-muted dark:text-dark-muted">
                      ({t.projectRef})
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold">
                  {t.clientName} <span className="text-xs font-normal text-light-muted dark:text-dark-muted">• {t.clientRole}</span>
                </h3>
                <p className="text-xs text-light-muted dark:text-dark-muted line-clamp-2">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleTogglePublish(t._id)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    t.published
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                      : 'border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-emerald-500'
                  }`}
                  title={t.published ? 'Hide Testimonial' : 'Publish Testimonial'}
                >
                  {t.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleDelete(t._id, t.clientName)}
                  className="p-2 rounded-xl border border-light-border dark:border-dark-border hover:border-red-500/40 hover:bg-red-500/10 text-light-muted dark:text-dark-muted hover:text-red-500 transition-all cursor-pointer"
                  title="Delete Testimonial"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg my-8 p-6 md:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-light-border dark:border-dark-border mb-6">
              <h2 className="text-lg font-bold">Add Genuine Client Review</h2>
              <button onClick={() => setShowModal(false)} className="p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Ahmad Khan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    value={formData.clientRole}
                    onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                    placeholder="e.g. Managing Director"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Islamabad Properties"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Project Reference
                  </label>
                  <input
                    type="text"
                    value={formData.projectRef}
                    onChange={(e) => setFormData({ ...formData, projectRef: e.target.value })}
                    placeholder="e.g. Booking Engine"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Rating (1 to 5)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={5}>5 Stars (★★★★★)</option>
                    <option value={4}>4 Stars (★★★★☆)</option>
                    <option value={3}>3 Stars (★★★☆☆)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Client Feedback / Content * (Max 600 chars)
                </label>
                <textarea
                  rows="4"
                  required
                  maxLength={600}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Paste genuine feedback provided by the client..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-light-border dark:border-dark-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border text-sm font-medium hover:bg-light-bg dark:hover:bg-dark-card cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Add Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;