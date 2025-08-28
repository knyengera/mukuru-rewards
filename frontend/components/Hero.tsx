import Image from "next/image";
import SendMoneyWidget from "./SendMoneyWidget";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#EA5B3A]">
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
                href="#send-money"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#EA5B3A] hover:bg-neutral-100"
              >
                Send money now
                <span>🚀</span>
              </a>
              <a
                href="#signup"
                className="inline-flex items-center gap-2 rounded-full border border-white/80 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Sign up
              </a>
            </div>
          </div>

          {/* Center image */}
          <div className="relative mx-auto hidden h-[440px] w-full max-w-[520px] md:block">
            <Image
              src="/send-money-home.webp"
              alt="Mukuru send money hero"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Right widget */}
          <div id="send-money" className="md:justify-self-end">
            <SendMoneyWidget />
          </div>
        </div>
      </div>
    </section>
  );
}


