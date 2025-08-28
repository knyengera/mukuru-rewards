"use client";
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

type Tx = { id: string; userId: string; amount: string; currency: string; createdAt: string };

export default function AdminTransactionsPage() {
  const [rows, setRows] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const data = await apiGet<Tx[]>(`/api/admin/transactions`);
      setRows(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin • Transactions</h1>
      {loading ? (
        <div className="text-sm text-neutral-500">Loading…</div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">User</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-b hover:bg-neutral-50">
                <td className="py-2">{t.userId}</td>
                <td>{t.amount}</td>
                <td>{t.currency}</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


