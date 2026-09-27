import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  MessageSquareQuote,
  Star,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Handshake,
} from 'lucide-react';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/testimonials');
        if (res.data.success) {
          setTestimonials(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-16 md:py-24 border-t border-light-border dark:border-dark-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Client Feedback & Standards</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Client Collaboration & Trust
          </h2>
          <p className="text-xs sm:text-sm text-light-muted dark:text-dark-muted leading-relaxed">
            Delivering production-quality software with transparent communication, documented deliverables, and high technical integrity.
          </p>
        </div>

        {/* Dynamic Display: Reviews or Tasteful Placeholder */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card p-6 sm:p-8 flex flex-col justify-between hover:border-primary/50 transition-all shadow-sm space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-light-text dark:text-dark-text italic leading-relaxed">
                    "{t.content}"
                  </p>
                </div>

                <div className="pt-4 border-t border-light-border dark:border-dark-border flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-light-text dark:text-dark-text">{t.clientName}</p>
                    <p className="text-[11px] text-light-muted dark:text-dark-muted">
                      {t.clientRole} {t.company && `• ${t.company}`}
                    </p>
                  </div>
                  {t.projectRef && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted">
                      {t.projectRef}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Honest, Tasteful Quality Guarantee Card */
          <div className="max-w-4xl mx-auto rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card p-8 sm:p-12 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Handshake className="w-3.5 h-3.5" />
                  <span>Open for New Client Collaborations</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Let's Build Your Project With Measurable Standards
                </h3>

                <p className="text-xs sm:text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                  I believe in transparent partnerships without inflated marketing claims. Every project at Yasir Tech Lab is engineered with direct developer communication, production-grade clean code, and post-delivery support.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-light-text dark:text-dark-text font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Direct WhatsApp & Video Consultation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-light-text dark:text-dark-text font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Secure MERN & SQL Architecture</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-light-text dark:text-dark-text font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Milestone-based Transparent Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-light-text dark:text-dark-text font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Clean Code & Full Documentation</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 text-center md:text-right">
                <div className="p-6 rounded-2xl bg-light-bg dark:bg-dark-bg/60 border border-light-border dark:border-dark-border space-y-4 text-center">
                  <ShieldCheck className="w-10 h-10 text-primary mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-light-text dark:text-dark-text">Ready to get started?</p>
                    <p className="text-[11px] text-light-muted dark:text-dark-muted mt-0.5">
                      Discuss your application requirements today.
                    </p>
                  </div>
                  <Link
                    to="/contact"
                    className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold inline-flex items-center justify-center gap-2 shadow-md shadow-primary/20 transition-all cursor-pointer"
                  >
                    <span>Initiate Project Brief</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;