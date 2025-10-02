import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🔑 Global metadata (SEO uchun)
export const metadata: Metadata = {
  title: {
    default: "Kuchlilar – Shaxsiy rivojlanish va intizom 🚀",
    template: "%s | Kuchlilar",
  },
  description:
    "Kuchlilar platformasi – intizom, motivatsiya va shaxsiy rivojlanish sari 1% qadam. Kundalik odatlar, 'Kuchli 100 Kun' challenge va foydali resurslar siz uchun! 💪",
  keywords: [
    "kuchlilar",
    "kuchli 100 kun",
    "intizom",
    "motivatsiya",
    "shaxsiy rivojlanish",
    "atomic habits",
    "deep work",
    "self improvement",
  ],
  authors: [{ name: "Kuchlilar Team" }],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://kuchlilar.com",
    siteName: "Kuchlilar",
    title: "Kuchlilar – Shaxsiy rivojlanish va intizom 🚀",
    description:
      "Intizom va shaxsiy rivojlanish uchun Kuchlilar platformasi. 'Kuchli 100 Kun' challenge orqali hayotingizni o‘zgartiring.",
    images: [
      {
        url: "https://kuchlilar.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kuchlilar Platformasi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuchlilar – Shaxsiy rivojlanish va intizom 🚀",
    description:
      "Intizom va rivojlanish sari 1% qadam. 'Kuchli 100 Kun' challenge bilan hayotingizni o‘zgartiring!",
    images: ["https://kuchlilar.com/og-image.png"],
  },
  metadataBase: new URL("https://kuchlilar.com"),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}