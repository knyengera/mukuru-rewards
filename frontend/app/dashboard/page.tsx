"use client";
import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import { popConfetti } from '@/lib/confetti';
import { useAuth } from '@/store/auth';

type Balance = { balance: number; tier: string; lifetimePoints: number };

export default function DashboardPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [sendAmount, setSendAmount] = useState<number>(100);
  const [loadingSend, setLoadingSend] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const b = await apiGet<Balance>(`/api/users/${user.id}/balance`);
      setBalance(b);
    }
    load();
  }, [user]);

  async function handleSend() {
    setLoadingSend(true);
    await apiPost(`/api/transactions/send`, { amount: sendAmount, currency: 'ZAR' });
    if (user) {
      const b = await apiGet<Balance>(`/api/users/${user.id}/balance`);
      setBalance(b);
    }
    setLoadingSend(false);
    popConfetti();
  }

  if (!user) return <div className="p-6">Please log in to view your dashboard.</div>;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="mb-6 rounded-xl border p-4">
        <div className="text-sm text-neutral-600">Mukuru Miles</div>
        <div className="text-3xl font-extrabold">{balance?.balance ?? 0}</div>
        <div className="text-sm">Tier: {balance?.tier ?? 'bronze'}</div>
      </div>

      <div className="mb-6 rounded-xl border p-4">
        <div className="mb-2 text-sm font-semibold">Simulate Send</div>
        <div className="flex gap-2">
          <input className="w-40 rounded border p-2" type="number" value={sendAmount} onChange={(e) => setSendAmount(Number(e.target.value))} />
          <button className="rounded bg-[#E85A3B] px-4 py-2 font-semibold text-white" onClick={handleSend} disabled={loadingSend}>{loadingSend ? 'Sending…' : 'Send'}</button>
        </div>
      </div>
    </div>
  );
}


