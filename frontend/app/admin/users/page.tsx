"use client";
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import Spinner from '@/components/Spinner';

type User = { id: string; name: string; email: string; tier: string; role: string; lifetimePoints: number };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const data = await apiGet<User[]>(`/api/admin/users`);
      setUsers(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin • Users</h1>
      {loading ? (
        <div className="text-sm text-neutral-500"><Spinner label="Loading users" /></div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Tier</th>
              <th className="text-right">Lifetime</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-neutral-50">
                <td className="py-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.tier}</td>
                <td className="text-right">{u.lifetimePoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


