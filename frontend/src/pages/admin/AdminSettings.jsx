import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Settings,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Eye,
  EyeOff,
} from 'lucide-react';

const AdminSettings = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    headline: '',
    shortBio: '',
    location: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    githubUrl: '',
    linkedinUrl: '',
    fiverrUrl: '',
    resumeUrl: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      if (res.data.success) {
        setProfileData(res.data.data);
      }
    } catch (err) {
      setProfileError('Failed to load profile settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await api.put('/settings/admin', profileData);
      if (res.data.success) {
        setProfileSuccess('Profile settings updated successfully!');
        setTimeout(() => setProfileSuccess(''), 4000);
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update settings');
      setTimeout(() => setProfileError(''), 5000);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setSavingPassword(true);

    try {
      const res = await api.patch('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data.success) {
        setPasswordSuccess('Admin password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => setPasswordSuccess(''), 4000);
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
      setTimeout(() => setPasswordError(''), 5000);
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-xs text-light-muted dark:text-dark-muted">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile & System Settings</h1>
        <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
          Update your public identity, contact information, social links, and admin credentials.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        {/* Profile Alert */}
        {profileSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs sm:text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{profileError}</span>
          </div>
        )}

        {/* Section 1: Identity & Bio */}
        <div className="p-6 sm:p-8 rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-light-border dark:border-dark-border">
            <User className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold tracking-tight">Public Identity & Bio</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                Full Display Name
              </label>
              <input
                type="text"
                required
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                Professional Title / Headline
              </label>
              <input
                type="text"
                required
                value={profileData.headline}
                onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
              Short Professional Bio (Max 1000 chars)
            </label>
            <textarea
              rows="3"
              maxLength={1000}
              value={profileData.shortBio}
              onChange={(e) => setProfileData({ ...profileData, shortBio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Section 2: Contact Channels */}
        <div className="p-6 sm:p-8 rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-light-border dark:border-dark-border">
            <Mail className="w-4 h-4 text-emerald-500" />
            <h2 className="text-base font-bold tracking-tight">Direct Contact Channels</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                required
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                Location Badge
              </label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                Phone Display Number
              </label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                WhatsApp Number (International without +)
              </label>
              <input
                type="text"
                value={profileData.whatsappNumber}
                onChange={(e) => setProfileData({ ...profileData, whatsappNumber: e.target.value })}
                placeholder="e.g. 923409479101"
                className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: External Links & CV */}
        <div className="p-6 sm:p-8 rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-light-border dark:border-dark-border">
            <Globe className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-bold tracking-tight">Social, Developer & Resume Links</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={profileData.githubUrl}
                onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={profileData.linkedinUrl}
                onChange={(e) => setProfileData({ ...profileData, linkedinUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                Fiverr Profile URL
              </label>
              <input
                type="url"
                value={profileData.fiverrUrl}
                onChange={(e) => setProfileData({ ...profileData, fiverrUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                CV / Resume PDF URL
              </label>
              <input
                type="url"
                value={profileData.resumeUrl}
                onChange={(e) => setProfileData({ ...profileData, resumeUrl: e.target.value })}
                placeholder="https://drive.google.com/... or hosted PDF link"
                className="w-full px-3.5 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingProfile}
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold inline-flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {savingProfile ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Profile Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Settings</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Section 4: Security & Password Manager */}
      <div className="p-6 sm:p-8 rounded-3xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-light-border dark:border-dark-border">
          <Lock className="w-4 h-4 text-amber-500" />
          <h2 className="text-base font-bold tracking-tight">Security & Admin Password</h2>
        </div>

        {passwordSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs sm:text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          {/* Current Password Field */}
          <div>
            <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                required
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text cursor-pointer transition-colors"
                title={showCurrentPassword ? 'Hide password' : 'Show password'}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password & Confirm Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="Min. 6 characters"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text cursor-pointer transition-colors"
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Re-enter new password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text cursor-pointer transition-colors"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {savingPassword ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Update Admin Password</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;