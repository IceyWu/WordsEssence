/**
 * A title written straight onto the ground — like the cover label of a
 * notebook. Everything here is hand-drawn (handwriting face).
 */
export function SiteHeader({ count }: { count: number }) {
  return (
    <header className="relative z-10 px-4 pt-12 pb-2 text-center sm:pt-16">
      <h1 className="handwriting text-5xl leading-none text-ink sm:text-6xl">
        字里行间
      </h1>
      <p className="handwriting mt-3 text-xl tracking-[0.3em] text-ink-faint">
        a commonplace book
      </p>
      <p className="handwriting mt-1 text-lg text-ink-soft/80">
        收存的第 {count} 段
      </p>
    </header>
  );
}
