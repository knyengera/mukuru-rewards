"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/store/auth';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] w-full px-4 py-10">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-2xl">
        <h1 className="text-center text-3xl font-extrabold text-[#E85A3B]">Welcome Back!</h1>
        <p className="mt-2 text-center text-sm text-neutral-500">Login to access your account</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Username or Email</label>
            <input
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-orange-300 focus:ring"
              placeholder="Enter your username or email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-1 text-xs text-neutral-500">You can use either your username or email address to sign in</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Password</label>
            <div className="relative">
              <input
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 pr-10 text-sm outline-none ring-orange-300 focus:ring"
                placeholder="Enter your password"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-500 hover:text-neutral-700"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M3.53 2.47a.75.75 0 10-1.06 1.06l18 18a.75.75 0 101.06-1.06l-2.21-2.21A11.74 11.74 0 0021.75 12c-1.34-3.77-5.4-6.75-9.75-6.75-1.64 0-3.2.36-4.6 1.03l-3.87-3.81zm6.3 6.3l1.26 1.26a3 3 0 013.87 3.87l1.26 1.26a4.5 4.5 0 00-6.39-6.39zM12 6.75c3.76 0 7.21 2.57 8.44 5.25-.38.86-1.01 1.79-1.85 2.62l-1.14-1.14a6 6 0 00-7.93-7.93l-1.14-1.14A10.1 10.1 0 0112 6.75z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 5.25c4.35 0 8.41 2.98 9.75 6.75-1.34 3.77-5.4 6.75-9.75 6.75S3.59 15.77 2.25 12C3.59 8.23 7.65 5.25 12 5.25zm0 2.25a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"/></svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-[#E85A3B] hover:text-[#d74f33]">Forgot password?</Link>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            className="w-full rounded-xl bg-gradient-to-r from-[#E85A3B] to-[#d74f33] px-4 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-[#E85A3B] hover:text-[#d74f33]">Create one now</Link>
        </p>
      </div>
    </div>
  );
}