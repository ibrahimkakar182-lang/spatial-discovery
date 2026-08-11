import { useRef, useState } from "react";
import plateArchitecture from "@/assets/plate-architecture.jpg";
import plateArchive from "@/assets/plate-archive.jpg";

function ExhibitLabel({ n, title, note }: { n: string; title: string; note: string }) {
  return (
    <div className="mb-12 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-beige pt-5">
      <span className="label-xs text-champagne">EXHIBIT {n}</span>
      <h2 className="font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-none tracking-[-0.02em]">
        {title}
      </h2>
      <p className="max-w-sm text-[13px] leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

/* ---------------- 01 · PRACTICE ---------------- */

const ANSWERS = [
  { t: "It underestimated tidal variation.", ok: true, why: "Matches lines 14–18: the survey excludes tidal data." },
  { t: "It was funded by the admiralty.", ok: false, why: "True but irrelevant — the question asks about method." },
  { t: "It relied on a single instrument.", ok: false, why: "Not stated. This is an assumption, not an inference." },
  { t: "It was later reproduced abroad.", ok: false, why: "Out of scope for the paragraph in question." },
];

function ExhibitPractice() {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div style={{ perspective: "1400px" }}>
      <div
        className="border border-beige bg-ivory p-8 shadow-[0_40px_80px_-60px_rgba(29,63,62,0.9)] md:p-12"
        style={{ transform: "rotateX(4deg)", transformStyle: "preserve-3d" }}
      >
        <p className="label-xs text-teal">READING · QUESTION 4 · INFERENCE</p>
        <p className="mt-5 max-w-2xl font-display text-2xl leading-snug md:text-3xl">
          What can be inferred about the author's view of the earliest coastal surveys?
        </p>
        <ul className="mt-9 space-y-3" style={{ transformStyle: "preserve-3d" }}>
          {ANSWERS.map((a, i) => (
            <li key={a.t} style={{ transformStyle: "preserve-3d" }}>
              <button
                onClick={() => setPicked(i)}
                className="group relative block w-full border border-beige bg-card px-6 py-5 text-left transition-transform duration-300 hover:-translate-y-1 hover:[transform:translateZ(28px)_translateY(-4px)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className="label-xs mr-5 text-muted-foreground">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="font-display text-lg">{a.t}</span>
                <span
                  className="absolute inset-y-0 left-0 w-[3px] transition-colors"
                  style={{
                    backgroundColor:
                      picked === i
                        ? a.ok
                          ? "var(--color-teal)"
                          : "var(--color-terracotta)"
                        : "transparent",
                  }}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-500"
                style={{ maxHeight: picked === i ? 120 : 0, opacity: picked === i ? 1 : 0 }}
              >
                <p className="border-x border-b border-beige bg-stone/60 px-6 py-4 text-[13px] leading-relaxed">
                  <span className="label-xs mr-3" style={{ color: a.ok ? "var(--color-teal)" : "var(--color-terracotta)" }}>
                    {a.ok ? "CORRECT" : "WHY NOT"}
                  </span>
                  {a.why}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- 02 · FEEDBACK ---------------- */

const SAMPLE = [
  { t: "The city should invest in public transport before widening its roads.", f: "CLAIM · clear and arguable — good opening move." },
  { t: "Roads that are widened fill up again, and this is something that has happened many times in many places.", f: "RANGE · vague quantifier; name the effect (induced demand)." },
  { t: "Trains, however, move more people per hour of infrastructure.", f: "EVIDENCE · strong contrast marker, well placed." },
  { t: "So it is better.", f: "DEVELOPMENT · conclusion arrives too early; explain the mechanism." },
];

function ExhibitFeedback() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="grid gap-10 md:grid-cols-[1.3fr_1fr]" style={{ perspective: "1200px" }}>
      <div className="border border-beige bg-card p-8 md:p-11" style={{ transformStyle: "preserve-3d" }}>
        <p className="label-xs text-teal">WRITING · INDEPENDENT · DRAFT 2</p>
        <div className="mt-7 space-y-1">
          {SAMPLE.map((s, i) => (
            <p
              key={i}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover((h) => (h === i ? null : h))}
              className="cursor-default font-display text-xl leading-relaxed transition-all duration-300 md:text-[1.4rem]"
              style={{
                transform: hover === i ? "translate3d(10px,-6px,40px)" : "none",
                color: hover !== null && hover !== i ? "var(--color-beige)" : "var(--color-ink)",
              }}
            >
              {s.t}
            </p>
          ))}
        </div>
      </div>
      <div className="relative border-l border-beige pl-8">
        {SAMPLE.map((s, i) => (
          <p
            key={i}
            className="absolute max-w-xs pr-6 text-[13px] leading-relaxed transition-all duration-500"
            style={{
              top: i * 26 + 20,
              opacity: hover === i ? 1 : 0,
              transform: hover === i ? "translateY(0)" : "translateY(14px)",
            }}
          >
            <span className="label-xs mr-3 text-champagne">{s.f.split(" · ")[0]}</span>
            {s.f.split(" · ")[1]}
          </p>
        ))}
        <p
          className="text-[13px] text-muted-foreground transition-opacity duration-300"
          style={{ opacity: hover === null ? 1 : 0 }}
        >
          Move across the draft. Each sentence lifts and the note printed beneath it appears.
        </p>
      </div>
    </div>
  );
}

/* ---------------- 03 · PROGRESS ---------------- */

const SESSIONS = Array.from({ length: 14 }).map((_, i) => ({
  date: `WEEK ${String(i + 1).padStart(2, "0")}`,
  band: 18 + Math.round(i * 0.75 + (i % 3 === 0 ? 1 : 0)),
  skill: ["READING", "LISTENING", "SPEAKING", "WRITING"][i % 4]!,
  notes: 2 + (i % 5),
}));

function ExhibitProgress() {
  const rail = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div
        ref={rail}
        className="flex snap-x gap-5 overflow-x-auto pb-8"
        style={{ perspective: "1300px", scrollbarWidth: "thin" }}
      >
        {SESSIONS.map((s, i) => {
          const age = 1 - i / (SESSIONS.length - 1);
          return (
            <article
              key={s.date}
              className="group relative shrink-0 snap-start border p-6 transition-transform duration-500 hover:[transform:translateZ(50px)_rotateY(-6deg)]"
              style={{
                width: 168 + i * 5,
                height: 250 + i * 6,
                background: `color-mix(in oklab, var(--color-ivory) ${100 - age * 26}%, var(--color-beige))`,
                borderColor: `color-mix(in oklab, var(--color-teal) ${18 + i * 5}%, transparent)`,
                transformStyle: "preserve-3d",
              }}
            >
              <p className="label-xs text-muted-foreground">{s.date}</p>
              <p
                className="mt-4 font-display leading-none"
                style={{ fontSize: 30 + i * 1.6, color: `color-mix(in oklab, var(--color-teal) ${45 + i * 4}%, var(--color-ink))` }}
              >
                {s.band}
              </p>
              <p className="label-xs mt-3">{s.skill}</p>
              <div className="absolute inset-x-6 bottom-6 space-y-1.5">
                {Array.from({ length: s.notes }).map((_, k) => (
                  <div key={k} className="h-px" style={{ background: "var(--color-champagne)", opacity: 0.3 + k * 0.14 }} />
                ))}
              </div>
            </article>
          );
        })}
      </div>
      <p className="label-xs text-muted-foreground">SCROLL THE ARCHIVE HORIZONTALLY · OLDEST TO NEWEST</p>
    </div>
  );
}

/* ---------------- 04 · LIBRARY ---------------- */

const ITEMS = [
  { t: "Coastal Cartography", k: "PASSAGE", img: plateArchitecture },
  { t: "Kiln & Glass", k: "LECTURE", img: null },
  { t: "Field Notes, vol. II", k: "ARCHIVE", img: plateArchive },
  { t: "Migration Studies", k: "PASSAGE", img: null },
  { t: "Acoustics of Halls", k: "LECTURE", img: null },
  { t: "Revision Ledger", k: "TEMPLATE", img: null },
];

function ExhibitLibrary() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1500px" }}>
      {ITEMS.map((it, i) => (
        <article
          key={it.t}
          className="group relative h-72 overflow-hidden border border-beige bg-card transition-transform duration-500 hover:[transform:translateZ(60px)_translateY(-10px)]"
          style={{ transformStyle: "preserve-3d", transform: `rotateY(${(i % 3) - 1}deg)` }}
        >
          {it.img ? (
            <img
              src={it.img}
              alt=""
              loading="lazy"
              width={1280}
              height={896}
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: "linear-gradient(150deg, var(--color-stone), var(--color-ivory))" }} />
          )}
          <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ background: "linear-gradient(to top, color-mix(in oklab, var(--color-teal) 80%, transparent), transparent 62%)" }}>
            <p className="label-xs text-ivory/70">{it.k}</p>
            <p className="mt-2 font-display text-2xl text-ivory">{it.t}</p>
            <p className="mt-3 max-h-0 overflow-hidden text-[13px] leading-relaxed text-ivory/80 transition-all duration-500 group-hover:max-h-24">
              Opens with annotations, timed questions and a printed answer key beneath the page.
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ActTwo() {
  return (
    <section id="exhibits" className="relative z-10 bg-background px-6 py-28 md:px-14 md:py-40">
      <div className="mx-auto max-w-6xl space-y-36">
        <div>
          <ExhibitLabel n="01" title="Practice, on a surface" note="A single question, sitting on paper. Choose, and the paper answers underneath." />
          <ExhibitPractice />
        </div>
        <div>
          <ExhibitLabel n="02" title="Feedback beneath the line" note="Your draft, with the reasoning printed one layer down." />
          <ExhibitFeedback />
        </div>
        <div>
          <ExhibitLabel n="03" title="An archive of attempts" note="No charts. The tiles themselves get larger, warmer and more densely annotated." />
          <ExhibitProgress />
        </div>
        <div>
          <ExhibitLabel n="04" title="The reading room" note="Passages, lectures and templates held as objects, not thumbnails." />
          <ExhibitLibrary />
        </div>
      </div>
    </section>
  );
}
