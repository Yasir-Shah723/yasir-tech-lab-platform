import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Briefcase, Plus, Trash2, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';

const AdminExperience = () => {
  const [data, setData] = useState({ experiences: [], education: [], skills: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Experience Modal
  const [showExpModal, setShowExpModal] = useState(false);
  const [expForm, setExpForm] = useState({
    company: '',
    role: '',
    employmentType: 'Virtual Internship',
    duration: '',
    technologies: '',
    highlights: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/profile');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load background data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteExp = async (id, role) => {
    if (!window.confirm(`Delete experience: ${role}?`)) return;
    try {
      const res = await api.delete(`/profile/experience/${id}`);
      if (res.data.success) {
        setData((prev) => ({
          ...prev,
          experiences: prev.experiences.filter((e) => e._id !== id),
        }));
        showToast('Experience deleted');
      }
    } catch (err) {
      setError('Failed to delete experience');
    }
  };

  const handleCreateExp = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...expForm,
        technologies: expForm.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        highlights: expForm.highlights.split('\n').map((h) => h.trim()).filter(Boolean),
      };

      const res = await api.post('/profile/experience', payload);
      if (res.data.success) {
        setShowExpModal(false);
        setExpForm({ company: '', role: '', employmentType: 'Virtual Internship', duration: '', technologies: '', highlights: '' });
        showToast('Experience added successfully');
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add experience');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Experience & Career Background</h1>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
            Manage your employment history, academic records, and technical skills matrix.
          </p>
        </div>

        <button
          onClick={() => setShowExpModal(true)}
          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium inline-flex items-center gap-2 shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
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
        <div className="space-y-4">
          <h2 className="text-base font-bold text-light-text dark:text-dark-text">Logged Experiences</h2>
          <div className="grid grid-cols-1 gap-4">
            {data.experiences.map((exp) => (
              <div
                key={exp._id}
                className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {exp.employmentType}
                  </span>
                  <h3 className="text-base font-bold mt-1">{exp.role}</h3>
                  <p className="text-xs text-light-muted dark:text-dark-muted">{exp.company} • {exp.duration}</p>
                </div>
                <button
                  onClick={() => handleDeleteExp(exp._id, exp.role)}
                  className="p-2 rounded-xl border border-light-border dark:border-dark-border hover:border-red-500/40 hover:bg-red-500/10 text-light-muted dark:text-dark-muted hover:text-red-500 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Experience */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg my-8 p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-light-border dark:border-dark-border mb-4">
              <h2 className="text-lg font-bold">Add Experience Entry</h2>
              <button onClick={() => setShowExpModal(false)} className="p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Company *</label>
                <input
                  type="text"
                  required
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  placeholder="e.g. DecodeLabs"
                  className="w-full px-3 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  placeholder="e.g. Full Stack Developer Intern"
                  className="w-full px-3 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Type</label>
                  <input
                    type="text"
                    value={expForm.employmentType}
                    onChange={(e) => setExpForm({ ...expForm, employmentType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={expForm.duration}
                    onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })}
                    placeholder="3 Months (July – Sept 2026)"
                    className="w-full px-3 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={expForm.technologies}
                  onChange={(e) => setExpForm({ ...expForm, technologies: e.target.value })}
                  placeholder="React, Node.js, Express, MongoDB"
                  className="w-full px-3 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Key Highlights (one per line)</label>
                <textarea
                  rows="3"
                  value={expForm.highlights}
                  onChange={(e) => setExpForm({ ...expForm, highlights: e.target.value })}
                  placeholder="Engineered full-stack features&#10;Built responsive interfaces"
                  className="w-full px-3 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpModal(false)}
                  className="px-4 py-2 rounded-xl border border-light-border dark:border-dark-border text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-medium cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExperience;