import { spawnSync } from "node:child_process";

import withSerwistInit from "@serwist/next";

const gitRevision = spawnSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).stdout.trim();

const precacheRevision =
  process.env.VERCEL_GIT_COMMIT_SHA || gitRevision || crypto.randomUUID();

const offlinePages = [
  "/",
  "/offline",
  "/privacy",
  "/tricks",
  "/tricks/divide-by-5",
  "/tricks/multiply-by-11",
  "/tricks/multiply-by-25",
  "/tricks/multiply-by-99",
];

const withSerwist = withSerwistInit({
  additionalPrecacheEntries: offlinePages.map((url) => ({
    url,
    revision: precacheRevision,
  })),
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ["trick-engine"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=()",
          },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);
