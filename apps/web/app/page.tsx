import { CalculatorApp } from "@/components/CalculatorApp";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl, serializeJsonLd, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import Link from "next/link";

const applicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: absoluteUrl("/"),
  description: SITE_DESCRIPTION,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript and a modern web browser",
  featureList: [
    "Ranked mental-math strategies",
    "Step-by-step explanations",
    "Calculation history stored on the device",
    "Offline support after installation",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(applicationJsonLd) }}
      />
      <SiteHeader />

      <div className="mx-auto w-full max-w-4xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:px-6 sm:pt-[calc(6rem+env(safe-area-inset-top))]">

        <header className="mb-7 grid items-end gap-6 md:mb-9 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-9">
          <div>
            <p className="mb-2.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">
              Mental math, reworked
            </p>
            <h1 className="max-w-2xl text-balance text-[2.35rem] font-bold leading-[1.02] tracking-[-0.05em] text-ink sm:text-[3.25rem] md:text-[3.75rem]">
              Make the numbers work for you.
            </h1>
            <p className="mt-3.5 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
              Turn one difficult calculation into a set of smaller, clearer moves —
              ranked by mental effort.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-300 bg-white p-4" aria-hidden="true">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-zinc-400">
              A simpler route
            </p>
            <div className="mt-3 grid grid-cols-2 gap-4 font-mono">
              <div>
                <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-zinc-400">Original</p>
                <p className="mt-1.5 text-sm font-bold text-zinc-400 line-through decoration-2">24 × 25</p>
              </div>
              <div className="border-l border-zinc-200 pl-4">
                <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-accent">Simpler</p>
                <p className="mt-1.5 text-sm font-bold text-ink">6 × 100</p>
              </div>
            </div>
            <div className="mt-3.5 flex items-end justify-between border-t border-zinc-200 pt-3.5">
              <span className="text-[0.7rem] font-semibold text-zinc-500">Same answer</span>
              <span className="font-mono text-2xl font-bold tracking-[-0.04em] text-accent">600</span>
            </div>
          </div>
        </header>

        <CalculatorApp />

        <section className="mt-12 border-t border-zinc-300 pt-9" aria-labelledby="how-it-works">
          <div className="max-w-2xl">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">
              How it works
            </p>
            <h2
              id="how-it-works"
              className="mt-2 text-2xl font-bold tracking-[-0.035em] text-ink sm:text-3xl"
            >
              A mental math calculator that explains the route.
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              CalcTrick looks for equivalent calculations that demand less mental effort.
              It ranks the useful routes, keeps the arithmetic on your device and lets you
              reveal every step when you want to understand the method.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["1", "Enter a calculation", "Use addition, subtraction, multiplication or division."],
              ["2", "Compare easier routes", "Start with the strategy that has the lowest mental effort."],
              ["3", "Learn the pattern", "Open the details, then reuse the same idea with new numbers."],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-2xl border border-zinc-300 bg-white p-4 sm:p-5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-accent font-mono text-xs font-bold text-white">
                  {number}
                </span>
                <h3 className="mt-4 text-sm font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-zinc-600">{text}</p>
              </div>
            ))}
          </div>

          <Link
            href="/tricks"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-zinc-300 bg-white px-4 text-xs font-bold text-ink transition-colors hover:border-accent"
          >
            Explore the mental math guides
          </Link>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
