import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
  const navigate = useNavigate();

  // Login form state
  const [email, setEmail] = useState('mrsyed640@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Forgot password view state
  const [isForgotView, setIsForgotView] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState({ loading: false, msg: '', error: false });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email: email.trim().toLowerCase(),
        password,
      });

      console.log('Login response:', res.data);

      const token = res.data.token;
      if (token) {
        // Save under both common keys to prevent any mismatch with ProtectedRoute
        localStorage.setItem('adminToken', token);
        localStorage.setItem('token', token);
        if (res.data.user) {
          localStorage.setItem('adminUser', JSON.stringify(res.data.user));
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }

        // Direct navigation
        navigate('/admin/dashboard', { replace: true });

        // Fallback hard redirect if React Router does not trigger
        setTimeout(() => {
          if (window.location.pathname.includes('/login')) {
            window.location.href = '/admin/dashboard';
          }
        }, 300);
      } else {
        setLoginError('Server did not return an authentication token.');
      }
    } catch (err) {
      console.error('Login error details:', err.response || err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        'Unable to log in. Please check your credentials or backend status.';
      setLoginError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotStatus({ loading: true, msg: '', error: false });

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        email: forgotEmail.trim().toLowerCase(),
      });
      setForgotStatus({ loading: false, msg: res.data.message, error: false });
    } catch (err) {
      setForgotStatus({
        loading: false,
        msg: err.response?.data?.message || 'Failed to send recovery link.',
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
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition disabled:opacity-50 cursor-pointer"
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