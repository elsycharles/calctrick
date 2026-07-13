import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl, serializeJsonLd } from "@/lib/site";
import { getMentalMathGuide, MENTAL_MATH_GUIDES } from "@/lib/trick-content";

interface GuidePageProps {
  readonly params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return MENTAL_MATH_GUIDES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getMentalMathGuide(slug);

  if (guide === undefined) {
    return {};
  }

  const path = `/tricks/${guide.slug}`;

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: `${guide.title} | CalcTrick`,
      description: guide.description,
      url: path,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getMentalMathGuide(slug);

  if (guide === undefined) {
    notFound();
  }

  const path = `/tricks/${guide.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    mainEntityOfPage: absoluteUrl(path),
    publisher: {
      "@type": "Organization",
      name: "CalcTrick",
      url: absoluteUrl("/"),
    },
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      <SiteHeader />
      <article className="mx-auto w-full max-w-3xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] sm:px-6 sm:pt-[calc(6.5rem+env(safe-area-inset-top))]">
        <header className="py-6 sm:py-10">
          <Link href="/tricks" className="text-xs font-bold text-zinc-500 hover:text-ink">
            All mental math tricks
          </Link>
          <p className="mt-7 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">
            {guide.label}
          </p>
          <h1 className="mt-2.5 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.05em] text-ink sm:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">{guide.introduction}</p>
          <div className="mt-6 overflow-x-auto rounded-2xl bg-ink p-5 text-white sm:p-6">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-zinc-400">
              The pattern
            </p>
            <p className="mt-2 whitespace-nowrap font-mono text-xl font-bold sm:text-2xl">
              {guide.formula}
            </p>
          </div>
        </header>

        <section className="border-t border-zinc-300 py-7" aria-labelledby="method-heading">
          <h2 id="method-heading" className="text-2xl font-bold tracking-[-0.035em] text-ink">
            Step by step
          </h2>
          <ol className="mt-5 space-y-3">
            {guide.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-6 text-zinc-700">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent font-mono text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-zinc-300 py-7" aria-labelledby="examples-heading">
          <h2 id="examples-heading" className="text-2xl font-bold tracking-[-0.035em] text-ink">
            Worked examples
          </h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-300 bg-white">
            {guide.examples.map((example) => (
              <div
                key={example.calculation}
                className="grid gap-2 border-b border-zinc-200 p-4 last:border-b-0 min-[430px]:grid-cols-[1fr_1.4fr_auto] min-[430px]:items-center sm:p-5"
              >
                <p className="font-mono text-sm font-bold text-zinc-500 line-through">
                  {example.calculation}
                </p>
                <p className="font-mono text-sm font-bold text-ink">{example.route}</p>
                <p className="font-mono text-xl font-bold text-accent">{example.answer}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl border-l-4 border-accent bg-white px-4 py-3 text-sm leading-6 text-zinc-600">
            {guide.note}
          </p>
        </section>

        <section className="rounded-2xl bg-ink p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-zinc-400">
              Try the pattern
            </p>
            <p className="mt-1.5 text-lg font-bold">See every route CalcTrick can find.</p>
          </div>
          <Link
            href={`/${guide.calculatorQuery}`}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-bold text-white sm:mt-0"
          >
            Open this example
          </Link>
        </section>

        <SiteFooter />
      </article>
    </main>
  );
}
