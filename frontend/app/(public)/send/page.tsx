"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SendMoneyWidget from "@/components/SendMoneyWidget";
import TransactionHistory from "@/components/TransactionHistory";
import PageBanner from "@/components/PageBanner";
import { useAuth } from "@/store/auth";
import { apiPost } from "@/lib/api";
import { popConfetti } from "@/lib/confetti";

export default function SendPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [toast, setToast] = useState<string | null>(null);

  async function handleCalculate(params: {
    sendAmount: number;
    sendCurrency: string;
    receiveCurrency: string;
    receiveMethod: string;
  }) {
    if (!user) {
      router.push("/login");
      return;
    }
    await apiPost(`/api/transactions/send`, { amount: params.sendAmount, currency: params.sendCurrency || "ZAR" });
    popConfetti();
    setToast("Transfer sent! 🎉 Mukuru Miles awarded.");
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <section className="relative isolate overflow-hidden bg-neutral-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-4 py-10 md:grid-cols-2 md:px-6 md:py-14">
        <div>
            <SendMoneyWidget onCalculate={handleCalculate} buttonLabel={user ? 'Send Now' : 'Login to Send'} />
            {toast && <p className="mt-3 text-sm text-green-700">{toast}</p>}
        </div>
        <div className="relative order-first rounded-3xl md:order-last">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/mukuru-card.png')] bg-right bg-no-repeat bg-contain opacity-10" />
          <TransactionHistory />
        </div>
      </div>
    </section>
  );
}


