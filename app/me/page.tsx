// app/me/page.tsx
"use client";
import { useEffect, useState } from "react";
// Agar Firebase auth integratsiyasi bor bo‘lsa:
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function MePage() {
  const [user, setUser] = useState<{ displayName?: string | null } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ? { displayName: u.displayName } : null);
      setReady(true);
    });
    return unsub;
  }, []);

  if (!ready) return <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">Yuklanmoqda...</div>;

  if (!user) {
    return (
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <h1 className="text-2xl font-bold">Profil</h1>
        <p className="mt-2 text-neutral-600">Profilingizni ko‘rish uchun tizimga kiring.</p>
        <Link href="/kuchli-100" className="mt-4 inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white">
          Google bilan kirish
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-2xl font-bold">Salom, {user.displayName || "foydalanuvchi"}!</h1>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border p-6 bg-white">
          <div className="font-semibold">Umumiy progress</div>
          <p className="text-sm text-neutral-600 mt-2">Tez orada: tugallangan kunlar, streak, foiz.</p>
        </div>
        <div className="rounded-2xl border p-6 bg-white">
          <div className="font-semibold">Public profil</div>
          <p className="text-sm text-neutral-600 mt-2">Do‘stlar bilan ulashish imkoniyati qo‘shiladi.</p>
        </div>
      </div>
    </section>
  );
}