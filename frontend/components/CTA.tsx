"use client";

import Image from "next/image";
import Link from "next/link";

type CTACard = {
  iconSrc?: string;
  iconText?: string;
  iconAlt: string;
  kicker: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

type CTAProps = {
  eyebrow: string;
  heading: string;
  subheading?: string;
  cards: CTACard[];
};

export default function CTA({ eyebrow, heading, subheading, cards }: CTAProps) {
  return (
    <section className="bg-neutral-900 py-14 text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-orange-400">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            {heading}
          </h2>
          {subheading && (
            <p className="mx-auto mt-2 max-w-3xl text-neutral-300">
              {subheading}
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title + card.kicker}
              className="rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 text-center shadow-xl"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900">
                {card.iconText ? (
                  <span className="text-2xl font-bold text-orange-400" aria-hidden="true">{card.iconText}</span>
                ) : (
                  card.iconSrc ? (
                    <Image src={card.iconSrc} alt={card.iconAlt} width={36} height={36} />
                  ) : null
                )}
              </div>
              <p className="mt-4 text-sm text-neutral-300">{card.kicker}</p>
              <h3 className="mt-1 text-lg font-semibold text-orange-400">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                {card.description}
              </p>
              <div className="mt-5">
                <Link
                  href={card.actionHref}
                  className="inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-500"
                >
                  {card.actionLabel}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


