'use client';
import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import { popConfetti } from '@/lib/confetti';
import { useAuth } from '@/store/auth';

type Reward = { id: string; name: string; description?: string; imageUrl?: string; pointsCost: number };

export default function Rewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    (async () => {
      const data = await apiGet<Reward[]>(`/api/rewards`);
      setRewards(data);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const b = await apiGet<{ balance: number }>(`/api/users/${user.id}/balance`);
      setBalance(b.balance);
    })();
  }, [user]);

  async function redeem(rewardId: string) {
    setMessage(null);
    try {
      await apiPost(`/api/rewards/redeem`, { rewardId });
      setMessage('Redeemed successfully!');
      popConfetti();
      if (user) {
        const b = await apiGet<{ balance: number }>(`/api/users/${user.id}/balance`);
        setBalance(b.balance);
      }
    } catch (e: any) {
      setMessage(e?.message || 'Failed to redeem');
    }
  }

  const filtered = useMemo(() => {
    if (filter === 'all') return rewards;
    return rewards.filter((r: any) => r.category === filter);
  }, [rewards, filter]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Rewards</h1>
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700">Your Miles: <span className="font-bold">{balance}</span></div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Category</label>
          <select className="rounded border p-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="airtime">Airtime</option>
            <option value="data">Data</option>
            <option value="digital">Digital</option>
          </select>
        </div>
      </div>
      {message && <p className="mb-3 text-sm text-green-600">{message}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {filtered.map((r) => (
          <div key={r.id} className="rounded-xl border p-4">
            <div className="text-lg font-semibold">{r.name}</div>
            <div className="text-sm text-neutral-600">{r.description}</div>
            <div className="mt-2 text-sm">Cost: {r.pointsCost} miles</div>
            {user && (
              <button className="mt-3 rounded bg-[#E85A3B] px-3 py-1 text-white disabled:opacity-50" onClick={() => redeem(r.id)} disabled={balance < r.pointsCost}>
                Redeem
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}