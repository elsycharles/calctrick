import type { Metadata } from "next";
import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";

export const metadata: Metadata = {
  title: "Offline",
  description: "CalcTrick is currently offline.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-zinc-300 bg-white p-6 text-center sm:p-8">
        <div className="mx-auto flex w-fit items-center gap-2.5">
          <BrandMark size={38} />
          <span className="text-lg font-bold tracking-[-0.025em] text-ink">CalcTrick</span>
        </div>

        <p className="mt-8 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">
          No connection
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-ink">
          This page is not cached yet.
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          The calculator and previously cached guides still work offline. Reconnect once to
          update the rest of CalcTrick.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-accent px-5 text-sm font-bold text-white"
        >
          Open the calculator
        </Link>
      </section>
    </main>
  );
}
