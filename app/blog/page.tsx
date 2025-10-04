// app/blog/page.tsx
export const metadata = { title: "Blog" };

export default function BlogIndexPage() {
  // Hozircha static; keyin CMS yoki MDX qo‘shamiz
  const posts = [
    { slug: "odatiy-qadamlar", title: "Odatiy qadamlar: 1% qoidasi", excerpt: "Har kuni kichik qadam…" },
    { slug: "100-kun-metodika", title: "100 kun metodikasi", excerpt: "Nega 100 kun — samarali?" },
  ];
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-2xl md:text-3xl font-bold">Blog</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {posts.map((p) => (
          <a
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="rounded-2xl border p-6 bg-white hover:bg-neutral-50"
          >
            <div className="font-semibold">{p.title}</div>
            <p className="text-sm text-neutral-600 mt-2">{p.excerpt}</p>
          </a>
        ))}
      </div>
    </section>
  );
}