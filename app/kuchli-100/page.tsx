// app/kuchli-100/page.tsx
import dynamic from "next/dynamic";
export const metadata = {
  title: "Kuchli 100 Kun Marafoni",
  description: "Intizom, sog‘lom turmush, kitob va loyiha uchun 100 kunlik challenge.",
};
const Kuchli100Client = dynamic(() => import("./Kuchli100Client"), { ssr: false });

export default function Page() {
  return <Kuchli100Client />;
}