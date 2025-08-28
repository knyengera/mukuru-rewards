"use client";
import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import { popConfetti } from '@/lib/confetti';
import { useAuth } from '@/store/auth';

type Balance = { balance: number; tier: string; lifetimePoints: number };
type Tx = { id: string; amount: string; currency: string; createdAt: string };
type Ledger = { id: string; type: 'credit' | 'debit'; points: number; reason: string; createdAt: string };
type History = { transactions: Tx[]; ledger: Ledger[] };
type Achievement = { achievementId: string; code: string; name: string; description: string; icon?: string; createdAt: string };
type SeriesPoint = { date: string; value: number };

export default function DashboardPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [sendAmount, setSendAmount] = useState<number>(100);
  const [loadingSend, setLoadingSend] = useState(false);
  const [history, setHistory] = useState<History | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [unlockedToast, setUnlockedToast] = useState<Achievement[]>([]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const b = await apiGet<Balance>(`/api/users/${user.id}/balance`);
      setBalance(b);
      const h = await apiGet<History>(`/api/users/${user.id}/history?limit=10`);
      setHistory(h);
      const a = await apiGet<Achievement[]>(`/api/achievements/me`);
      setAchievements(a);

      // Build simple daily points series (net credits - debits)
      const dayMap = new Map<string, number>();
      for (const l of h.ledger || []) {
        const d = new Date(l.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const v = (dayMap.get(key) || 0) + (l.type === 'credit' ? l.points : -l.points);
        dayMap.set(key, v);
      }
      const sorted = Array.from(dayMap.entries())
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => (a.date < b.date ? -1 : 1));
      setSeries(sorted);
    }
    load();
  }, [user]);

  async function handleSend() {
    setLoadingSend(true);
    const before = await apiGet<Achievement[]>(`/api/achievements/me`).catch(() => [] as Achievement[]);
    await apiPost(`/api/transactions/send`, { amount: sendAmount, currency: 'ZAR' });
    if (user) {
      const b = await apiGet<Balance>(`/api/users/${user.id}/balance`);
      setBalance(b);
      const h = await apiGet<History>(`/api/users/${user.id}/history?limit=10`);
      setHistory(h);
      const after = await apiGet<Achievement[]>(`/api/achievements/me`).catch(() => [] as Achievement[]);
      setAchievements(after);
      const beforeSet = new Set(before.map((a) => a.achievementId));
      const newly = after.filter((a) => !beforeSet.has(a.achievementId));
      if (newly.length) {
        setUnlockedToast(newly);
        setTimeout(() => setUnlockedToast([]), 3500);
      }
    }
    setLoadingSend(false);
    popConfetti();
  }

  if (!user) return <div className="p-6">Please log in to view your dashboard.</div>;

  function nextTierGoal(lp: number) {
    if (lp >= 2000) return { label: 'Gold', current: 2000, next: 2000, progress: 100 };
    if (lp >= 500) return { label: 'Silver → Gold', current: lp - 500, next: 1500, progress: Math.min(100, Math.round(((lp - 500) / 1500) * 100)) };
    return { label: 'Bronze → Silver', current: lp, next: 500, progress: Math.min(100, Math.round((lp / 500) * 100)) };
  }
  const lp = balance?.lifetimePoints ?? 0;
  const goal = nextTierGoal(lp);

  return (
    <div className="p-6">
      {unlockedToast.length > 0 && (
        <div className="fixed right-4 top-16 z-50 w-72 rounded-xl border border-green-200 bg-white p-3 shadow-xl">
          <div className="mb-1 text-sm font-semibold text-green-700">Badge unlocked!</div>
          <ul className="space-y-1">
            {unlockedToast.map((a) => (
              <li key={a.achievementId} className="text-sm">
                <span className="mr-1">{a.icon ?? '🏅'}</span>
                {a.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="mb-6 rounded-xl border p-4">
        <div className="text-sm text-neutral-600">Mukuru Miles</div>
        <div className="text-3xl font-extrabold">{balance?.balance ?? 0}</div>
        <div className="text-sm">Tier: {balance?.tier ?? 'bronze'}</div>
      </div>

      <div className="mb-6 rounded-xl border p-4">
        <div className="mb-2 text-sm font-semibold">Progress to next tier</div>
        <div className="mb-1 flex items-center justify-between text-xs text-neutral-600">
          <span>{goal.label}</span>
          <span>
            {goal.current} / {goal.next}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-neutral-200">
          <div className="h-2 bg-[#E85A3B]" style={{ width: `${goal.progress}%` }} />
        </div>
      </div>

      <div className="mb-6 rounded-xl border p-4">
        <div className="mb-2 text-sm font-semibold">Simulate Send</div>
        <div className="flex gap-2">
          <input className="w-40 rounded border p-2" type="number" value={sendAmount} onChange={(e) => setSendAmount(Number(e.target.value))} />
          <button className="rounded bg-[#E85A3B] px-4 py-2 font-semibold text-white" onClick={handleSend} disabled={loadingSend}>{loadingSend ? 'Sending…' : 'Send'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <div className="mb-3 text-sm font-semibold">Points over time</div>
          {series.length === 0 ? (
            <div className="text-sm text-neutral-500">No data yet.</div>
          ) : (
            <div className="h-32 w-full">
              <svg viewBox={`0 0 300 100`} className="h-full w-full">
                <polyline
                  fill="none"
                  stroke="#E85A3B"
                  strokeWidth="3"
                  points={series
                    .map((p, i) => {
                      const x = (i / Math.max(1, series.length - 1)) * 300;
                      const min = Math.min(...series.map((s) => s.value));
                      const max = Math.max(...series.map((s) => s.value));
                      const range = max - min || 1;
                      const y = 100 - ((p.value - min) / range) * 100;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
              </svg>
            </div>
          )}
        </div>
        <div className="rounded-xl border p-4">
          <div className="mb-3 text-sm font-semibold">Recent Activity</div>
          <ul className="space-y-2">
            {history?.ledger?.slice(0, 8).map((l) => (
              <li key={l.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                <span className={l.type === 'credit' ? 'text-green-700' : 'text-red-700'}>
                  {l.type === 'credit' ? '+' : '-'}{l.points} pts
                </span>
                <span className="text-neutral-600">{l.reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border p-4">
          <div className="mb-3 text-sm font-semibold">Achievements</div>
          {achievements.length === 0 ? (
            <div className="text-sm text-neutral-500">No badges yet. Make your first send!</div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {achievements.map((a) => (
                <div key={a.achievementId} className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                  <span>{a.icon ?? '⭐'}</span>
                  <span className="font-semibold">{a.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


