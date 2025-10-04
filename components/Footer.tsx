// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid gap-8 md:grid-cols-2">
        <div>
          <div className="font-semibold text-neutral-900">Kuchlilar</div>
          <p className="mt-1 text-sm text-neutral-600">
            Shaxsiy rivojlanish platformasi. Kuchli odatlar → kuchli natijalar.
          </p>
          <div className="mt-3 flex gap-4 text-sm">
            <Link href="/privacy" className="underline">Maxfiylik</Link>
            <Link href="/terms" className="underline">Qoidalar</Link>
          </div>
        </div>
        <div>
          <div className="font-semibold text-neutral-900">Kontakt</div>
          <p className="mt-1 text-sm text-neutral-600">
            Instagram: @_kuchlilar • Telegram: t.me/...
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-8 text-xs text-neutral-500">
        © {new Date().getFullYear()} Kuchlilar
      </div>
    </footer>
  );
}