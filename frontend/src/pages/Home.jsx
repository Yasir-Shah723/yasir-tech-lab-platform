import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import ProjectsPreview from '../components/sections/ProjectsPreview';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Projects Preview (Connected to MongoDB) */}
      <ProjectsPreview />

      {/* Services Teaser */}
      <section className="py-16 border-t border-light-border dark:border-dark-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="p-8 md:p-12 rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to build your next web application?
            </h2>
            <p className="text-xs sm:text-sm text-light-muted dark:text-dark-muted max-w-xl mx-auto leading-relaxed">
              From responsive business websites to full-stack MERN portals and database systems, I build software designed around your specific requirements.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/contact"
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-md shadow-primary/20 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/services"
                className="px-6 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/50 hover:border-primary text-xs font-semibold transition-all cursor-pointer"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;