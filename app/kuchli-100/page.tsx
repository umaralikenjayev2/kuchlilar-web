"use client";

import { useEffect, useMemo, useState } from "react";

const CHALLENGE_DAYS = 100;
const CHECKS = [
  { key: "sport", label: "🏃 Sport / 30+ daqiqa" },
  { key: "book", label: "📚 Kitob / 10+ bet" },
  { key: "health", label: "🥗 Sog'lom odat (suv/uyqu/ovqat)" },
  { key: "project", label: "💻 Loyiha / fokusli ish" },
] as const;

type DayLog = Partial<Record<(typeof CHECKS)[number]["key"], boolean>>;
type DaysState = Record<number, DayLog>;

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function Kuchli100Page() {
  const [startDate, setStartDate] = useState<string>(() => {
    if (typeof window === "undefined") return todayISO();
    return localStorage.getItem("k100_start") || todayISO();
  });

  const [days, setDays] = useState<DaysState>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem("k100_days") || "{}");
    } catch {
      return {};
    }
  });

  // bugungi kun indeksi (0..99)
  const dayIndex = useMemo(() => {
    const s = new Date(startDate + "T00:00:00");
    const diff = Math.floor((Date.now() - s.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(CHALLENGE_DAYS - 1, diff));
  }, [startDate]);

  // foiz progress
  const progress = useMemo(() => {
    const done = Object.keys(days).filter((k) =>
      CHECKS.every((c) => days[+k]?.[c.key])
    ).length;
    return Math.round((done / CHALLENGE_DAYS) * 100);
  }, [days]);

  // streak (ketma-ket to‘liq kunlar)
  const streak = useMemo(() => {
    let s = 0;
    for (let i = dayIndex; i >= 0; i--) {
      const full = CHECKS.every((c) => days[i]?.[c.key]);
      if (full) s++;
      else break;
    }
    return s;
  }, [days, dayIndex]);

  // persist
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("k100_start", startDate);
    }
  }, [startDate]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("k100_days", JSON.stringify(days));
    }
  }, [days]);

  // toggle checker
  const toggle = (key: (typeof CHECKS)[number]["key"]) => {
    setDays((prev) => ({
      ...prev,
      [dayIndex]: { ...prev[dayIndex], [key]: !prev[dayIndex]?.[key] },
    }));
  };

  // bugungi sana ko‘rinishi
  const currentDate = useMemo(() => {
    const d = new Date(startDate + "T00:00:00");
    d.setDate(d.getDate() + dayIndex);
    return d.toISOString().slice(0, 10);
  }, [startDate, dayIndex]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="max-w-3xl mx-auto px-5 py-10">
        <h1 className="text-4xl font-bold text-emerald-400">Kuchli 100 Kun</h1>
        <p className="mt-2 text-neutral-300">
          Har kuni 4 odat. 100 kun oxirida kuchliroq sen 💪
        </p>

        {/* Start sana */}
        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <label className="text-sm text-neutral-400">Start sana</label>
          <div className="mt-2 flex gap-3 items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2"
            />
            <span className="text-sm text-neutral-400">
              Bugungi kun: <b>{dayIndex + 1}</b> / {CHALLENGE_DAYS} ({currentDate})
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="flex items-center justify-between">
            <div className="text-neutral-300">Umumiy progress</div>
            <div className="font-semibold">{progress}%</div>
          </div>
          <div className="h-3 w-full bg-neutral-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-3 bg-emerald-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 text-sm text-neutral-400">
            Streak: <b>{streak}</b> 🔥
          </div>
        </div>

        {/* Bugungi checklist */}
        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="font-semibold mb-3">
            Kun {dayIndex + 1} — {currentDate}
          </div>
          <div className="space-y-2">
            {CHECKS.map((c) => (
              <label
                key={c.key}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={!!days[dayIndex]?.[c.key]}
                  onChange={() => toggle(c.key)}
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tez amallar */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              if (!confirm("Barchasini tozalaymi?")) return;
              localStorage.removeItem("k100_days");
              localStorage.removeItem("k100_start");
              setDays({});
              setStartDate(todayISO());
            }}
            className="px-4 py-2 rounded-xl border border-neutral-700 hover:bg-neutral-800"
          >
            Tozalash (demo)
          </button>
          <button
            onClick={() => {
              navigator.clipboard
                .writeText(`#Kuchli100Kunlik — Kun ${dayIndex + 1} ✅`)
                .then(() => alert("Matn nusxalandi!"));
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:opacity-95 text-neutral-900 font-semibold"
          >
            Ulashish matnini nusxalash
          </button>
        </div>
      </div>
    </div>
  );
}