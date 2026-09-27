import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Award,
  ExternalLink,
  Calendar,
  ShieldCheck,
  Loader2,
  FileText,
  Maximize2,
  X,
} from 'lucide-react';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePreview, setActivePreview] = useState(null); // Lightbox state

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/certificates');
        if (res.data.success) {
          setCertificates(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Credentials</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Certifications & Training
          </h1>
          <p className="text-sm sm:text-base text-light-muted dark:text-dark-muted leading-relaxed">
            Verified credentials across full-stack software development, engineering coursework, and Google-certified cybersecurity fundamentals.
          </p>
        </div>

        {/* Certificate Cards Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-xs text-light-muted dark:text-dark-muted">Loading verified credentials...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => {
              const hasMedia = cert.certificateImage && cert.certificateImage.url;
              const isPdf = hasMedia && cert.certificateImage.url.toLowerCase().endsWith('.pdf');

              return (
                <div
                  key={cert._id}
                  className="rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col justify-between hover:border-primary/50 transition-all shadow-sm hover:shadow-xl group overflow-hidden"
                >
                  {/* Optional Image or Document Banner */}
                  {hasMedia && (
                    <div className="relative w-full h-48 bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-border overflow-hidden">
                      {isPdf ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2">
                          <FileText className="w-12 h-12 text-red-500" />
                          <p className="text-xs font-bold text-light-text dark:text-dark-text">
                            Official Verification PDF Document
                          </p>
                          <a
                            href={cert.certificateImage.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                          >
                            <span>Open PDF Document</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <div className="relative w-full h-full group/img cursor-pointer" onClick={() => setActivePreview(cert.certificateImage.url)}>
                          <img
                            src={cert.certificateImage.url}
                            alt={cert.title}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5">
                            <Maximize2 className="w-4 h-4" />
                            <span>View Full Image</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                        <span className="text-light-muted dark:text-dark-muted font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-primary" />
                          {cert.issueDate}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
                        {cert.title}
                      </h2>

                      <p className="text-xs font-semibold text-light-muted dark:text-dark-muted">
                        Issuer: <span className="text-light-text dark:text-dark-text">{cert.issuingOrganization}</span>
                      </p>

                      {cert.description && (
                        <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed pt-2 border-t border-light-border dark:border-dark-border line-clamp-4">
                          {cert.description}
                        </p>
                      )}
                    </div>

                    {cert.credentialUrl && (
                      <div className="pt-4 border-t border-light-border dark:border-dark-border">
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1.5 transition-colors"
                        >
                          <span>Verify Authenticity Online</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Modal for Image Inspection */}
      {activePreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setActivePreview(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActivePreview(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activePreview}
              alt="Certificate full preview"
              className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;