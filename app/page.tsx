// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
        Kuchli odatlar → kuchli natijalar
      </h1>
      <p className="mt-4 text-neutral-600 text-lg md:text-xl max-w-2xl">
        Intizom, sog‘lom turmush tarzi, kitob va fokusli ish. 100 kunlik marafon bilan boshlang.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/kuchli-100" className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-semibold hover:opacity-95">
          Kuchli 100 marafoni
        </Link>
        <Link href="/about" className="px-5 py-3 rounded-2xl border bg-white font-semibold hover:bg-neutral-100">
          Biz haqimizda
        </Link>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {[
          { t: "Kundalik 1% o‘sish", d: "Mayda qadamlardan katta natijaga." },
          { t: "Hamjamiyat", d: "Bir-birimizni qo‘llab-quvvatlaymiz." },
          { t: "O‘lchanadigan progress", d: "Check-in va streaklar bilan." },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border p-6 bg-white">
            <div className="font-semibold">{c.t}</div>
            <p className="text-sm text-neutral-600 mt-2">{c.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}