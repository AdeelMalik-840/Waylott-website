import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: "Waylott - Revenue Growth Consulting for $500K-$10M Businesses",
  description: "Uncover hidden revenue in your business with Waylott's proven Anchor Revenue Review Blueprint. Get tailored consulting packages that help you fix leaks, scale sustainably, and maximize profitability.",
  keywords: "business consulting, revenue growth, hidden revenue, business assessment, revenue optimization, business coaching, $500K business, $10M business, revenue blueprint, anchor revenue review",
  authors: [{ name: "Waylott" }],
  creator: "Waylott",
  publisher: "Waylott",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://waylott.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Waylott - Revenue Growth Consulting for $500K-$10M Businesses",
    description: "Uncover hidden revenue in your business with Waylott's proven Anchor Revenue Review Blueprint.",
    url: '/',
    siteName: 'Waylott',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Waylott - Revenue Growth Consulting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Waylott - Revenue Growth Consulting",
    description: "Uncover hidden revenue in your business with Waylott's proven Anchor Revenue Review Blueprint.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
