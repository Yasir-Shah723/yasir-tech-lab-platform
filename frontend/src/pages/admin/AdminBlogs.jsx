import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  BookOpen,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'MERN Stack',
    tags: '',
    published: true,
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blogs/admin/all');
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleTogglePublish = async (id) => {
    try {
      const res = await api.patch(`/blogs/admin/${id}/toggle-publish`);
      if (res.data.success) {
        setBlogs((prev) =>
          prev.map((b) => (b._id === id ? { ...b, published: res.data.data.published } : b))
        );
        showToast(res.data.message);
      }
    } catch (err) {
      setError('Failed to update article status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete article: "${title}"?`)) return;

    try {
      const res = await api.delete(`/blogs/admin/${id}`);
      if (res.data.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        showToast('Article deleted');
      }
    } catch (err) {
      setError('Failed to delete article');
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      summary: '',
      content: '',
      category: 'MERN Stack',
      tags: '',
      published: true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const payload = {
        ...formData,
        tags: tagsArray,
      };

      if (editingId) {
        const res = await api.put(`/blogs/admin/${editingId}`, payload);
        if (res.data.success) {
          showToast('Article updated');
        }
      } else {
        const res = await api.post('/blogs/admin', payload);
        if (res.data.success) {
          showToast('Article created');
        }
      }

      setShowModal(false);
      fetchBlogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save article');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog & Articles Management</h1>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
            Publish technical tutorials, engineering insights, and web security notes.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium inline-flex items-center gap-2 shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
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
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {blog.category}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      blog.published
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}
                  >
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-light-muted dark:text-dark-muted font-medium">
                    {blog.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold">{blog.title}</h3>
                <p className="text-xs text-light-muted dark:text-dark-muted line-clamp-1">
                  {blog.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleTogglePublish(blog._id)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    blog.published
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                      : 'border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-emerald-500'
                  }`}
                  title={blog.published ? 'Move to Drafts' : 'Publish Article'}
                >
                  {blog.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleDelete(blog._id, blog.title)}
                  className="p-2 rounded-xl border border-light-border dark:border-dark-border hover:border-red-500/40 hover:bg-red-500/10 text-light-muted dark:text-dark-muted hover:text-red-500 transition-all cursor-pointer"
                  title="Delete Article"
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
          <div className="w-full max-w-2xl my-8 p-6 md:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-light-border dark:border-dark-border mb-6">
              <h2 className="text-lg font-bold">Write New Technical Article</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 cursor-pointer text-light-muted dark:text-dark-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Solving Race Conditions in Node.js"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="MERN Stack">MERN Stack</option>
                    <option value="Web Security">Web Security</option>
                    <option value="Performance">Performance</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Databases">Databases</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="React, Express, JWT, MongoDB"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Summary / Overview * (Max 300 chars)
                </label>
                <textarea
                  rows="2"
                  required
                  maxLength={300}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Brief summary of the article..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Article Body * (Markdown / Structured Text)
                </label>
                <textarea
                  rows="8"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write complete article content here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="pub" className="text-xs font-medium cursor-pointer">
                  Publish immediately to public website
                </label>
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
                  {submitting ? 'Publishing...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;