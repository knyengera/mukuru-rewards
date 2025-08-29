"use client";
import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import Spinner from '@/components/Spinner';

type Kyc = {
  status: 'pending' | 'approved' | 'rejected';
  firstName: string;
  lastName: string;
  idNumber: string;
  country: string;
  documentType: string;
  documentNumber: string;
  documentUrl?: string;
};

export default function MyKycPage() {
  const [kyc, setKyc] = useState<Kyc | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Kyc>({
    status: 'pending',
    firstName: '',
    lastName: '',
    idNumber: '',
    country: 'ZA',
    documentType: 'ID',
    documentNumber: '',
    documentUrl: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<Kyc | null>(`/api/kyc/me`);
        if (data) {
          setKyc(data);
          setForm({ ...data });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function submit() {
    await apiPost(`/api/kyc/submit`, form);
    const data = await apiGet<Kyc | null>(`/api/kyc/me`);
    setKyc(data);
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-bold">My KYC</h1>
      {loading ? (
        <div className="text-sm text-neutral-500"><Spinner label="Loading KYC" /></div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border p-4">
            <div className="mb-2 text-sm font-semibold">Status: <span className="uppercase">{kyc?.status || 'not submitted'}</span></div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input className="rounded border p-2 text-sm" placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              <input className="rounded border p-2 text-sm" placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              <input className="rounded border p-2 text-sm" placeholder="ID/Passport Number" value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} />
              <input className="rounded border p-2 text-sm" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              <input className="rounded border p-2 text-sm" placeholder="Document Type" value={form.documentType} onChange={(e) => setForm({ ...form, documentType: e.target.value })} />
              <input className="rounded border p-2 text-sm" placeholder="Document Number" value={form.documentNumber} onChange={(e) => setForm({ ...form, documentNumber: e.target.value })} />
              <input className="rounded border p-2 text-sm md:col-span-2" placeholder="Document URL" value={form.documentUrl} onChange={(e) => setForm({ ...form, documentUrl: e.target.value })} />
            </div>
            <button className="mt-3 rounded bg-[#E85A3B] px-4 py-2 text-sm font-semibold text-white" onClick={submit}>Submit / Update</button>
          </div>
        </div>
      )}
    </div>
  );
}


