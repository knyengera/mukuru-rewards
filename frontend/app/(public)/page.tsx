"use client";
import CTA from "@/components/CTA";
import Hero from "@/components/Hero";
import LeaderboardWidget from "@/components/LeaderboardWidget";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Hero />
      <section
        className="relative isolate overflow-hidden bg-[#E85A3B] px-6 py-16 text-white"
        style={{
          backgroundImage: 'url(/mukuru-card.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: mounted ? 'right center' : 'left center',
          backgroundSize: 'contain',
          transition: 'background-position 800ms ease-out',
        }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className={`order-2 md:order-1 transform transition-all duration-700 ease-out ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
            <LeaderboardWidget />
          </div>
          <div className="order-1 md:order-2" />
        </div>
      </section>

      <CTA
        eyebrow="It's simple"
        heading="Send. Earn. Spend."
        subheading="Move money, collect Mukuru Miles, and redeem them for great rewards."
        cards={[
          {
            iconSrc: "/globe.svg",
            iconAlt: "Send",
            kicker: "Send",
            title: "Send money fast",
            description: "Low-friction transfers to your loved ones.",
            actionLabel: "Start sending",
            actionHref: "/send",
          },
          {
            iconText: "$",
            iconAlt: "Earn",
            kicker: "Earn",
            title: "Earn Mukuru Miles",
            description: "Get points on every qualifying transfer.",
            actionLabel: "See how it works",
            actionHref: "/rewards",
          },
          {
            iconSrc: "/window.svg",
            iconAlt: "Spend",
            kicker: "Spend",
            title: "Spend your rewards",
            description: "Redeem for airtime, data and digital goodies.",
            actionLabel: "Browse rewards",
            actionHref: "/rewards",
          },
        ]}
      />
    </>
  );
}
