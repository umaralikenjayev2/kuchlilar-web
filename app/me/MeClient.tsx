"use client";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function MeClient() {
  const [user] = useAuthState(auth);
  const [done, setDone] = useState<Set<number>>(new Set());

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      const q = query(collection(db, "checkins"), where("uid", "==", user.uid));
      const snap = await getDocs(q);
      const s = new Set<number>();
      snap.forEach((d) => {
        const di = Number(d.data().dayIndex);
        if (di >= 1 && di <= 100) s.add(di);
      });
      setDone(s);
    };
    run();
  }, [user]);

  if (!user) return <div>Kirish talab qilinadi.</div>;

  const completed = done.size;
  const percent = Math.round((completed / 100) * 100);

  return (
    <div className="space-y-4">
      <div className="text-sm text-neutral-300">
        Belgilangan kunlar: <b>{completed}</b>/100 ({percent}%)
      </div>
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            title={`Kun ${n}`}
            className={`h-7 w-7 flex items-center justify-center text-[10px] rounded
              ${done.has(n) ? "bg-emerald-600 text-white" : "bg-neutral-800 text-neutral-500"}`}
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}