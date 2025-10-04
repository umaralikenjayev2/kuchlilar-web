// app/about/page.tsx
export const metadata = { title: "Biz haqimizda" };

export default function AboutPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-2xl md:text-3xl font-bold">Biz haqimizda</h1>
      <p className="mt-3 text-neutral-600 max-w-2xl">
        Kuchlilar — shaxsiy rivojlanish platformasi. Maqsad: foydalanuvchilarga sog‘lom odatlar
        va intizomni shakllantirishda yordam berish.
      </p>
    </section>
  );
}