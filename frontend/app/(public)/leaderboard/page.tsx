'use client';
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

type Leader = { userId: string; name: string; email: string; pointsEarned?: number; rewardsCount?: number };

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'earned' | 'redeemed'>('earned');
  const [range, setRange] = useState<'weekly' | 'all'>('weekly');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await apiGet<Leader[]>(`/api/leaderboard/rewards?limit=50&type=${mode}&range=${range}`);
      setLeaders(data);
      setLoading(false);
    })();
  }, [mode, range]);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <div className="flex gap-2">
          <select className="rounded border p-2 text-sm" value={mode} onChange={(e) => setMode(e.target.value as any)}>
            <option value="earned">Earned (Miles)</option>
            <option value="redeemed">Redeemed (Count)</option>
          </select>
          <select className="rounded border p-2 text-sm" value={range} onChange={(e) => setRange(e.target.value as any)}>
            <option value="weekly">Weekly</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="animate-pulse text-sm text-neutral-500">Loading…</div>
      ) : (
        <ol className="space-y-2">
          {leaders.map((l, i) => (
            <li key={l.userId} className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-700">{i + 1}</div>
                <div>
                  <div className="text-sm font-semibold">{l.name || 'User'}</div>
                  <div className="text-xs text-neutral-500">{l.email}</div>
                </div>
              </div>
              <div className="text-sm font-bold">{mode === 'earned' ? (l.pointsEarned ?? 0) : (l.rewardsCount ?? 0)}</div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}


