import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ImageUpload from '../../components/common/ImageUpload';
import {
  FolderGit2,
  Plus,
  Search,
  Star,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Code2,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
} from 'lucide-react';

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State for New Project
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    githubUrl: '',
    liveDemoUrl: '',
    category: 'Full Stack',
    projectType: 'Personal Project',
    technologies: '',
    thumbnailUrl: '',
    featured: false,
    published: true,
  });

  const categories = [
    'All',
    'Full Stack',
    'Frontend',
    'Backend',
    'Web Application',
    'E-Commerce',
    'Booking System',
  ];

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/projects/admin/all');
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTogglePublish = async (id) => {
    try {
      const res = await api.patch(`/projects/admin/${id}/toggle-publish`);
      if (res.data.success) {
        setProjects((prev) =>
          prev.map((p) => (p._id === id ? { ...p, published: res.data.data.published } : p))
        );
        showToast(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const res = await api.patch(`/projects/admin/${id}/toggle-featured`);
      if (res.data.success) {
        setProjects((prev) =>
          prev.map((p) => (p._id === id ? { ...p, featured: res.data.data.featured } : p))
        );
        showToast(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle featured status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await api.delete(`/projects/admin/${id}`);
      if (res.data.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
        showToast('Project deleted successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (techArray.length === 0) {
      setError('Please provide at least one technology (comma-separated)');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        technologies: techArray,
        thumbnail: {
          url: formData.thumbnailUrl,
          alt: `${formData.title} preview thumbnail`,
        },
      };

      const res = await api.post('/projects/admin', payload);
      if (res.data.success) {
        setShowModal(false);
        setFormData({
          title: '',
          shortDescription: '',
          githubUrl: '',
          liveDemoUrl: '',
          category: 'Full Stack',
          projectType: 'Personal Project',
          technologies: '',
          thumbnailUrl: '',
          featured: false,
          published: true,
        });
        showToast('Project created successfully');
        fetchProjects();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Management</h1>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
            Manage your real engineering case studies, toggle visibility, and update repositories.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium inline-flex items-center gap-2 shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Alert Banners */}
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-light-muted dark:text-dark-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat || (!selectedCategory && cat === 'All')
                  ? 'bg-primary text-white'
                  : 'border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Project List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm text-light-muted dark:text-dark-muted">Loading projects from MongoDB...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-light-border dark:border-dark-border bg-white dark:bg-dark-card">
          <FolderGit2 className="w-12 h-12 text-light-muted dark:text-dark-muted mx-auto mb-3 opacity-40" />
          <p className="text-base font-semibold">No projects found</p>
          <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
            {search ? 'Try adjusting your search criteria.' : 'Click "Add New Project" to add your first project.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="p-5 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-primary/40 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500" /> Featured
                    </span>
                  )}
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      project.published
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}
                  >
                    {project.published ? 'Live / Published' : 'Draft'}
                  </span>
                </div>

                <h3 className="text-lg font-bold tracking-tight">{project.title}</h3>
                <p className="text-xs text-light-muted dark:text-dark-muted line-clamp-2 max-w-3xl">
                  {project.shortDescription}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-light-border dark:border-dark-border">
                {/* GitHub link */}
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="View GitHub Repository"
                  className="p-2 rounded-xl border border-light-border dark:border-dark-border hover:border-primary text-light-muted dark:text-dark-muted hover:text-primary transition-all"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>

                {/* Toggle Featured */}
                <button
                  onClick={() => handleToggleFeatured(project._id)}
                  title={project.featured ? 'Remove from Featured' : 'Mark as Featured'}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    project.featured
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                      : 'border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-amber-500'
                  }`}
                >
                  <Star className={`w-4 h-4 ${project.featured ? 'fill-amber-500' : ''}`} />
                </button>

                {/* Toggle Publish */}
                <button
                  onClick={() => handleTogglePublish(project._id)}
                  title={project.published ? 'Unpublish' : 'Publish'}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    project.published
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                      : 'border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-emerald-500'
                  }`}
                >
                  {project.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(project._id, project.title)}
                  title="Delete Project"
                  className="p-2 rounded-xl border border-light-border dark:border-dark-border hover:border-red-500/40 hover:bg-red-500/10 text-light-muted dark:text-dark-muted hover:text-red-500 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl my-8 p-6 md:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-light-border dark:border-dark-border mb-6">
              <h2 className="text-lg font-bold">Add New Project</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Modern Full-Stack System"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Short Description * (Max 500 chars)
                </label>
                <textarea
                  rows="3"
                  required
                  maxLength={500}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief summary of what this application does..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Image Upload Component */}
              <ImageUpload
                value={formData.thumbnailUrl}
                onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                label="Project Thumbnail Image"
              />

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
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Web Application">Web Application</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Booking System">Booking System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Project Type
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Personal Project">Personal Project</option>
                    <option value="Academic / Capstone">Academic / Capstone</option>
                    <option value="Client Project">Client Project</option>
                    <option value="Freelance Work">Freelance Work</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Technologies * (Comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    GitHub URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.liveDemoUrl}
                    onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span>Publish immediately</span>
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
                  {submitting ? 'Saving Project...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;