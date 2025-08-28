"use client";
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

type Redemption = { id: string; userId: string; rewardId: string; pointsSpent: number; status: string; createdAt: string };

export default function AdminRedemptionsPage() {
  const [rows, setRows] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const data = await apiGet<Redemption[]>(`/api/admin/redemptions`);
      setRows(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin • Redemptions</h1>
      {loading ? (
        <div className="text-sm text-neutral-500">Loading…</div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">User</th>
              <th>Reward</th>
              <th>Points</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b hover:bg-neutral-50">
                <td className="py-2">{r.userId}</td>
                <td>{r.rewardId}</td>
                <td>{r.pointsSpent}</td>
                <td>{r.status}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


