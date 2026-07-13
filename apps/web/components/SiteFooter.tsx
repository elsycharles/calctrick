import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-10 flex flex-col gap-3 border-t border-zinc-300 py-5 text-[0.7rem] leading-5 text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
      <span>© {new Date().getFullYear()} CalcTrick</span>
      <span>Your calculations are processed and stored on this device.</span>
      <nav className="flex items-center gap-4" aria-label="Footer">
        <Link className="font-semibold text-zinc-600 hover:text-ink" href="/tricks">
          Math tricks
        </Link>
        <Link className="font-semibold text-zinc-600 hover:text-ink" href="/privacy">
          Privacy
        </Link>
      </nav>
    </footer>
  );
}
