type Props = {
  title: string;
  subtitle?: string;
  image?: string; // path in /public, defaults to mukuru-card.png
};

export default function PageBanner({ title, subtitle, image = "/mukuru-card.png" }: Props) {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#E85A3B] text-white"
      style={{ height: 120 }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="z-10 max-w-2xl">
          <h1 className="text-xl font-extrabold leading-tight sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-white/90">{subtitle}</p>}
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-right bg-no-repeat"
          style={{ backgroundImage: `url(${image})`, backgroundSize: "contain" }}
          aria-hidden
        />
      </div>
    </section>
  );
}


