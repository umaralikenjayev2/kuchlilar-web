import type { Metadata } from "next";
import Kuchli100Client from "./Kuchli100Client";

export const metadata: Metadata = {
  title: "Kuchli 100 Kun Marafoni – Kuchlilar",
  description:
    "Intizom, sog‘lom turmush, kitob va loyiha uchun 100 kunlik challenge.",
  openGraph: {
    title: "Kuchli 100 Kun | Kuchlilar",
    description:
      "Har kuni +1% o‘sish. Intizom, sog‘lom turmush, kitob va loyiha uchun 100 kunlik marafon.",
    url: "https://kuchlilar.com/kuchli-100",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function Page() {
  return <Kuchli100Client />;
}
