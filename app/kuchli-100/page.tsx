// app/kuchli-100/page.tsx
import type { Metadata } from "next";
import Kuchli100Client from "./Kuchli100Client";

export const metadata: Metadata = {
  title: "Kuchli 100 Kun Marafoni – Kuchlilar",
  description:
    "Kuchli 100 Kun: intizom, sog'liq, kitob, odatlar va loyiha. Har kuni +1% o'sish. Marafonga qo'shiling!",
  openGraph: {
    title: "Kuchli 100 Kun Marafoni – Kuchlilar",
    description:
      "Kuchli 100 Kun: intizom, sog'liq, kitob, odatlar va loyiha. Har kuni +1% o'sish.",
    url: "https://kuchlilar.com/kuchli-100",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function Page() {
  return <Kuchli100Client />;
}