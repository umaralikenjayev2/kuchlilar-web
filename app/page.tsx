export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-4xl font-bold">Kuchlilar platformasiga xush kelibsiz 🚀</h1>
      <p className="text-lg text-neutral-500">Bu bosh sahifa. Pastdagi yo‘l orqali “Kuchli 100” sahifasiga o‘ting.</p>
      <a href="/kuchli-100" className="px-4 py-2 rounded-lg border hover:bg-neutral-100">
        /kuchli-100 sahifasi
      </a>
    </main>
  );
}