import { useEffect, useRef, useState } from "react";
import { CHAPTERS, chapterAt, journey, subscribeProgress } from "@/lib/journey";

const NAV = ["ENGINES", "PRACTICE", "PROGRESS"];

export function Header() {
  const [chapter, setChapter] = useState(CHAPTERS[0]!);
  const [dark, setDark] = useState(false);
  useEffect(
    () =>
      subscribeProgress((p) => {
        const c = chapterAt(p);
        setChapter((prev) => (prev.key === c.key ? prev : c));
        setDark(p > 0.5 && p < 0.93);
      }),
    [],
  );
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-6 py-5 md:px-10">
      <div
        className="flex items-center justify-between transition-colors duration-700"
        style={{ color: dark ? "var(--color-ink)" : "var(--color-ivory)" }}
      >
        <div className="flex items-baseline gap-6">
          <a href="/" className="pointer-events-auto font-display text-[15px] tracking-[0.18em]">
            TOEFL<span className="text-champagne">26</span>PLUS
          </a>
          <span className="label-xs hidden opacity-60 md:inline">
            {chapter.index} / {chapter.name}
          </span>
        </div>
        <nav className="pointer-events-auto flex items-center gap-7">
          {NAV.map((n) => (
            <a key={n} href="#exhibits" className="label-xs hidden opacity-70 hover:opacity-100 md:inline">
              {n}
            </a>
          ))}
          <a href="#exhibits" className="label-xs opacity-70 hover:opacity-100">
            SIGN IN
          </a>
          <a
            href="#exhibits"
            className="label-xs border px-4 py-2 transition-colors"
            style={{
              borderColor: "currentColor",
            }}
          >
            START PRACTICING
          </a>
        </nav>
      </div>
    </header>
  );
}

/** Text that lives inside the world: minimal, and it never fights the 3D. */
export function Overlay() {
  const hero = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState<{ i: string; t: string; s: string } | null>(null);

  useEffect(
    () =>
      subscribeProgress((p) => {
        if (hero.current) {
          const o = Math.max(0, 1 - p / 0.11);
          hero.current.style.opacity = String(o);
          hero.current.style.transform = `translate3d(0, ${(1 - o) * -40}px, 0)`;
          hero.current.style.pointerEvents = o < 0.2 ? "none" : "auto";
        }
        const c = chapterAt(p);
        const inner = (p - c.from) / (c.to - c.from);
        const visible = p > 0.22 && inner > 0.1 && inner < 0.8;
        if (caption.current) caption.current.style.opacity = visible ? "1" : "0";
        const copy: Record<string, { i: string; t: string; s: string }> = {
          reading: {
            i: "01",
            t: "The page is a place.",
            s: "Hover a line — the argument underneath lifts away from the paper.",
          },
          listening: {
            i: "02",
            t: "Sound has architecture.",
            s: "Each panel is a moment of emphasis, contrast or transition.",
          },
          speaking: {
            i: "03",
            t: "Speech, made physical.",
            s: "Move through the strands. Fluency, repair and delivery answer back.",
          },
          writing: {
            i: "04",
            t: "A studio, not a scoreboard.",
            s: "Lift a sheet and the structure beneath it becomes visible.",
          },
          system: {
            i: "05",
            t: "Four engines. One instrument.",
            s: "Everything you just travelled through is a single system.",
          },
        };
        const next = copy[c.key] ?? null;
        setLine((prev) => (prev?.i === next?.i ? prev : next));
      }),
    [],
  );

  return (
    <>
      <div
        ref={hero}
        className="pointer-events-none absolute inset-0 z-30 flex items-end px-6 pb-16 md:px-14 md:pb-20"
      >
        <div className="max-w-3xl text-ivory">
          <p className="label-xs mb-6 opacity-70">Reading · Listening · Speaking · Writing</p>
          <h1 className="font-display text-[clamp(2.2rem,5.4vw,4.6rem)] leading-[0.98] tracking-[-0.02em]">
            TOEFL preparation,
            <br />
            <span className="italic text-stone">built around how you perform.</span>
          </h1>
          <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#exhibits"
              className="label-xs border border-ivory/70 bg-ivory px-7 py-3.5 text-teal transition-colors hover:bg-champagne hover:text-ink"
            >
              START PRACTICING
            </a>
            <a href="#exhibits" className="label-xs border border-ivory/40 px-7 py-3.5 hover:border-ivory">
              EXPLORE
            </a>
          </div>
          <p className="label-xs mt-12 opacity-45">
            Move the cursor across the monogram — it becomes transparent · scroll to travel
          </p>
        </div>
      </div>

      <div
        ref={caption}
        className="pointer-events-none absolute bottom-14 left-6 z-30 max-w-sm opacity-0 transition-opacity duration-700 md:left-14"
      >
        {line && (
          <>
            <p className="label-xs mb-3 text-champagne">{line.i}</p>
            <p className="font-display text-2xl leading-tight text-ivory mix-blend-difference">
              {line.t}
            </p>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ivory/70 mix-blend-difference">
              {line.s}
            </p>
          </>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 z-30 md:right-14">
        <ProgressRule />
      </div>
    </>
  );
}

function ProgressRule() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      subscribeProgress((p) => {
        if (bar.current) bar.current.style.transform = `scaleX(${Math.max(0.01, p)})`;
      }),
    [],
  );
  return (
    <div className="flex items-center gap-3">
      <span className="label-xs text-ivory/50 mix-blend-difference">JOURNEY</span>
      <div className="h-px w-28 bg-ivory/25 md:w-44">
        <div ref={bar} className="h-px origin-left bg-champagne" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}

export function usePointerTracking() {
  useEffect(() => {
    const move = (e: PointerEvent) => {
      journey.px = (e.clientX / window.innerWidth) * 2 - 1;
      journey.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const touch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      journey.px = (t.clientX / window.innerWidth) * 2 - 1;
      journey.py = (t.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("touchmove", touch, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("touchmove", touch);
    };
  }, []);
}
