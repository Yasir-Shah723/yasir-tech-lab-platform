import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Clock, Calendar, Tag, Loader2, BookOpen } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/blogs/${slug}`);
        if (res.data.success) {
          setBlog(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Article not found');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-xs text-light-muted dark:text-dark-muted">Loading article content...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Article Not Found</h1>
        <p className="text-sm text-light-muted dark:text-dark-muted">
          The requested technical article could not be located.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Back Link */}
        <div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-light-muted dark:text-dark-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Technical Articles</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-5 pb-8 border-b border-light-border dark:border-dark-border">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {blog.category}
            </span>
            <span className="text-light-muted dark:text-dark-muted flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {blog.readTime}
            </span>
            <span className="text-light-muted dark:text-dark-muted flex items-center gap-1 ml-2">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {blog.title}
          </h1>

          <p className="text-base sm:text-lg text-light-muted dark:text-dark-muted leading-relaxed font-medium">
            {blog.summary}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-lg bg-light-bg dark:bg-dark-card border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article Body */}
        <div className="space-y-6 text-sm sm:text-base text-light-text dark:text-dark-text leading-relaxed whitespace-pre-line font-normal">
          {blog.content}
        </div>

        {/* Author Footer */}
        <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex items-center justify-between gap-4 mt-12">
          <div>
            <p className="text-xs font-semibold text-light-muted dark:text-dark-muted uppercase">Written by</p>
            <p className="text-base font-bold">Syed Yasir Shah</p>
            <p className="text-xs text-light-muted dark:text-dark-muted">Full Stack Developer & Web Solutions Specialist</p>
          </div>
          <Link
            to="/contact"
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shrink-0"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogDetail;