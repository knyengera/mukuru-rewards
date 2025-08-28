import CTA from "@/components/CTA";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
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
