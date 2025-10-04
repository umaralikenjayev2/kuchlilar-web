// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";

const MOCK = {
  "odatiy-qadamlar": {
    title: "Odatiy qadamlar: 1% qoidasi",
    body: "Har kuni 1% yaxshilanish katta natijalarga olib keladi…",
  },
  "100-kun-metodika": {
    title: "100 kun metodikasi",
    body: "100 kun — odat shakllanishi va mustahkamlanishi uchun yetarli muddat…",
  },
};

export async function generateStaticParams() {
  return Object.keys(MOCK).map((slug) => ({ slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = MOCK[params.slug as keyof typeof MOCK];
  if (!post) return notFound();
  return (
    <article className="max-w-3xl mx-auto px-4 md:px-6 py-12 prose">
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}