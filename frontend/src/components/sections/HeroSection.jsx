import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Database, ShieldCheck, Terminal, Layers } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Positioning */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Live Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Available for new projects & full-time roles</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-light-text dark:text-dark-text leading-[1.15]">
              I Build Modern Digital Experiences That{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Grow Businesses.
              </span>
            </h1>

            {/* Supporting Intro */}
            <p className="text-base sm:text-lg text-light-muted dark:text-dark-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
              I'm <strong className="text-light-text dark:text-dark-text font-semibold">Yasir</strong>, a Full Stack Developer helping businesses, startups and individuals turn ideas into fast, modern and reliable web applications.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/projects"
                className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all cursor-pointer"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card hover:border-primary text-light-text dark:text-dark-text text-sm font-semibold transition-all cursor-pointer"
              >
                Hire Me
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-light-border dark:border-dark-border grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-light-text dark:text-dark-text">4+</p>
                <p className="text-[11px] text-light-muted dark:text-dark-muted font-medium">Real-World Projects</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-light-text dark:text-dark-text">MERN</p>
                <p className="text-[11px] text-light-muted dark:text-dark-muted font-medium">Full Stack Architecture</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-light-text dark:text-dark-text">100%</p>
                <p className="text-[11px] text-light-muted dark:text-dark-muted font-medium">Clean Production Code</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Developer Visual */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl shadow-2xl space-y-5">
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-light-border dark:border-dark-border text-xs text-light-muted dark:text-dark-muted">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  <span>yasir-tech-lab.js</span>
                </div>
              </div>

              {/* Code Snippet */}
              <div className="font-mono text-xs space-y-2 bg-light-bg dark:bg-dark-bg/80 p-4 rounded-xl border border-light-border dark:border-dark-border text-light-text dark:text-dark-text overflow-x-auto">
                <p className="text-light-muted dark:text-dark-muted">// Engineering Specification</p>
                <p>
                  <span className="text-blue-500">const</span> developer = &#123;
                </p>
                <p className="pl-4">
                  name: <span className="text-emerald-500">'Syed Yasir Shah'</span>,
                </p>
                <p className="pl-4">
                  role: <span className="text-emerald-500">'Full Stack Developer'</span>,
                </p>
                <p className="pl-4">
                  stack: [<span className="text-amber-500">'React'</span>, <span className="text-amber-500">'Node'</span>, <span className="text-amber-500">'Express'</span>, <span className="text-amber-500">'MongoDB'</span>],
                </p>
                <p className="pl-4">
                  securityMinded: <span className="text-purple-400">true</span>,
                </p>
                <p>&#125;;</p>
              </div>

              {/* Mini Highlights */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/40 dark:bg-dark-card/40">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Full Stack REST APIs</p>
                    <p className="text-[11px] text-light-muted dark:text-dark-muted">Node.js, Express, MongoDB & MySQL</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/40 dark:bg-dark-card/40">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Security & Verification</p>
                    <p className="text-[11px] text-light-muted dark:text-dark-muted">Google Cybersecurity Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;