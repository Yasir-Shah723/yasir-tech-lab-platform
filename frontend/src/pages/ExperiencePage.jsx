import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Briefcase,
  GraduationCap,
  Code2,
  Calendar,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

const ExperiencePage = () => {
  const [data, setData] = useState({ experiences: [], education: [], skills: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load experience:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const skillCategories = ['Frontend', 'Backend', 'Database', 'Programming', 'Tools', 'Cybersecurity'];

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career & Qualifications</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Experience & Education
          </h1>
          <p className="text-sm sm:text-base text-light-muted dark:text-dark-muted leading-relaxed">
            A comprehensive record of my full-stack development internships, academic degree from SZABIST Islamabad, and technical skill matrix.
          </p>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-xs text-light-muted dark:text-dark-muted">Loading qualifications...</p>
          </div>
        ) : (
          <>
            {/* Experience Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-light-border dark:border-dark-border">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Work Experience & Internships</h2>
              </div>

              <div className="space-y-6">
                {data.experiences.map((exp) => (
                  <div
                    key={exp._id}
                    className="p-6 sm:p-8 rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 hover:border-primary/50 transition-all shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {exp.employmentType}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight mt-1.5">{exp.role}</h3>
                        <p className="text-sm font-semibold text-light-muted dark:text-dark-muted">
                          {exp.company}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-light-muted dark:text-dark-muted font-medium bg-light-bg dark:bg-dark-bg px-3 py-1.5 rounded-xl border border-light-border dark:border-dark-border self-start sm:self-auto">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{exp.duration}</span>
                      </div>
                    </div>

                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="space-y-2 pt-2 border-t border-light-border dark:border-dark-border">
                        {exp.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-light-muted dark:text-dark-muted">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {exp.technologies.map((t) => (
                          <span
                            key={t}
                            className="text-[11px] px-2.5 py-0.5 rounded-md bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Education Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-light-border dark:border-dark-border">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Academic Background</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.education.map((edu) => (
                  <div
                    key={edu._id}
                    className="p-6 sm:p-8 rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-3 shadow-sm hover:border-primary/50 transition-all"
                  >
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Graduated {edu.graduationDate}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold tracking-tight">{edu.degree}</h3>
                    <p className="text-xs sm:text-sm font-semibold text-light-text dark:text-dark-text">
                      {edu.institution}
                    </p>
                    {edu.grade && (
                      <p className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-xl inline-block border border-emerald-500/20">
                        {edu.grade}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Skills Matrix */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-light-border dark:border-dark-border">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Technical Skills Matrix</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillCategories.map((cat) => {
                  const categorySkills = data.skills.filter((s) => s.category === cat);
                  if (categorySkills.length === 0) return null;

                  return (
                    <div
                      key={cat}
                      className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-3"
                    >
                      <h3 className="text-sm font-bold tracking-tight text-primary flex items-center gap-2">
                        <span>{cat}</span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {categorySkills.map((s) => (
                          <span
                            key={s._id}
                            className="text-xs px-2.5 py-1 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text font-medium"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default ExperiencePage;