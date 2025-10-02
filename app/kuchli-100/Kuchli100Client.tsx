"use client";

import React, { useEffect, useMemo, useState } from "react";

// ========= Config/Consts =========
const USE_DEMO = true; // keyinchalik Firebase ulaganda false qilamiz
const CHALLENGE_DAYS = 100 as const;
const CHECKLIST = [
  { key: "sport", label: "Sport / 30+ daqiqa harakat" },
  { key: "book", label: "Kitob / 10+ bet yoki 20+ daqiqa" },
  { key: "health", label: "Sog'lom odat / suv, ovqat, uyqu" },
  { key: "project", label: "Loyiha / fokusli ish" },
] as const;

// Demo API (keyinchalik real endpointlarga almashtiramiz)
const api = {
  join: async (payload: { username: string; email?: string; start: string }) =>
    ({ ok: true, userId: "demo_" + payload.username }),
  // @ts-ignore – demo imzo
  saveDay: async () => ({ ok: true }),
  leaderboard: async () => ({
    ok: true,
    items: [
      { rank: 1, username: "aziz", streak: 12, pct: 18 },
      { rank: 2, username: "malika", streak: 9, pct: 15 },
      { rank: 3, username: "umarali", streak: 8, pct: 14 },
    ],
  }),
};

// ========= Helpers =========
const todayISO = () => new Date().toISOString().slice(0, 10);
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function saveLocal(key: string, value: any) {
  try {
    if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ?ref=USERNAME ni eslab qo‘yish
(function trackReferral() {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams(window.location.search);
  const ref = p.get("ref");
  if (ref) saveLocal("kuchli100_ref", ref);
})();

// ========= Utilities =========
function calcStreak(
  days: Record<string | number, Record<string, boolean>>,
  currentDayIndex: number
): number {
  let s = 0;
  for (let i = currentDayIndex; i >= 0; i--) {
    const d = (days as any)[i];
    const done = CHECKLIST.every((c) => d?.[c.key]);
    if (done) s++;
    else break;
  }
  return s;
}

// ========= Page (client) =========
export default function Kuchli100Client(): JSX.Element {
  // localStorage holatlari
  const [profile, setProfile] = useState<{ userId: string; username: string; email?: string } | null>(
    () => loadLocal("kuchli100_profile", null)
  );
  const [days, setDays] = useState<Record<string | number, Record<string, boolean>>>(() =>
    loadLocal("kuchli100_days", {})
  );
  const [startDate, setStartDate] = useState<string>(() => loadLocal("kuchli100_start", todayISO()));
  const [loading, setLoading] = useState(false);

  // Hosila qiymatlar
  const currentDayIndex = useMemo(() => {
    const start = new Date(startDate + "T00:00:00");
    const diff = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
    return clamp(diff, 0, CHALLENGE_DAYS - 1);
  }, [startDate]);

  const progress = useMemo(() => {
    const completed = Object.keys(days).filter((k) =>
      CHECKLIST.every((c) => (days as any)[k]?.[c.key])
    ).length;
    return Math.round((completed / CHALLENGE_DAYS) * 100);
  }, [days]);

  const streak = useMemo(() => calcStreak(days, currentDayIndex), [days, currentDayIndex]);

  function toggleCheck(dayIndex: number, key: string) {
    setDays((prev) => {
      const next = {
        ...prev,
        [dayIndex]: { ...(prev as any)[dayIndex], [key]: !(prev as any)?.[dayIndex]?.[key] },
      };
      saveLocal("kuchli100_days", next);
      try {
        if (!USE_DEMO && profile?.userId) {
          // @ts-ignore demo
          api.saveDay(profile.userId, dayIndex, (next as any)[dayIndex]);
        }
      } catch {}
      return next;
    });
  }

  async function handleJoin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const username = (fd.get("username") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const start = (fd.get("start") || todayISO()).toString();
    if (!username) return alert("Ism/username kiriting");
    setLoading(true);
    const res = await api.join({ username, email, start });
    setLoading(false);
    if (res?.ok) {
      const newProfile = { userId: res.userId, username, email };
      setProfile(newProfile);
      setStartDate(start);
      saveLocal("kuchli100_profile", newProfile);
      saveLocal("kuchli100_start", start);
    } else {
      alert("Xatolik. Keyinroq urinib ko'ring");
    }
  }

  function resetAll() {
    if (!confirm("Barcha lokal ma'lumotlar o'chirilsinmi?")) return;
    if (typeof window !== "undefined") {
      localStorage.removeItem("kuchli100_profile");
      localStorage.removeItem("kuchli100_days");
      localStorage.removeItem("kuchli100_start");
    }
    setProfile(null);
    setDays({});
    setStartDate(todayISO());
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900">
      {/* Hero */}
      <section className="px-5 md:px-10 py-10 md:py-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              KUCHLI <span className="text-emerald-600">100 KUN</span> MARAFONI
            </h1>
            <p className="mt-4 text-lg md:text-xl text-neutral-600">
              Intizom, sog'liq, bilim va loyiha. Har kuni +1% o'sish. 100 kun oxirida — kuchliroq sen va ishga tayyor <b>Kuchlilar</b> ilovasi.
            </p>
            <ul className="mt-6 space-y-2 text-sm md:text-base">
              <li>🏃 Sport • 📚 Kitob • 🥗 Sog'lom turmush • 🎯 Odatlar • 💻 Loyiha</li>
              <li>👥 Hamjamiyat: #Kuchli100Kunlik — Telegram & Instagram</li>
              <li>🏆 Reyting va streaklar • Public profil havolasi</li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#join" className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-semibold hover:opacity-95 shadow">
                Marafonga qo'shilish
              </a>
              <a href="#how" className="px-5 py-3 rounded-2xl border border-neutral-200 bg-white font-semibold hover:bg-neutral-100">
                Qanday ishlaydi?
              </a>
            </div>
            <div className="mt-3"><ShareButtons /></div>
          </div>

          <div className="bg-white rounded-3xl shadow p-5 md:p-7 border border-neutral-100">
            <ProgressCard
              startDate={startDate}
              currentDayIndex={currentDayIndex}
              progress={progress}
              streak={streak}
              profile={profile}
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-5 md:px-10 py-12 md:py-16 bg-white border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold">Qanday ishlaydi?</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {[
              { t: "1. Boshlang", d: "Profil yarating, start sanasini kiriting va 100 kunlik yo'lni boshlang." },
              { t: "2. Kunlik belgilash", d: "Har kuni 4 yo'nalishda belgilang: sport, kitob, sog'liq, loyiha." },
              { t: "3. Ulashing", d: "Public profil havolasini ulashing, do'stlaringiz bilan bellashing." },
            ].map((i, idx) => (
              <div key={idx} className="rounded-2xl border border-neutral-200 p-5 bg-neutral-50">
                <div className="text-emerald-600 font-semibold mb-2">{i.t}</div>
                <div className="text-neutral-700">{i.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join form */}
      <section id="join" className="px-5 md:px-10 py-12 md:py-16">
        <div className="max-w-3xl mx-auto bg-white border border-neutral-200 rounded-3xl shadow p-6">
          <h3 className="text-xl md:text-2xl font-bold">Marafonga qo'shiling</h3>
          {!profile ? (
            <form onSubmit={handleJoin} className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium">Ism / Username</label>
                <input name="username" className="mt-1 w-full rounded-xl border p-3" placeholder="umarali" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium">Email (ixtiyoriy)</label>
                <input name="email" className="mt-1 w-full rounded-xl border p-3" placeholder="siz@pochta.com" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium">Start sana</label>
                <input name="start" type="date" defaultValue={startDate} className="mt-1 w-full rounded-xl border p-3" />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button disabled={loading} className="w-full md:w-auto px-5 py-3 rounded-2xl bg-emerald-600 text-white font-semibold hover:opacity-95">
                  {loading ? "Yuklanmoqda..." : "Boshlash"}
                </button>
              </div>
              <p className="md:col-span-2 text-xs text-neutral-500">Boshlash orqali shartlarga rozilik bildirasiz. Maxfiylik siyosati va qoidalar bilan tanishing.</p>
            </form>
          ) : (
            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm">@{profile.username}</div>
                <button onClick={resetAll} className="text-sm underline">Profilni tozalash (demo)</button>
              </div>
              <p className="mt-2 text-neutral-600 text-sm">Boshlash sanasi: <b>{startDate}</b>. Quyida har kungi belgilash paneli.</p>
            </div>
          )}
        </div>
      </section>

      {/* Daily tracker */}
      <section className="px-5 md:px-10 pb-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold mb-4">Kunlik belgilash</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: CHALLENGE_DAYS }).map((_, i) => (
              <DayCard
                key={i}
                index={i}
                startDate={startDate}
                value={(days as any)[i]}
                onToggle={(k) => toggleCheck(i, k)}
                disabled={i > currentDayIndex}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Community (demo) */}
      <section className="px-5 md:px-10 py-12 bg-white border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold">Hamjamiyat</h3>
          <div className="mt-4 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border p-5">
              <div className="font-semibold">Telegram</div>
              <p className="text-sm text-neutral-600 mt-1">Kundalik motivatsiya, mini-challenge va Q&A.</p>
              <a href="https://t.me/+" className="inline-block mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white">Kanalga qo'shilish</a>
            </div>
            <div className="rounded-2xl border p-5">
              <div className="font-semibold">Instagram</div>
              <p className="text-sm text-neutral-600 mt-1">#Kuchli100Kunlik – o'z natijalaringizni ulashing.</p>
              <a href="https://instagram.com/_kuchlilar" className="inline-block mt-3 px-4 py-2 rounded-xl bg-neutral-900 text-white">Profilga o'tish</a>
            </div>
          </div>
        </div>
      </section>

      <LeaderboardSection />
      <RulesFAQ />
      <Footer />
    </div>
  );
}

// ========= Subcomponents =========
function ShareButtons({ title = "Kuchli 100 Kun – Marafon", url }: { title?: string; url?: string }) {
  const theUrl =
    url || (typeof window !== "undefined" && window.location.href) || "https://kuchlilar.com/kuchli-100";
  const share = async () => {
    try {
      // @ts-ignore
      if (navigator.share) await navigator.share({ title, url: theUrl });
      else copy();
    } catch {}
  };
  const copy = () => {
    try {
      // @ts-ignore
      navigator.clipboard.writeText(theUrl);
      alert("Havola nusxalandi");
    } catch {}
  };
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={share} className="px-4 py-2 rounded-xl border">Ulashish</button>
      <button onClick={copy} className="px-4 py-2 rounded-xl border">Havolani nusxalash</button>
    </div>
  );
}

function PublicLinkButton({ username }: { username?: string }) {
  const makeUrl = () => {
    const base = (typeof window !== "undefined" && window.location.origin) || "https://kuchlilar.com";
    const u = username ? username : "mehmon";
    return base + "/kuchli-100/u/" + encodeURIComponent(u);
  };
  const copy = () => {
    try {
      // @ts-ignore
      navigator.clipboard.writeText(makeUrl());
      alert("Public havola nusxalandi");
    } catch {}
  };
  return <button onClick={copy} className="px-4 py-2 rounded-xl border">Public link</button>;
}

function ProgressCard({
  startDate,
  currentDayIndex,
  progress,
  streak,
  profile,
}: {
  startDate: string;
  currentDayIndex: number;
  progress: number;
  streak: number;
  profile: { username?: string } | null;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-500">Boshlash sanasi</div>
          <div className="text-lg font-semibold">{startDate}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-neutral-500">Bugungi kun indeksi</div>
          <div className="text-lg font-semibold">{currentDayIndex + 1} / {CHALLENGE_DAYS}</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-sm text-neutral-500">Umumiy progress</div>
        <div className="w-full h-3 bg-neutral-100 rounded-full mt-2 overflow-hidden">
          <div className="h-3 bg-emerald-600" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 text-sm font-semibold">{progress}%</div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border p-3 bg-neutral-50">
          <div className="text-neutral-500">Streak</div>
          <div className="text-xl font-bold">{streak} 🔥</div>
        </div>
        <div className="rounded-2xl border p-3 bg-neutral-50">
          <div className="text-neutral-500">Profil</div>
          <div className="font-semibold">{profile?.username ? "@" + profile.username : "mehmon"}</div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <PublicLinkButton username={profile?.username} />
        <ShareButtons />
      </div>
    </div>
  );
}

function DayCard({
  index,
  startDate,
  value,
  onToggle,
  disabled,
}: {
  index: number;
  startDate: string;
  value: Record<string, boolean> | undefined;
  onToggle: (key: string) => void;
  disabled: boolean;
}) {
  const date = useMemo(() => {
    const d = new Date(startDate + "T00:00:00");
    d.setDate(d.getDate() + index);
    return d.toISOString().slice(0, 10);
  }, [startDate, index]);

  const complete = CHECKLIST.every((c) => value?.[c.key]);

  return (
    <div className={`rounded-2xl border p-4 bg-white ${disabled ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="font-semibold">Kun {index + 1}</div>
        <div
          className={`text-xs px-2 py-1 rounded-full ${complete ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-600"}`}
        >
          {complete ? "Bajarildi" : "Jarayonda"}
        </div>
      </div>
      <div className="text-xs text-neutral-500 mt-1">{date}</div>

      <div className="mt-3 space-y-2">
        {CHECKLIST.map((c) => (
          <label key={c.key} className={`flex items-center gap-3 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
            <input type="checkbox" checked={!!value?.[c.key]} onChange={() => !disabled && onToggle(c.key)} />
            <span>{c.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function LeaderboardSection() {
  const [items, setItems] = useState<{ rank: number; username: string; streak: number; pct: number }[]>([]);
  useEffect(() => {
    let m = true;
    api.leaderboard().then((res) => { if (m && res?.ok) setItems(res.items || []); });
    return () => { m = false; };
  }, []);
  return (
    <section className="px-5 md:px-10 py-12 bg-white border-t border-neutral-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-xl md:text-2xl font-bold">Reyting</h3>
          <a className="text-sm underline" href="#">Barchasi</a>
        </div>
        <div className="mt-4 rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">Foydalanuvchi</th>
                <th className="text-left p-3">Streak 🔥</th>
                <th className="text-left p-3">Progress %</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? items.map((it) => (
                <tr key={it.rank} className="border-t">
                  <td className="p-3 font-semibold">{it.rank}</td>
                  <td className="p-3">@{it.username}</td>
                  <td className="p-3">{it.streak}</td>
                  <td className="p-3">{it.pct}%</td>
                </tr>
              )) : (
                <tr className="border-t"><td className="p-3" colSpan={4}>Demo rejim. Backend ulanganida to‘ladi.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function RulesFAQ() {
  return (
    <section className="px-5 md:px-10 py-12 border-t bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl md:text-2xl font-bold">Qoidalar (short)</h3>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-neutral-700">
            <li>Kunlik 4 yo'nalishdan kamida 3 tasini bajarishga harakat qiling.</li>
            <li>Kelajak kunlarini belgilash taqiqlanadi (server tomonda tekshiriladi).</li>
            <li>Public profil havolasini faqat o'zingiz xohlasangiz ulashing.</li>
            <li>Hamjamiyatga hurmat bilan munosabatda bo'ling.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold">FAQ</h3>
          <div className="mt-4 space-y-3 text-sm text-neutral-700">
            <div>
              <div className="font-semibold">Nima uchun 100 kun?</div>
              <p>Odat shakllanishi va mustahkamlanishi uchun yetarli muddat; 100 kun – yangi hayot tarzi.</p>
            </div>
            <div>
              <div className="font-semibold">Kechikkan kunni qaytarib belgilash mumkinmi?</div>
              <p>Server siyosatiga qarab: odatda 24 soat ichida ruxsat beriladi.</p>
            </div>
            <div>
              <div className="font-semibold">Marafon bepulmi?</div>
              <p>Asosiy versiya – ha. Qo'shimcha premium funksiyalar (analitika, pdf eksport) keyinroq.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-5 md:px-10 py-10 text-sm text-neutral-600">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        <div>
          <div className="font-semibold text-neutral-900">Kuchlilar</div>
          <p className="mt-1">Shaxsiy rivojlanish platformasi. Kuchli odatlar → kuchli natijalar.</p>
          <div className="mt-3 flex gap-3">
            <a className="underline" href="#">Maxfiylik</a>
            <a className="underline" href="#">Qoidalar</a>
          </div>
        </div>
        <div>
          <div className="font-semibold text-neutral-900">Kontakt</div>
          <p className="mt-1">Instagram: @_kuchlilar • Telegram: t.me/...</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-6 border-t pt-4">© {new Date().getFullYear()} Kuchlilar</div>
    </footer>
  );
}