"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/store/auth";
import { apiPost } from "@/lib/api";
import { popConfetti } from "@/lib/confetti";
import { useRouter } from "next/navigation";
import SendMoneyWidget from "./SendMoneyWidget";

export default function Hero() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  async function handleCalculate({ sendAmount, sendCurrency }: { sendAmount: number; sendCurrency: string }) {
    if (!user) {
      router.push('/login');
      return;
    }
    await apiPost(`/api/transactions/send`, { amount: sendAmount, currency: sendCurrency || 'ZAR' });
    popConfetti();
    setToast("Sent successfully! 🎉 You earned Mukuru Miles.");
    setTimeout(() => setToast(null), 3000);
  }
  return (
    <section
      className="relative overflow-hidden bg-neutral-900"
      style={{
        backgroundImage: 'url(/send-money-home.webp)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center bottom',
        backgroundSize: 'contain',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr_0.9fr]">
          {/* Left copy */}
          <div className="text-white">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Fast, Rewarding Money Transfers
            </h1>
            <p className="mt-4 max-w-md text-lg/7 text-white/90">
              Earn Mukuru Rewards every time you send money. Unlock discounts,
              bonuses and more across our services.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/send"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#EA5B3A] hover:bg-neutral-100"
              >
                Send money now
                <span>🚀</span>
              </a>
              <a
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-full border border-white/80 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Sign up
              </a>
            </div>
          </div>

          {/* Center column spacer */}
          <div className="hidden h-[440px] w-full max-w-[520px] md:block" />

          {/* Right widget */}
          <div id="send-money" className="md:justify-self-end">
              <SendMoneyWidget onCalculate={handleCalculate} />
              {toast && <p className="mt-3 text-sm text-green-700">{toast}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}


