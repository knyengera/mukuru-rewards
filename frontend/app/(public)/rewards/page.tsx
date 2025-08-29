'use client';
import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import { popConfetti } from '@/lib/confetti';
import { useAuth } from '@/store/auth';

type Reward = { id: string; name: string; description?: string; imageUrl?: string; pointsCost: number };
type CartItem = { reward: Reward; quantity: number };

export default function Rewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [filter, setFilter] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);

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

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.reward.pointsCost * item.quantity, 0);
  }, [cart]);

  const canCheckout = !!user && cart.length > 0 && cartTotal <= balance && !checkingOut;

  function addToCart(reward: Reward) {
    if (!user) {
      setMessage('Log in to add rewards to your cart.');
      return;
    }
    setMessage(null);
    setCart((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.reward.id === reward.id);
      const currentTotal = prev.reduce((sum, item) => sum + item.reward.pointsCost * item.quantity, 0);
      const nextTotal = currentTotal + reward.pointsCost;
      if (nextTotal > balance) {
        setMessage('Not enough Mukuru Miles for this selection.');
        return prev;
      }
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], quantity: next[existingIndex].quantity + 1 };
        return next;
      }
      return [...prev, { reward, quantity: 1 }];
    });
  }

  function removeFromCart(rewardId: string) {
    setCart((prev) => {
      const index = prev.findIndex((ci) => ci.reward.id === rewardId);
      if (index === -1) return prev;
      const next = [...prev];
      const item = next[index];
      if (item.quantity > 1) {
        next[index] = { ...item, quantity: item.quantity - 1 };
      } else {
        next.splice(index, 1);
      }
      return next;
    });
  }

  async function checkout() {
    if (!user) {
      setMessage('Log in to checkout.');
      return;
    }
    if (cart.length === 0) return;
    if (cartTotal > balance) {
      setMessage('Your cart total exceeds your available Mukuru Miles.');
      return;
    }
    setCheckingOut(true);
    setMessage(null);
    try {
      for (const item of cart) {
        for (let i = 0; i < item.quantity; i += 1) {
          await apiPost(`/api/rewards/redeem`, { rewardId: item.reward.id });
        }
      }
      setMessage('Checkout successful! Rewards redeemed.');
      setCart([]);
      // Refresh balance
      const b = await apiGet<{ balance: number }>(`/api/users/${user.id}/balance`);
      setBalance(b.balance);
      popConfetti();
    } catch (e: any) {
      setMessage(e?.message || 'Checkout failed.');
    } finally {
      setCheckingOut(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        {user ? (
          <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700">Your Miles: <span className="font-bold">{balance}</span></div>
        ) : (
          <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700">Log in to view your Mukuru Miles.</div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm">Category</label>
            <select className="rounded border p-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="airtime">Airtime</option>
              <option value="data">Data</option>
              <option value="digital">Digital</option>
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-2 text-sm text-neutral-700">
            <span>Cart: <span className="font-semibold">{cart.reduce((n, i) => n + i.quantity, 0)}</span></span>
            <span className="ml-2">Total: <span className="font-semibold">{cartTotal}</span></span>
            <button
              className="ml-3 rounded bg-[#E85A3B] px-3 py-1 text-white disabled:opacity-50"
              onClick={checkout}
              disabled={!canCheckout}
            >
              {checkingOut ? 'Checking out...' : 'Checkout'}
            </button>
          </div>
        </div>
      </div>
      {message && <p className="mb-3 text-sm text-green-600">{message}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {filtered.map((r) => (
          <div key={r.id} className="rounded-xl border p-4">
            <div className="text-lg font-semibold">{r.name}</div>
            <div className="text-sm text-neutral-600">{r.description}</div>
            <div className="mt-2 text-sm">Cost: {r.pointsCost} miles</div>
            <div className="mt-3 flex gap-2">
              {user && (
                <button className="rounded bg-[#E85A3B] px-3 py-1 text-white disabled:opacity-50" onClick={() => redeem(r.id)} disabled={balance < r.pointsCost}>
                  Redeem now
                </button>
              )}
              <button
                className="rounded border border-neutral-300 px-3 py-1 text-sm disabled:opacity-50"
                onClick={() => addToCart(r)}
                disabled={!user || (cartTotal + r.pointsCost) > balance}
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}