// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://kuchlilar.com'
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/kuchli-100`, lastModified: new Date() },
    // kelajakda boshqa sahifalar ham shu yerga qo‘shiladi
  ]
}