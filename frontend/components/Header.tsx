"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import { getAuthToken } from "@/lib/api";
import { useRouter } from "next/navigation";

type NavItem = {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

const navItems: NavItem[] = [
  { label: "Send Money", href: "/send" },
  { label: "Earn Rewards", href: "/rewards" },
  { label: "Spend Rewards", href: "/spend" },
  { label: "About Mukuru Rewards", href: "/about" }
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsAdmin(false);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      setIsAdmin(payload?.role === 'admin' || payload?.scope === 'admin');
    } catch {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.webp" alt="Logo" width={100} height={100} />
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.children ? (
                <button
                  className="text-sm font-medium text-neutral-200 hover:text-white focus:outline-none"
                  onClick={() =>
                    setOpenDropdown((prev) => (prev === item.label ? null : item.label))
                  }
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  href={item.href || "#"}
                  className="text-sm font-medium text-neutral-200 hover:text-white"
                >
                  {item.label}
                </Link>
              )}
              {item.children && openDropdown === item.label && (
                <div
                  className="absolute left-0 mt-3 w-44 rounded-md border border-neutral-800 bg-neutral-900 p-2 shadow-xl"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block rounded px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800 hover:text-white"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="ml-4 flex items-center gap-3">
            {isAdmin && (
              <div className="relative" onMouseEnter={() => setOpenDropdown('Admin')} onMouseLeave={() => setOpenDropdown(null)}>
                <button className="text-sm font-medium text-neutral-200 hover:text-white">Admin</button>
                {openDropdown === 'Admin' && (
                <div className="absolute right-0 top-full z-50 w-52 rounded-md border border-neutral-800 bg-neutral-900 p-2 shadow-xl">
                  <Link href="/admin/users" className="block rounded px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800 hover:text-white">Users</Link>
                  <Link href="/admin/rewards" className="block rounded px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800 hover:text-white">Rewards</Link>
                  <Link href="/admin/redemptions" className="block rounded px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800 hover:text-white">Redemptions</Link>
                  <Link href="/admin/partners" className="block rounded px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800 hover:text-white">Partners</Link>
                  <Link href="/admin/transactions" className="block rounded px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800 hover:text-white">Transactions</Link>
                  <Link href="/admin/kyc" className="block rounded px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800 hover:text-white">KYC</Link>
                </div>
                )}
              </div>
            )}
            {user && (
              <div className="relative" onMouseEnter={() => setOpenDropdown('Account')} onMouseLeave={() => setOpenDropdown(null)}>
                <button className="text-sm font-medium text-neutral-200 hover:text-white">My Account</button>
                {openDropdown === 'Account' && (
                <div className="absolute right-0 top-full z-50 w-52 rounded-md border border-neutral-800 bg-neutral-900 p-2 shadow-xl">
                  <Link href="/dashboard" className="block rounded px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800 hover:text-white">Dashboard</Link>
                  <Link href="/account/achievements" className="block rounded px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800 hover:text-white">My Achievements</Link>
                  <Link href="/account/kyc" className="block rounded px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800 hover:text-white">My KYC</Link>
                </div>
                )}  
              </div>
            )}
            {user ? (
              <>
                <Link href="/dashboard" className="rounded-full border border-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600">
                  Dashboard
                </Link>
                <button onClick={() => { logout(); router.push('/'); }} className="rounded-full border border-orange-600/60 px-5 py-2 text-sm font-medium text-orange-400 hover:border-orange-500 hover:text-orange-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-up" className="rounded-full border border-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600">
                  Sign up
                </Link>
                <Link href="/login" className="rounded-full border border-orange-600/60 px-5 py-2 text-sm font-medium text-orange-400 hover:border-orange-500 hover:text-orange-300">
                  Login
                </Link>
              </>
            )}
          </div>
        </nav>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-neutral-200 hover:bg-neutral-800 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden ${mobileOpen ? "block" : "hidden"} border-t border-neutral-800 bg-neutral-900`}
      >
        <div className="space-y-1 px-4 py-4">
          {navItems.map((item) => (
            <div key={item.label} className="">
              {item.children ? (
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded px-2 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-800">
                    {item.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 transition-transform group-open:rotate-180"
                    >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
                    </svg>
                  </summary>
                  <div className="mt-1 space-y-1 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded px-2 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  href={item.href || "#"}
                  className="block rounded px-2 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-800"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <div className="mt-3 flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="flex-1 rounded-full border border-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="flex-1 rounded-full border border-orange-600/60 px-5 py-2 text-sm font-medium text-orange-400 hover:border-orange-500 hover:text-orange-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-up" className="flex-1 rounded-full border border-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600" onClick={() => setMobileOpen(false)}>
                  Sign up
                </Link>
                <Link href="/login" className="flex-1 rounded-full border border-orange-600/60 px-5 py-2 text-sm font-medium text-orange-400 hover:border-orange-500 hover:text-orange-300" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


