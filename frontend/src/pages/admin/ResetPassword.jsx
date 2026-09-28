import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setStatus({ loading: false, error: 'Passwords do not match.', success: '' });
    }

    if (password.length < 8) {
      return setStatus({
        loading: false,
        error: 'Password must be at least 8 characters long.',
        success: '',
      });
    }

    setStatus({ loading: true, error: '', success: '' });

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
        { password }
      );

      setStatus({ loading: false, error: '', success: res.data.message });
      setTimeout(() => {
        navigate('/admin/login');
      }, 2500);
    } catch (err) {
      setStatus({
        loading: false,
        error: err.response?.data?.message || 'Reset link is invalid or has expired.',
        success: '',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Set New Password</h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          Choose a secure password for your administrator account.
        </p>

        {status.error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg mb-4">
            {status.error}
          </div>
        )}

        {status.success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg mb-4">
            {status.success} Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">New Password (min 8 chars)</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            {status.loading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>
      </div>
    </div>
  );
}