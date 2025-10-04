// components/Navbar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/kuchli-100", label: "Kuchli 100" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Biz haqimizda" },
  { href: "/contact", label: "Kontakt" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
      <nav className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-lg tracking-tight">
          Kuchlilar
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm px-3 py-2 rounded-xl hover:bg-neutral-100 ${
                  active ? "bg-neutral-100 font-semibold" : "text-neutral-700"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/me"
            className="text-sm px-3 py-2 rounded-xl bg-emerald-600 text-white hover:opacity-90"
          >
            Mening profilim
          </Link>
        </div>
      </nav>
    </header>
  );
}