"use client";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/store/auth";

type Tx = { id: string; amount: string; currency: string; createdAt: string };
type Ledger = { id: string; type: "credit" | "debit"; points: number; reason: string; createdAt: string };
type History = { transactions: Tx[]; ledger: Ledger[] };

export default function TransactionHistory({ limit = 10 }: { limit?: number }) {
  const { user } = useAuth();
  const [data, setData] = useState<History | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) return setLoading(false);
      const h = await apiGet<History>(`/api/users/${user.id}/history?limit=${limit}`);
      setData(h);
      setLoading(false);
    })();
  }, [user, limit]);

  if (!user) return <div className="text-sm text-neutral-500">Login to see your recent activity.</div>;
  if (loading) return <div className="text-sm text-neutral-500"><Spinner label="Loading activity" /></div>;

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-xl">
      <div className="mb-3 text-sm font-semibold text-neutral-700">Recent Activity</div>
      <ul className="space-y-2">
        {(data?.ledger || []).slice(0, limit).map((l) => (
          <li key={l.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
            <span className={l.type === "credit" ? "text-green-700" : "text-red-700"}>
              {l.type === "credit" ? "+" : "-"}
              {l.points} pts
            </span>
            <span className="text-neutral-600">{l.reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


