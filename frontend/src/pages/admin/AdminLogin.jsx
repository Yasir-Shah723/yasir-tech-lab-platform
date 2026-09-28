import { useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('mrsyed640@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotView, setIsForgotView] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('mrsyed640@gmail.com');
  const [forgotStatus, setForgotStatus] = useState({ loading: false, msg: '', error: false });

  // 1. Direct, foolproof login handler
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const targetUrl = 'https://yasir-tech-lab-api.onrender.com/api/v1/auth/login';

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

      if (data.token) {
        // Save under every common token name your app might check
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('jwt', data.token);
        if (data.user) {
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Hard navigation straight to admin panel
        window.location.replace('/admin/dashboard');
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

    try {
      const response = await fetch('https://yasir-tech-lab-api.onrender.com/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to dispatch reset email.');
      }

      setForgotStatus({ loading: false, msg: data.message, error: false });
    } catch (err) {
      setForgotStatus({ loading: false, msg: err.message, error: true });
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

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
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

            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
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
                onClick={() => setIsForgotView(false)}
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