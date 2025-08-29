"use client";
import { usePathname } from "next/navigation";
import PageBanner from "./PageBanner";

function toTitle(seg: string) {
  if (!seg) return "";
  return seg
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function PageBannerAuto() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  const parts = pathname.split("/").filter(Boolean); // e.g. ['admin','users']
  const crumbs = ["Home", ...parts.map(toTitle)].join(" / ");

  return <PageBanner title={crumbs} />;
}


