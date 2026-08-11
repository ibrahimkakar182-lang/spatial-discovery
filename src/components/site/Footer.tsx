import { useRef } from "react";

/** The final room: deep teal, ivory typography, four artifact outlines that answer the cursor. */
export function SiteFooter() {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.querySelectorAll<HTMLElement>("[data-artifact]").forEach((n, i) => {
      const d = (i + 1) * 5;
      n.style.transform = `translate3d(${x * d}px, ${y * d * 0.6}px, 0) rotate(${x * (i % 2 ? 1.4 : -1.4)}deg)`;
    });
  };

  return (
    <footer
      ref={ref}
      onPointerMove={onMove}
      className="relative z-10 overflow-hidden px-6 pt-32 pb-14 md:px-14"
      style={{ background: "var(--color-teal)" }}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-16 opacity-[0.18]">
        <svg data-artifact width="180" height="240" viewBox="0 0 180 240" fill="none" stroke="var(--color-ivory)">
          <rect x="10" y="10" width="160" height="220" />
          <path d="M30 60h120M30 90h120M30 120h90M30 170h120" />
        </svg>
        <svg data-artifact width="240" height="240" viewBox="0 0 240 240" fill="none" stroke="var(--color-ivory)">
          <circle cx="120" cy="120" r="110" />
          <circle cx="120" cy="120" r="78" />
          <circle cx="120" cy="120" r="44" />
        </svg>
        <svg data-artifact width="220" height="240" viewBox="0 0 220 240" fill="none" stroke="var(--color-ivory)">
          {Array.from({ length: 14 }).map((_, i) => (
            <path key={i} d={`M${14 + i * 14} 20 C ${20 + i * 14} 90, ${8 + i * 14} 150, ${16 + i * 14} 220`} />
          ))}
        </svg>
        <svg data-artifact width="200" height="240" viewBox="0 0 200 240" fill="none" stroke="var(--color-ivory)">
          <rect x="8" y="24" width="140" height="190" />
          <rect x="34" y="12" width="140" height="190" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <p className="label-xs text-ivory/60">TOEFL26PLUS · THE FINAL ROOM</p>
        <p className="mt-10 max-w-4xl font-display text-[clamp(2rem,5.6vw,4.4rem)] leading-[1.02] tracking-[-0.02em] text-ivory">
          Your next score starts with what you practice next.
        </p>
        <a
          href="#exhibits"
          className="label-xs mt-12 inline-flex items-center gap-3 border border-ivory/60 px-8 py-4 text-ivory transition-colors hover:bg-ivory hover:text-teal"
        >
          START PRACTICING <span aria-hidden>→</span>
        </a>

        <div className="mt-28 flex flex-wrap items-center justify-between gap-6 border-t border-ivory/20 pt-6">
          <p className="label-xs text-ivory/50">© {new Date().getFullYear()} TOEFL26PLUS</p>
          <div className="flex gap-7">
            {["ENGINES", "PRACTICE", "PROGRESS", "CONTACT"].map((l) => (
              <a key={l} href="#exhibits" className="label-xs text-ivory/50 hover:text-ivory">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
