// app/contact/page.tsx
export const metadata = { title: "Kontakt" };

export default function ContactPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-2xl md:text-3xl font-bold">Kontakt</h1>
      <p className="mt-3 text-neutral-600">Email: hello@kuchlilar.com (tez orada)</p>
      <p className="text-neutral-600">Instagram: @_kuchlilar • Telegram: t.me/...</p>
    </section>
  );
}