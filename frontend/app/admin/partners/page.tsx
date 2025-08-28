"use client";
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

type Partner = { id: string; name: string; contactEmail?: string; active: boolean; createdAt: string };

export default function AdminPartnersPage() {
  const [rows, setRows] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const data = await apiGet<Partner[]>(`/api/admin/partners`);
      setRows(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin • Partners</h1>
      {loading ? (
        <div className="text-sm text-neutral-500">Loading…</div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b hover:bg-neutral-50">
                <td className="py-2">{p.name}</td>
                <td>{p.contactEmail}</td>
                <td>{p.active ? 'Active' : 'Inactive'}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


