import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Briefcase,
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

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    category: 'Full Stack',
    icon: 'Layers',
    priceType: 'starting_at',
    startingPrice: 0,
    deliverables: '',
    active: true,
  });

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/services/admin/all');
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleToggleActive = async (id) => {
    try {
      const res = await api.patch(`/services/admin/${id}/toggle-active`);
      if (res.data.success) {
        setServices((prev) =>
          prev.map((s) => (s._id === id ? { ...s, active: res.data.data.active } : s))
        );
        showToast(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete service "${title}"?`)) return;

    try {
      const res = await api.delete(`/services/admin/${id}`);
      if (res.data.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
        showToast('Service deleted successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleOpenEdit = (service) => {
    setEditingId(service._id);
    setFormData({
      title: service.title,
      shortDescription: service.shortDescription,
      category: service.category,
      icon: service.icon,
      priceType: service.priceType,
      startingPrice: service.startingPrice || 0,
      deliverables: (service.deliverables || []).join('\n'),
      active: service.active,
    });
    setShowModal(true);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      shortDescription: '',
      category: 'Full Stack',
      icon: 'Layers',
      priceType: 'starting_at',
      startingPrice: 150,
      deliverables: '',
      active: true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const deliverablesArray = formData.deliverables
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    try {
      const payload = {
        ...formData,
        deliverables: deliverablesArray,
        startingPrice: Number(formData.startingPrice),
      };

      if (editingId) {
        const res = await api.put(`/services/admin/${editingId}`, payload);
        if (res.data.success) {
          showToast('Service updated successfully');
        }
      } else {
        const res = await api.post('/services/admin', payload);
        if (res.data.success) {
          showToast('Service created successfully');
        }
      }

      setShowModal(false);
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services Management</h1>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
            Configure your development services catalog, pricing tiers, and deliverables.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium inline-flex items-center gap-2 shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Alerts */}
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

      {/* Services List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm text-light-muted dark:text-dark-muted">Loading services from database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {service.category}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      service.active
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}
                  >
                    {service.active ? 'Active / Visible' : 'Hidden'}
                  </span>
                  <span className="text-xs font-bold text-light-text dark:text-dark-text ml-2">
                    {service.priceType === 'custom_quote'
                      ? 'Request a Quote'
                      : `Starting at $${service.startingPrice}`}
                  </span>
                </div>

                <h3 className="text-base font-bold tracking-tight">{service.title}</h3>
                <p className="text-xs text-light-muted dark:text-dark-muted line-clamp-1">
                  {service.shortDescription}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(service)}
                  title="Edit Service"
                  className="p-2 rounded-xl border border-light-border dark:border-dark-border hover:border-primary text-light-muted dark:text-dark-muted hover:text-primary transition-all cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleToggleActive(service._id)}
                  title={service.active ? 'Hide Service' : 'Show Service'}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    service.active
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                      : 'border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-emerald-500'
                  }`}
                >
                  {service.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleDelete(service._id, service.title)}
                  title="Delete Service"
                  className="p-2 rounded-xl border border-light-border dark:border-dark-border hover:border-red-500/40 hover:bg-red-500/10 text-light-muted dark:text-dark-muted hover:text-red-500 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl my-8 p-6 md:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-light-border dark:border-dark-border mb-6">
              <h2 className="text-lg font-bold">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. MERN Full Stack Development"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Short Description * (Max 300 chars)
                </label>
                <textarea
                  rows="2"
                  required
                  maxLength={300}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
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
                    <option value="Frontend">Frontend</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="Backend & APIs">Backend & APIs</option>
                    <option value="Maintenance & Support">Maintenance & Support</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Icon Name
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Layout">Layout (Frontend / UI)</option>
                    <option value="Layers">Layers (Full Stack)</option>
                    <option value="ShoppingCart">ShoppingCart (E-Commerce)</option>
                    <option value="Calendar">Calendar (Bookings)</option>
                    <option value="Server">Server (APIs / Databases)</option>
                    <option value="Bug">Bug (Fixing / Maintenance)</option>
                    <option value="Code2">Code2 (General Code)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Pricing Model *
                  </label>
                  <select
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="starting_at">Starting At ($)</option>
                    <option value="custom_quote">Request a Quote</option>
                    <option value="fixed">Fixed Price ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Starting Price ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={formData.priceType === 'custom_quote'}
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Deliverables (One per line)
                </label>
                <textarea
                  rows="4"
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  placeholder="Responsive layout across all screens&#10;Clean REST API integration&#10;Database schema modeling"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="active" className="text-xs font-medium cursor-pointer">
                  Service active and visible on public website
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-light-border dark:border-dark-border">
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
                  {submitting ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;