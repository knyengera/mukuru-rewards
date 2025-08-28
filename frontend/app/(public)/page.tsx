import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <CTA
        eyebrow="Signing Up is Easy!"
        heading="All you need is a valid ID or passport"
        subheading="Choose the option that suits you best to get started."
        cards={[
          {
            iconSrc: "/globe.svg",
            iconAlt: "WhatsApp",
            kicker: "WhatsApp",
            title: "Sign up & collect",
            description:
              "Instantly order and collect your card at selected Clicks stores.",
            actionLabel: "Learn more",
            actionHref: "/signup/whatsapp",
          },
          {
            iconSrc: "/window.svg",
            iconAlt: "Find Us",
            kicker: "Find Us",
            title: "Branch or Info Centre",
            description:
              "Visit your nearest Mukuru Branch and apply for a Mukuru Card.",
            actionLabel: "Find us",
            actionHref: "/locations",
          },
          {
            iconSrc: "/file.svg",
            iconAlt: "Get Help",
            kicker: "Get Help",
            title: "Request a call back",
            description:
              "Request a call back from our team who will help you sign up.",
            actionLabel: "Request callback",
            actionHref: "/help/callback",
          },
        ]}
      />
    </>
  );
}
