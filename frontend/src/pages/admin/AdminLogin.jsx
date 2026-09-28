import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotView, setIsForgotView] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState({ loading: false, msg: '', error: false });

  // 1. Foolproof login handler
  const handleLogin = async (e) => {
  if (e) e.preventDefault();
  setLoading(true);
  setErrorMessage('');

  // Automatically points to localhost when developing, and Render when live
  const API_BASE = import.meta.env.VITE_API_URL || 'https://yasir-tech-lab-api.onrender.com';
  const targetUrl = `${API_BASE}/api/v1/auth/login`;

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Server responded with status ${response.status}`);
    }

    // Read token whether it is directly on data.token or nested inside data.data.token
    const token = data.token || (data.data && data.data.token);

    if (token) {
      // Save under standard keys
      localStorage.setItem('adminToken', token);
      localStorage.setItem('token', token);
      localStorage.setItem('jwt', token);

      const userData = data.user || (data.data && data.data.user);
      if (userData) {
        localStorage.setItem('adminUser', JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData));
      }

      // Clear sensitive inputs
      setEmail('');
      setPassword('');

      // Navigate cleanly to the admin dashboard
      navigate('/admin/dashboard', { replace: true });
    } else {
      throw new Error('No authentication token received from backend.');
    }
  } catch (err) {
    setErrorMessage(err.message || 'Login failed. Please check your credentials.');
  } finally {
    setLoading(false);
  }
};

  // 2. Direct forgot password handler
  const handleForgot = async (e) => {
  if (e) e.preventDefault();
  setForgotStatus({ loading: true, msg: '', error: false });

  // Dynamically uses localhost during local development and Render when deployed
  const API_BASE = import.meta.env.VITE_API_URL || 'https://yasir-tech-lab-api.onrender.com';

  try {
    const response = await fetch(`${API_BASE}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to dispatch reset email.');
    }

    setForgotStatus({ loading: false, msg: data.message || 'Reset link sent successfully.', error: false });
    setForgotEmail('');
  } catch (err) {
    setForgotStatus({ loading: false, msg: err.message || 'Error sending link.', error: true });
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        {!isForgotView ? (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Admin Sign In</h2>
              <p className="text-sm text-slate-400 mt-1">Yasir Tech Lab Console</p>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Verifying & Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsForgotView(true);
                  setErrorMessage('');
                  setForgotEmail('');
                }}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white">Reset Password</h2>
              <p className="text-sm text-slate-400 mt-1">
                Enter your admin email to receive a recovery link.
              </p>
            </div>

            {forgotStatus.msg && (
              <div
                className={`p-3 rounded-lg mb-4 text-sm ${
                  forgotStatus.error
                    ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                    : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                }`}
              >
                {forgotStatus.msg}
              </div>
            )}

            <form onSubmit={handleForgot} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="Enter admin email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={forgotStatus.loading}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                {forgotStatus.loading ? 'Sending link...' : 'Send Recovery Link'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsForgotView(false);
                  setErrorMessage('');
                }}
                className="w-full text-center text-sm text-slate-400 hover:text-white transition mt-2 cursor-pointer"
              >
                &larr; Back to Login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}