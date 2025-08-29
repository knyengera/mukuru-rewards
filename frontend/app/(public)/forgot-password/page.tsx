"use client";

import { useState } from 'react';
import Link from 'next/link';
import { apiPost } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);
    try {
      await apiPost(`/api/auth/forgot-password`, { email });
      setStatus('If your email exists, we have sent you a reset link.');
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] w-full px-4 py-10">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-2xl">
        <h1 className="text-center text-3xl font-extrabold text-[#E85A3B]">Forgot Password</h1>
        <p className="mt-2 text-center text-sm text-neutral-500">Enter your email and we will send you a reset link</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Email</label>
            <input
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-orange-300 focus:ring"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {status && <p className="text-sm text-green-600">{status}</p>}

          <button
            className="w-full rounded-xl bg-gradient-to-r from-[#E85A3B] to-[#d74f33] px-4 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Remembered your password?{' '}
          <Link href="/login" className="text-[#E85A3B] hover:text-[#d74f33]">Login</Link>
        </p>
      </div>
    </div>
  );
}


