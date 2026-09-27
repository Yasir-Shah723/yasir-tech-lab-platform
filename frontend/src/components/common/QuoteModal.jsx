import React, { useState } from 'react';
import api from '../../services/api';
import {
  X,
  FileQuestion,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send,
  Sparkles,
} from 'lucide-react';

const commonFeatures = [
  'User Authentication & JWT Security',
  'Responsive UI (Mobile, Tablet, Desktop)',
  'Administrative Management Console',
  'MongoDB / SQL Database Architecture',
  'Payment Gateway / Checkout Engine',
  'File & Media Upload System',
  'Real-Time Invoicing & Calendar Booking',
  'Performance Optimization & SEO Audit',
];

const QuoteModal = ({ isOpen, onClose, initialProjectType = 'Full Stack Web App' }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    company: '',
    projectType: initialProjectType,
    budgetRange: '$185 - $400',
    timeline: 'Standard (2 - 4 weeks)',
    features: [],
    description: '',
    _gotcha: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feature);
      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== feature)
          : [...prev.features, feature],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.post('/quotes', formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 3500);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Failed to submit quote request. Please try again.'
      );
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl my-auto max-h-[92vh] flex flex-col rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shadow-2xl overflow-hidden">
        
        {/* Pinned Modal Header (Always Visible) */}
        <div className="p-5 sm:p-6 border-b border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shrink-0 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-3 h-3" />
                <span>Free Engineering Estimate</span>
              </div>

              {/* Alert Feedback Banners - Placed directly over the title in the pinned header */}
              {successMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium leading-tight">{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-medium leading-tight">{errorMsg}</span>
                </div>
              )}

              <h2 className="text-lg sm:text-xl font-bold tracking-tight">Request Project Estimate</h2>
              <p className="text-xs text-light-muted dark:text-dark-muted">
                Define your deliverables to receive a realistic architecture, timeline, and cost quote.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text cursor-pointer shrink-0"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <form id="quote-modal-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input
                type="text"
                name="_gotcha"
                tabIndex="-1"
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
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Bilal Tariq"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+92 340 0000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Project Category *
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Full Stack Web App">Full Stack Web App</option>
                  <option value="Custom Business Website">Custom Business Website</option>
                  <option value="E-Commerce Store">E-Commerce Store</option>
                  <option value="Booking / Reservation Engine">Booking / Reservation Engine</option>
                  <option value="REST API Backend">REST API Backend</option>
                  <option value="Bug Fix / Maintenance">Bug Fix / Maintenance</option>
                  <option value="Other Custom System">Other Custom System</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Budget Band *
                </label>
               <select
  value={formData.budgetRange}
  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
>
  <option value="$50 - $185">$50 - $185 (Standard Website / Small Scope / Fixes)</option>
  <option value="$185 - $450">$185 - $450 (Full-Stack MERN Application / Core Portal)</option>
  <option value="$450 - $850">$450 - $850 (Complex Multi-Role Platform / Booking Engine)</option>
  <option value="$850+">$850+ (Custom Scalable Web Platform)</option>
  <option value="Flexible">Flexible / Open to Recommendation</option>
</select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                  Estimated Delivery Window
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Urgent (< 2 weeks)">Urgent (&lt; 2 weeks)</option>
                  <option value="Standard (2 - 4 weeks)">Standard (2 - 4 weeks)</option>
                  <option value="Flexible (1 - 2 months)">Flexible (1 - 2 months)</option>
                </select>
              </div>
            </div>

            {/* Feature checklist */}
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-2">
                Select Required Core Capabilities:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {commonFeatures.map((feat) => {
                  const checked = formData.features.includes(feat);
                  return (
                    <button
                      type="button"
                      key={feat}
                      onClick={() => handleFeatureToggle(feat)}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center gap-2 ${
                        checked
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-light-border dark:border-dark-border bg-light-bg/30 dark:bg-dark-bg/40 text-light-muted dark:text-dark-muted'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                          checked
                            ? 'border-primary bg-primary text-white text-[10px]'
                            : 'border-light-border dark:border-dark-border'
                        }`}
                      >
                        {checked && '✓'}
                      </span>
                      <span className="truncate">{feat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                Project Description & Requirements * (Max 4000 chars)
              </label>
              <textarea
                rows="4"
                required
                maxLength={4000}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detail your application workflow, target audience, third-party integrations, or reference sites..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>
        </div>

        {/* Pinned Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-light-border dark:border-dark-border bg-light-bg/40 dark:bg-dark-surface shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="quote-modal-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold inline-flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting Brief...</span>
              </>
            ) : (
              <>
                <span>Request Estimate</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;