"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiPost } from '@/lib/api';

export default function ResetPasswordPage() {
  const search = useSearchParams();
  const token = search.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError('Missing reset token.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await apiPost(`/api/auth/reset-password`, { token, password });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] w-full px-4 py-10">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-2xl">
        <h1 className="text-center text-3xl font-extrabold text-[#E85A3B]">Reset Password</h1>
        <p className="mt-2 text-center text-sm text-neutral-500">Create a new password for your account</p>

        {success ? (
          <div className="mt-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7"><path fillRule="evenodd" d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0zm14.03-2.28a.75.75 0 10-1.06-1.06l-4.72 4.72-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25c.3.3.79.3 1.06 0l5.25-5.25z" clipRule="evenodd"/></svg>
            </div>
            <h2 className="text-xl font-semibold">Password updated</h2>
            <p className="mt-1 text-sm text-neutral-600">You can now log in with your new password.</p>
            <Link href="/login" className="mt-6 inline-block rounded-xl bg-gradient-to-r from-[#E85A3B] to-[#d74f33] px-5 py-2 text-sm font-semibold text-white shadow-md">Go to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">New password</label>
              <div className="relative">
                <input
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 pr-10 text-sm outline-none ring-orange-300 focus:ring"
                  placeholder="Enter new password"
                  type={show1 ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-500 hover:text-neutral-700" onClick={() => setShow1((s) => !s)} aria-label={show1 ? 'Hide password' : 'Show password'}>
                  {show1 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M3.53 2.47a.75.75 0 10-1.06 1.06l18 18a.75.75 0 101.06-1.06l-2.21-2.21A11.74 11.74 0 0021.75 12c-1.34-3.77-5.4-6.75-9.75-6.75-1.64 0-3.2.36-4.6 1.03l-3.87-3.81zm6.3 6.3l1.26 1.26a3 3 0 013.87 3.87l1.26 1.26a4.5 4.5 0 00-6.39-6.39zM12 6.75c3.76 0 7.21 2.57 8.44 5.25-.38.86-1.01 1.79-1.85 2.62l-1.14-1.14a6 6 0 00-7.93-7.93l-1.14-1.14A10.1 10.1 0 0112 6.75z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 5.25c4.35 0 8.41 2.98 9.75 6.75-1.34 3.77-5.4 6.75-9.75 6.75S3.59 15.77 2.25 12C3.59 8.23 7.65 5.25 12 5.25zm0 2.25a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"/></svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Confirm password</label>
              <div className="relative">
                <input
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 pr-10 text-sm outline-none ring-orange-300 focus:ring"
                  placeholder="Re-enter new password"
                  type={show2 ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-500 hover:text-neutral-700" onClick={() => setShow2((s) => !s)} aria-label={show2 ? 'Hide password' : 'Show password'}>
                  {show2 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M3.53 2.47a.75.75 0 10-1.06 1.06l18 18a.75.75 0 101.06-1.06l-2.21-2.21A11.74 11.74 0 0021.75 12c-1.34-3.77-5.4-6.75-9.75-6.75-1.64 0-3.2.36-4.6 1.03l-3.87-3.81zm6.3 6.3l1.26 1.26a3 3 0 013.87 3.87l1.26 1.26a4.5 4.5 0 00-6.39-6.39zM12 6.75c3.76 0 7.21 2.57 8.44 5.25-.38.86-1.01 1.79-1.85 2.62l-1.14-1.14a6 6 0 00-7.93-7.93l-1.14-1.14A10.1 10.1 0 0112 6.75z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 5.25c4.35 0 8.41 2.98 9.75 6.75-1.34 3.77-5.4 6.75-9.75 6.75S3.59 15.77 2.25 12C3.59 8.23 7.65 5.25 12 5.25zm0 2.25a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button className="w-full rounded-xl bg-gradient-to-r from-[#E85A3B] to-[#d74f33] px-4 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-60" disabled={loading}>
              {loading ? 'Updating…' : 'Reset password'}
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-neutral-600">
          Remembered your password?{' '}
          <Link href="/login" className="text-[#E85A3B] hover:text-[#d74f33]">Login</Link>
        </p>
      </div>
    </div>
  );
}


