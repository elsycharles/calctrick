import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  applicationName: SITE_NAME,
  title: {
    default: "CalcTrick — Mental math, made easier",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  category: "education",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: "CalcTrick — Mental math, made easier",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "CalcTrick — Mental math, made easier",
    description: SITE_DESCRIPTION,
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: "/calctrick-favicon-v3.ico",
        sizes: "64x64",
        type: "image/x-icon",
      },
      {
        url: "/icons/calctrick-mark-v3-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/calctrick-mark-v3-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: ["/calctrick-favicon-v3.ico"],
    apple: [
      {
        url: "/icons/calctrick-apple-v3-180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#5753D9",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
