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
        eyebrow="Signing Up is Easy!"
        heading="All you need is a valid ID or passport"
        subheading="Choose the option that suits you best to get started."
        cards={[
          {
            iconSrc: "/globe.svg",
            iconAlt: "WhatsApp",
            kicker: "WhatsApp",
            title: "Send Money",
            description:
              "Send money to your friends and family in seconds.",
            actionLabel: "Learn more",
            actionHref: "/send",
          },
          {
            iconSrc: "/window.svg",
            iconAlt: "Find Us",
            kicker: "Find Us",
            title: "Earn Rewards",
            description:
              "Earn rewards for sending and receiving money.",
            actionLabel: "Find us",
            actionHref: "/locations",
          },
          {
            iconSrc: "/file.svg",
            iconAlt: "Get Help",
            kicker: "Get Help",
            title: "Spend Rewards",
            description:
              "Spend your rewards on a wide range of products and services.",
            actionLabel: "Request callback",
            actionHref: "/help/callback",
          },
        ]}
      />
    </>
  );
}
