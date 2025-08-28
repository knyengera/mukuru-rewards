'use client';
import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import { useAuth } from '@/store/auth';

type Reward = { id: string; name: string; description?: string; imageUrl?: string; pointsCost: number };

export default function Rewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const data = await apiGet<Reward[]>(`/api/rewards`);
      setRewards(data);
      setLoading(false);
    })();
  }, []);

  async function redeem(rewardId: string) {
    setMessage(null);
    try {
      await apiPost(`/api/rewards/redeem`, { rewardId });
      setMessage('Redeemed successfully!');
    } catch (e: any) {
      setMessage(e?.message || 'Failed to redeem');
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Rewards</h1>
      {message && <p className="mb-3 text-sm text-green-600">{message}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {rewards.map((r) => (
          <div key={r.id} className="rounded-xl border p-4">
            <div className="text-lg font-semibold">{r.name}</div>
            <div className="text-sm text-neutral-600">{r.description}</div>
            <div className="mt-2 text-sm">Cost: {r.pointsCost} miles</div>
            {user && (
              <button className="mt-3 rounded bg-[#E85A3B] px-3 py-1 text-white" onClick={() => redeem(r.id)}>
                Redeem
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}