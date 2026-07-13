import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  applicationName: "CalcTrick",
  title: "CalcTrick — Mental math, made easier",
  description: "Turn difficult calculations into simpler mental-math routes.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CalcTrick",
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
