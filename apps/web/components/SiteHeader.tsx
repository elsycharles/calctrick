import Link from "next/link";

import { BrandMark } from "./BrandMark";
import { OfflineGuide } from "./OfflineGuide";

export function SiteHeader() {
  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200/90 bg-canvas/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between gap-3 px-4 sm:px-6"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-lg"
          aria-label="CalcTrick home"
        >
          <BrandMark size={34} />
          <div>
            <p className="text-base font-bold tracking-[-0.02em] text-ink">CalcTrick</p>
            <p className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-zinc-500 min-[390px]:block">
              Mental math, simplified
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/tricks"
            className="hidden rounded-lg px-2 py-2 text-xs font-bold text-zinc-600 transition-colors hover:text-ink sm:inline-flex"
          >
            Math tricks
          </Link>
          <OfflineGuide />
        </div>
      </nav>
    </div>
  );
}
