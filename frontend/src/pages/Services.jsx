import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import QuoteModal from '../components/common/QuoteModal';
import {
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Layers,
  Layout,
  ShoppingCart,
  Calendar,
  Server,
  Bug,
  Code2,
  Sparkles,
} from 'lucide-react';

const iconMap = {
  Layout: Layout,
  Layers: Layers,
  ShoppingCart: ShoppingCart,
  Calendar: Calendar,
  Server: Server,
  Bug: Bug,
  Code2: Code2,
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState('Full Stack Web App');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data.success) {
          setServices(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleOpenEstimate = (title) => {
    setSelectedServiceTitle(title);
    setQuoteModalOpen(true);
  };

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Web Engineering Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Professional Web Solutions
          </h1>
          <p className="text-sm sm:text-base text-light-muted dark:text-dark-muted leading-relaxed">
            Reliable, production-ready web development built with clean MERN stack architecture, modern responsive design, and practical security standards.
          </p>
        </div>

        {/* Services Cards Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-xs text-light-muted dark:text-dark-muted">Loading services catalog...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Code2;
              return (
                <div
                  key={service._id}
                  className="rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card p-6 sm:p-8 flex flex-col justify-between hover:border-primary/50 transition-all shadow-sm hover:shadow-xl group"
                >
                  <div className="space-y-4">
                    {/* Top Icon & Category */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted">
                        {service.category}
                      </span>
                    </div>

                    {/* Title & Short Description */}
                    <h2 className="text-xl font-bold tracking-tight">{service.title}</h2>
                    <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">
                      {service.shortDescription}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="pt-2 border-t border-light-border dark:border-dark-border space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted">
                        What's Included:
                      </p>
                      <ul className="space-y-2">
                        {service.deliverables.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-light-text dark:text-dark-text"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Pricing & Inquiry CTA */}
                  <div className="pt-6 mt-6 border-t border-light-border dark:border-dark-border flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-light-muted dark:text-dark-muted">
                        Pricing Model
                      </p>
                      <p className="text-base font-bold text-light-text dark:text-dark-text">
                        {service.priceType === 'custom_quote'
                          ? 'Request a Quote'
                          : service.startingPrice > 0
                          ? `Starting at $${service.startingPrice}`
                          : 'Custom Quote'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEstimate(service.title)}
                      className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all cursor-pointer"
                    >
                      <span>Get Estimate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Assurance Block */}
        <section className="p-8 sm:p-10 rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Need a Custom Web Solution?</h2>
          <p className="text-xs sm:text-sm text-light-muted dark:text-dark-muted max-w-xl mx-auto leading-relaxed">
            Have a project with specialized requirements or a unique workflow? I can construct a customized full-stack system designed specifically around your specifications.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleOpenEstimate('Other Custom System')}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-md shadow-primary/20 inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request Detailed Architecture Estimate</span>
            </button>
          </div>
        </section>
      </div>

      {/* Estimation Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialProjectType={selectedServiceTitle}
      />
    </div>
  );
};

export default Services;