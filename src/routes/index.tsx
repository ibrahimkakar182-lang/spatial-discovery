import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { journey, setProgress } from "@/lib/journey";
import { Header, Overlay, usePointerTracking } from "@/components/journey/Overlay";
import { ActTwo } from "@/components/site/ActTwo";
import { SiteFooter } from "@/components/site/Footer";

const World = lazy(() =>
  import("@/components/journey/World").then((m) => ({ default: m.World })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TOEFL26PLUS — Travel through the four TOEFL engines" },
      {
        name: "description",
        content:
          "A continuous 3D journey through Reading, Listening, Speaking and Writing. TOEFL preparation built around how you actually perform.",
      },
      { property: "og:title", content: "TOEFL26PLUS — Travel through the four TOEFL engines" },
      {
        property: "og:description",
        content:
          "Scroll becomes a camera. Enter the Reading page, the Listening chamber, the Speaking sculpture and the Writing studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const track = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  usePointerTracking();

  useEffect(() => {
    journey.mobile = window.matchMedia("(max-width: 820px)").matches;
    journey.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMounted(true);

    const lenis = new Lenis({ lerp: journey.reduced ? 1 : 0.09, wheelMultiplier: 1 });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      const el = track.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        setProgress(total > 0 ? -r.top / total : 0);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative">
      <Header />

      {/* the cinematic journey: one pinned viewport, scroll drives the camera */}
      <div ref={track} style={{ height: "1300vh" }} className="relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {mounted && (
            <Suspense fallback={null}>
              <World />
            </Suspense>
          )}
          <Overlay />
        </div>
      </div>

      <ActTwo />
      <SiteFooter />
    </main>
  );
}
