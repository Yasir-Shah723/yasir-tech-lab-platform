import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
  const navigate = useNavigate();

  // Standard Login State
  const [email, setEmail] = useState('mrsyed640@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Forgot Password State
  const [isForgotView, setIsForgotView] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState({ loading: false, msg: '', error: false });

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminUser', JSON.stringify(res.data.user));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotStatus({ loading: true, msg: '', error: false });

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        email: forgotEmail,
      });
      setForgotStatus({ loading: false, msg: res.data.message, error: false });
    } catch (err) {
      setForgotStatus({
        loading: false,
        msg: err.response?.data?.message || 'Failed to send reset link.',
        error: true,
      });
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

            {loginError && (
              <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsForgotView(true);
                  setForgotEmail(email || 'mrsyed640@gmail.com');
                  setForgotStatus({ loading: false, msg: '', error: false });
                }}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition"
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
                Enter your admin email to receive a 15-minute recovery link.
              </p>
            </div>

            {forgotStatus.msg && (
              <div
                className={`p-3 rounded-lg mb-4 text-sm ${
                  forgotStatus.error
                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                }`}
              >
                {forgotStatus.msg}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  placeholder="mrsyed640@gmail.com"
                />
              </div>

              <button
                type="submit"
                disabled={forgotStatus.loading}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition disabled:opacity-50"
              >
                {forgotStatus.loading ? 'Sending link...' : 'Send Recovery Link'}
              </button>

              <button
                type="button"
                onClick={() => setIsForgotView(false)}
                className="w-full text-center text-sm text-slate-400 hover:text-white transition mt-2"
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