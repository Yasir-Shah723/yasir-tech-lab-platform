import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Layers,
  Calendar,
  User,
  Tag,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const ProjectCaseStudy = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCaseStudy = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/projects/${slug}`);
        if (res.data.success) {
          setProject(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Case study not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();
    window.scrollTo(0, 0); // Scroll to top when loading
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-xs text-light-muted dark:text-dark-muted">Loading case study data...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Case Study Not Found</h1>
        <p className="text-sm text-light-muted dark:text-dark-muted">
          The requested project case study could not be located in our records.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-light-muted dark:text-dark-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects Catalog</span>
          </Link>
        </div>

        {/* Case Study Header */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {project.category}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-light-bg dark:bg-dark-card border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted">
              {project.projectType}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              {project.status}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-light-muted dark:text-dark-muted leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold inline-flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              <span>View GitHub Repository</span>
            </a>

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card hover:border-primary text-xs font-semibold inline-flex items-center gap-2 transition-all"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </header>

        {/* Metadata Specifications Bar */}
        <section className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          <div>
            <p className="text-light-muted dark:text-dark-muted font-medium mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" /> Role
            </p>
            <p className="font-semibold text-light-text dark:text-dark-text">{project.role}</p>
          </div>

          <div>
            <p className="text-light-muted dark:text-dark-muted font-medium mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-500" /> Focus Area
            </p>
            <p className="font-semibold text-light-text dark:text-dark-text">{project.category}</p>
          </div>

          <div>
            <p className="text-light-muted dark:text-dark-muted font-medium mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> Client / Scope
            </p>
            <p className="font-semibold text-light-text dark:text-dark-text">{project.clientType}</p>
          </div>

          <div>
            <p className="text-light-muted dark:text-dark-muted font-medium mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verification
            </p>
            <p className="font-semibold text-light-text dark:text-dark-text">Clean MERN Code</p>
          </div>
        </section>

        {/* Problem and Solution Panels */}
        {(project.problem || project.solution) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.problem && (
              <div className="p-6 sm:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>The Engineering Problem</span>
                </div>
                <p className="text-xs sm:text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                  {project.problem}
                </p>
              </div>
            )}

            {project.solution && (
              <div className="p-6 sm:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>The Implemented Solution</span>
                </div>
                <p className="text-xs sm:text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                  {project.solution}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Key Features Checklist */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <section className="p-6 sm:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-5">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">Key System Capabilities</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {project.keyFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-light-muted dark:text-dark-muted">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Technology Stack Pills */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Technologies & Tools Used</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border text-xs font-medium text-light-text dark:text-dark-text shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Bottom CTA Block */}
        <section className="p-8 sm:p-10 rounded-3xl border border-light-border dark:border-dark-border bg-gradient-to-br from-primary/10 via-transparent to-transparent space-y-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Interested in building a similar web application?
          </h2>
          <p className="text-xs sm:text-sm text-light-muted dark:text-dark-muted max-w-lg mx-auto">
            I specialize in full-stack MERN engineering, clean REST APIs, and production architecture. Let's discuss your project goals.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-md shadow-primary/20 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Discuss Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
};

export default ProjectCaseStudy;