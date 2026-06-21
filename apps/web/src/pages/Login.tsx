import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { motion } from 'framer-motion';
import { useBranding } from '../settings/BrandingContext';
import { AUTH_BYPASS } from '../auth/authConfig';
import { apiRequest, tokenStorage } from '../lib/api';

export default function Login() {
  const { login, signup } = useAuth();
  const { branding } = useBranding();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    if (AUTH_BYPASS) navigate('/', { replace: true });
  }, [navigate, AUTH_BYPASS]);

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) { tokenStorage.set(token); window.location.replace('/'); return; }
    apiRequest<any[]>('/auth/providers', { auth: false }).then(setProviders).catch(() => setProviders([]));
  }, [location.search]);

  const providerLogin = async (provider: string) => {
    try { const result = await apiRequest<{authorizationUrl:string}>(`/auth/oauth/${provider}/start?portal=parent`, { auth: false }); window.location.assign(result.authorizationUrl); }
    catch (err: any) { setError(err.message || 'Provider sign-in is unavailable'); }
  };

  const from = (location.state as any)?.from?.pathname || '/';

  const schoolName = branding?.schoolName || 'POPIN-LMS';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-8"
      >
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 font-heading">{schoolName}</h1>
          <p className="text-sm text-gray-500 mt-1">{mode === 'login' ? 'Sign in to continue' : 'Create your parent account'}</p>
        </div>

        <div className="mt-6 space-y-2">
          {['microsoft','google','apple'].map((provider) => {
            const config = providers.find((item) => item.provider === provider); const enabled = !!config?.enabled;
            return <button key={provider} disabled={!enabled} onClick={() => void providerLogin(provider)} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">Continue with {provider === 'microsoft' ? 'Microsoft' : provider === 'google' ? 'Google' : 'Apple'}{!enabled && ' · Not configured'}</button>;
          })}
          <div className="flex items-center gap-3 py-2 text-xs text-gray-400"><span className="h-px flex-1 bg-gray-200"/>or continue with email<span className="h-px flex-1 bg-gray-200"/></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                placeholder="Jane Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              placeholder="admin@school.co.za"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-500">
          {mode === 'login' ? (
            <button onClick={() => setMode('signup')} className="text-blue-600 hover:underline">
              Need an account? Create one
            </button>
          ) : (
            <button onClick={() => setMode('login')} className="text-blue-600 hover:underline">
              Already have an account? Sign in
            </button>
          )}
        </div>
      </motion.div>
      <div className="mt-6 text-xs text-gray-500">
        PopIn-LMS - Powered By{' '}
        <a
          href="https://popinsolutions.co.za"
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline"
        >
          Pop In Solutions
        </a>
      </div>
    </div>
  );
}
