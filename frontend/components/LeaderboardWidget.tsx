'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import Spinner from '@/components/Spinner';

type Leader = { userId: string; name: string; email: string; pointsEarned?: number; rewardsCount?: number };

export default function LeaderboardWidget() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<Leader[]>(`/api/leaderboard/rewards?limit=5&type=earned&range=weekly`);
        setLeaders(data);
      } catch {}
      setLoading(false);
    })();
  }, []);

  return (
    <div className="w-full max-w-md rounded-3xl bg-white/90 p-5 shadow-2xl backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-neutral-900">Weekly Leaders</h3>
        <span className="rounded-full bg-[#E85A3B]/10 px-3 py-1 text-xs font-semibold text-[#E85A3B]">Mukuru Miles</span>
      </div>
      {loading ? (
        <div className="text-sm text-neutral-500"><Spinner label="Loading leaders" /></div>
      ) : (
        <ol className="space-y-2">
          {leaders.map((l, idx) => (
            <li key={l.userId} className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-700">
                  {l.name?.slice(0, 2)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{idx + 1}. {l.name || 'User'}</div>
                  <div className="text-xs text-neutral-500">{l.email}</div>
                </div>
              </div>
              <div className="text-sm font-bold text-neutral-900">{l.pointsEarned ?? 0}</div>
            </li>
          ))}
        </ol>
      )}
      <Link href="/leaderboard" className="mt-4 block w-full rounded-full bg-[#E85A3B] py-2 text-center text-sm font-semibold text-white hover:bg-[#d74f33]">
        See full leaderboard
      </Link>
    </div>
  );
}


