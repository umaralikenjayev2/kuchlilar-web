"use client";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

function todayISO() { return new Date().toISOString().slice(0, 10); }

// start sanasini localStorage'da saqlaymiz (yo'q bo'lsa bugun)
function useStartDate() {
  const [start, setStart] = useState<string>(() => {
    if (typeof window === "undefined") return todayISO();
    return localStorage.getItem("kuchli100_start") || todayISO();
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("kuchli100_start");
      if (!s) localStorage.setItem("kuchli100_start", start);
    }
  }, [start]);
  return { start, setStart };
}

export default function CheckInClient() {
  const [user] = useAuthState(auth);
  const { start, setStart } = useStartDate();
  const [saving, setSaving] = useState(false);
  const [alreadyMarked, setAlreadyMarked] = useState(false);

  // 1..100 oralig'idagi bugungi kun indexi
  const dayIndex = useMemo(() => {
    const s = new Date(start + "T00:00:00");
    const diff = Math.floor((Date.now() - s.getTime()) / (1000 * 60 * 60 * 24));
    const idx0 = Math.max(0, Math.min(99, diff));
    return idx0 + 1;
  }, [start]);

  // kelajak start sanami?
  const isFuture = useMemo(() => {
    const s = new Date(start + "T00:00:00").getTime();
    const d = new Date().setHours(0, 0, 0, 0);
    return Math.floor((d - s) / (1000 * 60 * 60 * 24)) < 0;
  }, [start]);

  const outOfRange = dayIndex < 1 || dayIndex > 100;

  // bugungi check-in bor-yo‘qligini tekshirish
  useEffect(() => {
    const run = async () => {
      if (!user || isFuture || outOfRange) return setAlreadyMarked(false);
      const todayId = `${user.uid}_${dayIndex}`;
      const snap = await getDoc(doc(db, "checkins", todayId));
      setAlreadyMarked(snap.exists());
    };
    run();
  }, [user, dayIndex, isFuture, outOfRange]);

  const onCheckIn = async () => {
    if (!user) return alert("Iltimos, avval kiring.");
    if (isFuture) return alert("Kelajak kunini belgilab bo'lmaydi.");
    if (outOfRange) return alert("Kunning qiymati 1..100 bo'lishi kerak.");
    if (alreadyMarked) return alert("Bugun allaqachon belgilangan ✔️");

    setSaving(true);
    const id = `${user.uid}_${dayIndex}`;
    await setDoc(doc(db, "checkins", id), {
      uid: user.uid,
      dayIndex,
      startDate: start,
      createdAt: serverTimestamp(),
    }, { merge: true });
    setSaving(false);
    setAlreadyMarked(true);
  };

  return (
    <div className="space-y-5">
      <div className="text-sm text-neutral-400">
        Boshlash sanasi:
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="ml-2 bg-transparent border border-neutral-700 rounded px-2 py-1"
          max={todayISO()}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onCheckIn}
          disabled={saving || alreadyMarked || isFuture || outOfRange}
          className={`px-4 py-2 rounded-xl border border-neutral-700 ${
            saving || alreadyMarked || isFuture || outOfRange ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-800"
          }`}
        >
          {alreadyMarked ? "Bugun allaqachon belgilangan ✔️" : saving ? "Saqlanmoqda…" : `Bugungi check-in: Kun ${dayIndex}`}
        </button>
        {!user && <span className="text-sm text-rose-400">Kirish talab qilinadi</span>}
        {isFuture && <span className="text-sm text-amber-400">Start sanasi kelajakda — to‘g‘rilang.</span>}
        {outOfRange && <span className="text-sm text-amber-400">100 kun tugagan yoki hali boshlanmagan.</span>}
      </div>

      <p className="text-xs text-neutral-500">
        Eslatma: bugungi kun bir marta belgilanadi (dublikat tekshiruv bor).
      </p>
    </div>
  );
}