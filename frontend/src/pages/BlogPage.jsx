import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { BookOpen, Search, Clock, ArrowRight, Loader2, Calendar } from 'lucide-react';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'MERN Stack', 'Web Security', 'Software Engineering'];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        if (res.data.success) {
          setBlogs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.summary.toLowerCase().includes(search.toLowerCase()) ||
      blog.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Technical Insights</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Articles & Engineering Notes
          </h1>
          <p className="text-sm sm:text-base text-light-muted dark:text-dark-muted leading-relaxed">
            Technical breakdowns covering modern full-stack development, database concurrency patterns, and web security engineering.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
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

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-light-muted dark:text-dark-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-xs text-light-muted dark:text-dark-muted">Loading technical articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-dashed border-light-border dark:border-dark-border bg-white dark:bg-dark-card">
            <BookOpen className="w-12 h-12 text-light-muted dark:text-dark-muted mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold">No articles found</p>
            <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <article
                key={blog._id}
                className="rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card p-6 sm:p-7 flex flex-col justify-between hover:border-primary/50 transition-all shadow-sm hover:shadow-xl group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-light-muted dark:text-dark-muted">
                    <span className="font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {blog.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-primary" />
                      {blog.readTime}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors leading-snug">
                    <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h2>

                  <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed line-clamp-3">
                    {blog.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {blog.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-light-border dark:border-dark-border flex items-center justify-between">
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="text-xs font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <span className="text-[11px] text-light-muted dark:text-dark-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;