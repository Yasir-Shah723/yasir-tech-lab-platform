import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, FolderGit2, ArrowRight, ExternalLink, Loader2, Star } from 'lucide-react';

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Full Stack', 'Booking System', 'E-Commerce', 'Web Application'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load portfolio projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Engineering Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Case Studies & Systems
          </h1>
          <p className="text-sm sm:text-base text-light-muted dark:text-dark-muted leading-relaxed">
            A verified record of full-stack applications, scalable REST APIs, and database architectures engineered with modern web standards.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-light-muted dark:text-dark-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tech, keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-xs text-light-muted dark:text-dark-muted">Loading case studies from database...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-dashed border-light-border dark:border-dark-border bg-white dark:bg-dark-card">
            <FolderGit2 className="w-12 h-12 text-light-muted dark:text-dark-muted mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold">No matching projects found</p>
            <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col justify-between hover:border-primary/50 transition-all group overflow-hidden shadow-sm hover:shadow-xl"
              >
                <div className="p-6 sm:p-8 space-y-4">
                  {/* Category & Status Badges */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500" /> Featured
                        </span>
                      )}
                    </div>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text p-1 transition-colors"
                      title="GitHub Source"
                    >
                      <GithubIcon className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                  </h2>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-light-muted dark:text-dark-muted leading-relaxed line-clamp-3">
                    {project.shortDescription}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="p-5 border-t border-light-border dark:border-dark-border bg-light-bg/40 dark:bg-dark-surface/40 flex items-center justify-between">
                  <Link
                    to={`/projects/${project.slug}`}
                    className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Explore Full Case Study</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Repository</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;