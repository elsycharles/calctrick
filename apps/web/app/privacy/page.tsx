import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How CalcTrick processes calculations locally and stores recent calculation history on your device.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy | CalcTrick",
    description: "How CalcTrick processes calculations and history on your device.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto w-full max-w-3xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] sm:px-6 sm:pt-[calc(6.5rem+env(safe-area-inset-top))]">
        <header className="py-6 sm:py-10">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">
            Plain-language privacy
          </p>
          <h1 className="mt-2.5 text-4xl font-bold tracking-[-0.05em] text-ink sm:text-5xl">
            Your calculations stay yours.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            CalcTrick is designed to work without an account or an application backend.
            This page explains what happens to your data when you use it.
          </p>
          <p className="mt-3 text-xs font-semibold text-zinc-500">Last updated: July 13, 2026</p>
        </header>

        <div className="space-y-7 border-t border-zinc-300 py-7 text-sm leading-7 text-zinc-700">
          <section>
            <h2 className="text-xl font-bold tracking-[-0.025em] text-ink">Calculations</h2>
            <p className="mt-2">
              The numbers and operators you enter are processed in your browser. CalcTrick
              does not send calculation values to an application server for solving.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-[-0.025em] text-ink">Recent history</h2>
            <p className="mt-2">
              Your five most recent calculations are stored in IndexedDB, a database inside
              your browser. They remain on that browser profile until you clear the site data.
              CalcTrick has no account system and does not synchronize this history.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-[-0.025em] text-ink">Hosting data</h2>
            <p className="mt-2">
              Like any hosted website, CalcTrick must serve files to your browser. The hosting
              provider may process technical request information such as an IP address, browser
              type, requested URL and request time for security and service operation. CalcTrick
              currently has no advertising trackers or third-party analytics in the application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-[-0.025em] text-ink">Delete local data</h2>
            <p className="mt-2">
              Use your browser settings to clear the stored data for the CalcTrick domain. You
              can also uninstall the installed app; depending on your browser, you may need to
              clear site data separately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-[-0.025em] text-ink">Changes</h2>
            <p className="mt-2">
              If analytics, accounts or cloud synchronization are added later, this notice will
              be updated before those features are used in production.
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-bold text-white"
        >
          Back to the calculator
        </Link>

        <SiteFooter />
      </article>
    </main>
  );
}
