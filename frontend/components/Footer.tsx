import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[#E85A3B] bg-[#E85A3B] text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-white/90">© {year} Mukuru Rewards</span>
          <span className="hidden h-4 w-px bg-white/30 md:inline-block" />
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          <span className="h-4 w-px bg-white/30" />
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
          <span className="h-4 w-px bg-white/30" />
          <a href="https://www.mukuru.com" target="_blank" rel="noreferrer" className="hover:text-white">
            mukuru.com
          </a>
        </div>

        <div className="flex items-center gap-3 text-white/90">
          <a href="https://x.com" aria-label="X" target="_blank" rel="noreferrer" className="rounded-full p-2 hover:bg-white/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2H21l-6.553 7.49L22 22h-6.59l-4.61-6.018L5.4 22H3l7.02-8.02L2 2h6.69l4.26 5.73L18.244 2Zm-2.31 18h1.27L8.14 4h-1.3l9.094 16Z"/></svg>
          </a>
          <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer" className="rounded-full p-2 hover:bg-white/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.503 17.523 2 12 2S2 6.503 2 12.06c0 5.02 3.657 9.19 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.196 2.238.196v2.47h-1.26c-1.243 0-1.63.778-1.63 1.576v1.89h2.773l-.443 2.91h-2.33v7.03C18.343 21.25 22 17.08 22 12.06Z"/></svg>
          </a>
          <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer" className="rounded-full p-2 hover:bg-white/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.51 5.51 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5Zm5.75-3.25a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25Z"/></svg>
          </a>
          <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer" className="rounded-full p-2 hover:bg-white/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S.017 4.88.017 3.5C.017 2.12 1.12 1 2.5 1s2.483 1.12 2.483 2.5ZM.25 8.5h4.5V23H.25V8.5Zm7.5 0h4.31v2.03h.06c.6-1.14 2.07-2.34 4.27-2.34 4.56 0 5.41 3 5.41 6.9V23h-4.5v-6.49c0-1.55-.03-3.54-2.16-3.54-2.16 0-2.49 1.68-2.49 3.42V23h-4.5V8.5Z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}


