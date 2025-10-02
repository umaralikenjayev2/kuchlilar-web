"use client";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function AuthButtons() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="text-sm text-neutral-400">Yuklanmoqda…</div>;

  if (!user) {
    return (
      <button
        onClick={() => signInWithPopup(auth, googleProvider)}
        className="px-3 py-1.5 rounded-xl border border-neutral-700 hover:bg-neutral-800"
      >
        Google bilan kirish
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-neutral-400">@{user.email?.split("@")[0]}</span>
      <button onClick={() => signOut(auth)} className="px-3 py-1.5 rounded-xl border border-neutral-700 hover:bg-neutral-800">
        Chiqish
      </button>
    </div>
  );
}