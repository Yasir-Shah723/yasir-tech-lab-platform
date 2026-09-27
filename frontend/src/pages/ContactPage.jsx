import React, { useState } from 'react';
import api from '../services/api';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.27a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
  </svg>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Full Stack Web Application Inquiry',
    message: '',
    _gotcha: '', // Invisible honeypot input for bot defense
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const subjectOptions = [
    'Full Stack Web Application Inquiry',
    'Custom Business Website Project',
    'E-Commerce Platform Development',
    'Hotel / Serviced Booking System',
    'REST API & Backend Architecture',
    'Bug Fixing & Performance Optimization',
    'Full-Time / Junior Developer Opportunity',
    'General Inquiry',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Full Stack Web Application Inquiry',
          message: '',
          _gotcha: '',
        });

        // Automatically vanish the success banner after 5 seconds
        setTimeout(() => {
          setSuccessMsg('');
        }, 5000);
      }
    } catch (err) {
      const errorText =
        err.response?.data?.message ||
        'Failed to send message. Please reach out via WhatsApp or email directly.';
      setErrorMsg(errorText);

      // Automatically vanish the error banner after 6 seconds
      setTimeout(() => {
        setErrorMsg('');
      }, 6000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Mail className="w-3.5 h-3.5" />
            <span>Initiate Direct Contact</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Let's Discuss Your Project
          </h1>
          <p className="text-sm sm:text-base text-light-muted dark:text-dark-muted leading-relaxed">
            Have an application idea, a business website need, or an open developer opportunity? Send a message through this form or connect directly through any verified channel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Channels & Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-6 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight">Direct Channels</h2>

              <div className="space-y-4">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/923409479101?text=Hello%20Yasir,%20I%20would%20like%20to%20discuss%20a%20web%20project."
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl border border-light-border dark:border-dark-border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-light-text dark:text-dark-text">WhatsApp (Fastest Response)</p>
                      <p className="text-[11px] text-light-muted dark:text-dark-muted font-mono mt-0.5">03409479101</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-light-muted dark:text-dark-muted group-hover:text-emerald-500 transition-colors" />
                </a>

                {/* Email */}
                <a
                  href="mailto:mrsyed640@gmail.com"
                  className="p-4 rounded-2xl border border-light-border dark:border-dark-border hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-light-text dark:text-dark-text">Email</p>
                      <p className="text-[11px] text-light-muted dark:text-dark-muted truncate mt-0.5">mrsyed640@gmail.com</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-light-muted dark:text-dark-muted group-hover:text-primary transition-colors" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/syed-yasir-shah-69b076183/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl border border-light-border dark:border-dark-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                      <LinkedinIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-light-text dark:text-dark-text">LinkedIn</p>
                      <p className="text-[11px] text-light-muted dark:text-dark-muted mt-0.5">Professional Network</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-light-muted dark:text-dark-muted group-hover:text-blue-500 transition-colors" />
                </a>

                {/* Fiverr */}
                <a
                  href="https://www.fiverr.com/yasirtechlab/buying?source=avatar_menu_profile"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl border border-light-border dark:border-dark-border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 font-bold text-sm">
                      fi
                    </div>
                    <div>
                      <p className="text-xs font-bold text-light-text dark:text-dark-text">Fiverr Orders</p>
                      <p className="text-[11px] text-light-muted dark:text-dark-muted mt-0.5">Escrow & Milestone Services</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-light-muted dark:text-dark-muted group-hover:text-emerald-500 transition-colors" />
                </a>
              </div>

              {/* Location & Availability Note */}
              <div className="pt-4 border-t border-light-border dark:border-dark-border space-y-2.5 text-xs text-light-muted dark:text-dark-muted">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>Rawalpindi / Islamabad, Pakistan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Typical Response Time: Within 2–4 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  <span>Spam-protected & direct delivery to personal inbox</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Submission Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Send a Direct Message</h2>
                <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                  Fill in your project details and I will reply to your email address promptly.
                </p>
              </div>

              {/* Alert Feedback Banners */}
              {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs sm:text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{successMsg}</p>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field (hidden from real users via inline style & aria-hidden) */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex="-1"
                    autoComplete="off"
                    value={formData._gotcha}
                    onChange={(e) => setFormData({ ...formData, _gotcha: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full px-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                      Phone / WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="w-full px-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                      Inquiry Category *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {subjectOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                    Project Scope / Message * (Max 3000 chars)
                  </label>
                  <textarea
                    rows="5"
                    required
                    maxLength={3000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your project goals, required features, timeline, or questions..."
                    className="w-full px-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;