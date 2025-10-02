import type { Metadata } from "next";
import MeClient from "./MeClient";

export const metadata: Metadata = {
  title: "Mening profilim",
  description: "Kuchli 100 progress — belgilangan kunlar va streak.",
};

export default function MePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Mening progressim</h1>
      <MeClient />
    </div>
  );
}