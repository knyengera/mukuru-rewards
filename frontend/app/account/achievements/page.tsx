"use client";
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

type Achievement = { achievementId: string; code: string; name: string; description: string; icon?: string; createdAt: string };

export default function MyAchievementsPage() {
  const [rows, setRows] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await apiGet<Achievement[]>(`/api/achievements/me`);
      setRows(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">My Achievements</h1>
      {loading ? (
        <div className="text-sm text-neutral-500">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-neutral-600">No badges yet. Make your first send to unlock your first badge!</div>
      ) : (
        <ul className="flex flex-wrap gap-3">
          {rows.map((a) => (
            <li key={a.achievementId} className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              <span>{a.icon ?? '🏅'}</span>
              <span className="font-semibold">{a.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


