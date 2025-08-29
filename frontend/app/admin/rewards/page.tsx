"use client";
import { useEffect, useState } from 'react';
import { apiGet, apiPatch, apiPost } from '@/lib/api';
import Spinner from '@/components/Spinner';

type Reward = { id: string; name: string; description?: string; pointsCost: number; category?: string; active: boolean };

export default function AdminRewardsPage() {
  const [rows, setRows] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Reward>>({ name: '', pointsCost: 0, category: 'digital', active: true });
  useEffect(() => {
    (async () => {
      const data = await apiGet<Reward[]>(`/api/rewards`);
      setRows(data);
      setLoading(false);
    })();
  }, []);

  async function createReward() {
    await apiPost(`/api/admin/rewards`, form);
    const data = await apiGet<Reward[]>(`/api/rewards`);
    setRows(data);
    setForm({ name: '', pointsCost: 0, category: 'digital', active: true });
  }

  async function toggleActive(id: string, active: boolean) {
    await apiPatch(`/api/admin/rewards/${id}`, { active });
    const data = await apiGet<Reward[]>(`/api/rewards`);
    setRows(data);
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin • Rewards</h1>
      <div className="mb-6 rounded-xl border p-4">
        <div className="mb-2 text-sm font-semibold">Create Reward</div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          <input className="rounded border p-2 text-sm" placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="rounded border p-2 text-sm" type="number" placeholder="Points" value={form.pointsCost || 0} onChange={(e) => setForm({ ...form, pointsCost: Number(e.target.value) })} />
          <input className="rounded border p-2 text-sm" placeholder="Category" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <button className="rounded bg-[#E85A3B] px-4 py-2 text-sm font-semibold text-white" onClick={createReward}>Create</button>
        </div>
      </div>
      {loading ? (
        <div className="text-sm text-neutral-500"><Spinner label="Loading rewards" /></div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th>Cost</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b hover:bg-neutral-50">
                <td className="py-2">{r.name}</td>
                <td>{r.pointsCost}</td>
                <td>{r.category}</td>
                <td>
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
                    <input type="checkbox" checked={r.active} onChange={(e) => toggleActive(r.id, e.target.checked)} />
                    {r.active ? 'Active' : 'Inactive'}
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


