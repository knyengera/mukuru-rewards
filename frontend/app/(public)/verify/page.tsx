"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiGet } from '@/lib/api';
import Spinner from '@/components/Spinner';

export default function VerifyAccountPage() {
  const search = useSearchParams();
  const token = search.get('token') || '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      if (!token) {
        setError('Missing verification token.');
        setLoading(false);
        return;
      }
      try {
        await apiGet(`/api/auth/verify?token=${encodeURIComponent(token)}`);
        setSuccess(true);
      } catch (e: any) {
        setError(e?.message || 'Verification failed.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <div className="min-h-[70vh] w-full px-4 py-10">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-2xl">
        <h1 className="text-center text-3xl font-extrabold text-[#E85A3B]">Verify your email</h1>
        <p className="mt-2 text-center text-sm text-neutral-500">We are confirming your account…</p>

        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-8"><Spinner label="Verifying" /></div>
          ) : success ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7"><path fillRule="evenodd" d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0zm14.03-2.28a.75.75 0 10-1.06-1.06l-4.72 4.72-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25c.3.3.79.3 1.06 0l5.25-5.25z" clipRule="evenodd"/></svg>
              </div>
              <h2 className="text-xl font-semibold">Account verified</h2>
              <p className="mt-1 text-sm text-neutral-600">Your email has been confirmed. You can now log in.</p>
              <Link href="/login" className="mt-6 inline-block rounded-xl bg-gradient-to-r from-[#E85A3B] to-[#d74f33] px-5 py-2 text-sm font-semibold text-white shadow-md">Go to Login</Link>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7"><path fillRule="evenodd" d="M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM9.53 8.47a.75.75 0 011.06 0L12 9.88l1.41-1.41a.75.75 0 111.06 1.06L13.06 10.94l1.41 1.41a.75.75 0 11-1.06 1.06L12 12l-1.41 1.41a.75.75 0 11-1.06-1.06l1.41-1.41-1.41-1.41a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>
              </div>
              <h2 className="text-xl font-semibold">Verification failed</h2>
              <p className="mt-1 text-sm text-neutral-600">The link may be invalid or expired.</p>
              <Link href="/login" className="mt-6 inline-block rounded-xl border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">Back to Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


