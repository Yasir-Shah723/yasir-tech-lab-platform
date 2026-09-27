import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import MediaUpload from '../../components/common/MediaUpload';
import {
  Award,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    issuingOrganization: '',
    issueDate: '',
    credentialUrl: '',
    imageUrl: '',
    description: '',
  });

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await api.get('/certificates');
      if (res.data.success) {
        setCertificates(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete certificate: "${title}"?`)) return;

    try {
      const res = await api.delete(`/certificates/admin/${id}`);
      if (res.data.success) {
        setCertificates((prev) => prev.filter((c) => c._id !== id));
        showToast('Certificate removed');
      }
    } catch (err) {
      setError('Failed to delete certificate');
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      issuingOrganization: '',
      issueDate: '',
      credentialUrl: '',
      imageUrl: '',
      description: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        issuingOrganization: formData.issuingOrganization,
        issueDate: formData.issueDate,
        credentialUrl: formData.credentialUrl,
        certificateImage: {
          url: formData.imageUrl,
          alt: `${formData.title} credential verification`,
        },
        description: formData.description,
      };

      if (editingId) {
        const res = await api.put(`/certificates/admin/${editingId}`, payload);
        if (res.data.success) {
          showToast('Certificate updated');
        }
      } else {
        const res = await api.post('/certificates/admin', payload);
        if (res.data.success) {
          showToast('Certificate added');
        }
      }

      setShowModal(false);
      fetchCertificates();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save certificate');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certificates & Credentials</h1>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
            Manage your verified certifications, upload images/PDF documents, and manage URLs.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium inline-flex items-center gap-2 shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
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
          {certificates.map((cert) => {
            const hasMedia = cert.certificateImage && cert.certificateImage.url;
            const isPdf = hasMedia && cert.certificateImage.url.toLowerCase().endsWith('.pdf');

            return (
              <div
                key={cert._id}
                className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail / Media icon preview */}
                  {hasMedia ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg flex items-center justify-center">
                      {isPdf ? (
                        <FileText className="w-6 h-6 text-red-500" />
                      ) : (
                        <img
                          src={cert.certificateImage.url}
                          alt={cert.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl shrink-0 border border-dashed border-light-border dark:border-dark-border flex items-center justify-center text-light-muted dark:text-dark-muted">
                      <Award className="w-6 h-6 opacity-40" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {cert.issueDate}
                      </span>
                      <span className="text-xs font-semibold text-light-muted dark:text-dark-muted">
                        {cert.issuingOrganization}
                      </span>
                    </div>
                    <h3 className="text-base font-bold">{cert.title}</h3>
                    <p className="text-xs text-light-muted dark:text-dark-muted line-clamp-1">
                      {cert.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  {hasMedia && (
                    <a
                      href={cert.certificateImage.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl border border-light-border dark:border-dark-border hover:border-primary text-light-muted dark:text-dark-muted hover:text-primary transition-all"
                      title="View Attached File"
                    >
                      {isPdf ? <FileText className="w-4 h-4 text-red-500" /> : <ImageIcon className="w-4 h-4" />}
                    </a>
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl border border-light-border dark:border-dark-border hover:border-primary text-light-muted dark:text-dark-muted hover:text-primary transition-all"
                      title="View Credential URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDelete(cert._id, cert.title)}
                    className="p-2 rounded-xl border border-light-border dark:border-dark-border hover:border-red-500/40 hover:bg-red-500/10 text-light-muted dark:text-dark-muted hover:text-red-500 transition-all cursor-pointer"
                    title="Delete Certificate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg my-8 p-6 md:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-light-border dark:border-dark-border mb-6">
              <h2 className="text-lg font-bold">{editingId ? 'Edit Certificate' : 'Add Certificate'}</h2>
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
                  Certificate Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Google Cybersecurity Professional Certificate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.issuingOrganization}
                    onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                    placeholder="e.g. Google / DecodeLabs"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Issue Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    placeholder="e.g. August 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Credential Verification URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://coursera.org/verify/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Media Upload: Accepts images and PDF files */}
              <MediaUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                label="Certificate Document / Image"
              />

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Description of Validated Skills (Max 400 chars)
                </label>
                <textarea
                  rows="3"
                  maxLength={400}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of modules, technical skills, or frameworks covered..."
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
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Add Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;