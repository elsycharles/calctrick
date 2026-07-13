import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MENTAL_MATH_GUIDES } from "@/lib/trick-content";

export const metadata: Metadata = {
  title: "Mental math tricks",
  description:
    "Practical mental-math techniques for multiplication and division, explained with formulas, steps and worked examples.",
  alternates: { canonical: "/tricks" },
  openGraph: {
    title: "Mental math tricks | CalcTrick",
    description:
      "Practical mental-math techniques explained with formulas, steps and worked examples.",
    url: "/tricks",
  },
};

export default function TricksPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto w-full max-w-4xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] sm:px-6 sm:pt-[calc(6.5rem+env(safe-area-inset-top))]">
        <header className="max-w-2xl py-6 sm:py-10">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">
            Learn the patterns
          </p>
          <h1 className="mt-2.5 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.05em] text-ink sm:text-5xl">
            Mental math tricks you can actually reuse.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
            Each guide explains why the shortcut works, when to use it and how to
            check the result. Try the same pattern with your own numbers in CalcTrick.
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-2" aria-label="Mental math guides">
          {MENTAL_MATH_GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/tricks/${guide.slug}`}
              className="group flex min-h-52 flex-col justify-between rounded-2xl border border-zinc-300 bg-white p-5 transition-colors hover:border-accent sm:p-6"
            >
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-accent">
                  {guide.label}
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-[-0.03em] text-ink">
                  {guide.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{guide.description}</p>
              </div>
              <p className="mt-5 font-mono text-sm font-bold text-ink">{guide.formula}</p>
            </Link>
          ))}
        </section>

        <div className="mt-8 rounded-2xl bg-ink p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-zinc-400">
              Your turn
            </p>
            <p className="mt-1.5 text-lg font-bold">Find a simpler route for your calculation.</p>
          </div>
          <Link
            href="/"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-bold text-white sm:mt-0"
          >
            Open the calculator
          </Link>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
