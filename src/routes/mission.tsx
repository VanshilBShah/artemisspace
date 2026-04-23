import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import moonImg from "@/assets/moon-earthrise.jpg";
import { missionFacts } from "@/data/missionData";

const SpaceScene = lazy(() =>
  import("@/components/three/SpaceScene").then((m) => ({ default: m.SpaceScene })),
);

export const Route = createFileRoute("/mission")({
  head: () => ({
    meta: [
      { title: "Mission Profile — Artemis II" },
      {
        name: "description",
        content:
          "10-day free-return lunar flyby. ~4,600 miles past the far side of the Moon. The full Artemis II mission profile and objectives.",
      },
      { property: "og:title", content: "Mission Profile — Artemis II" },
      {
        property: "og:description",
        content: "Free-return trajectory, objectives, and how Artemis II compares to Apollo 8.",
      },
      { property: "og:image", content: moonImg },
    ],
  }),
  component: MissionPage,
});

const phases = [
  { t: "T-0", title: "Liftoff", body: "SLS departs LC-39B at Kennedy Space Center." },
  { t: "T+8 min", title: "Core Cutoff", body: "Core stage separates; Orion in low-Earth orbit." },
  {
    t: "T+90 min",
    title: "Trans-Lunar Injection",
    body: "ICPS upper stage fires for ~18 minutes, sending Orion toward the Moon.",
  },
  {
    t: "Day 4",
    title: "Lunar Flyby",
    body: "Orion passes ~4,600 mi beyond the far side of the Moon at ~5,500 mph.",
  },
  {
    t: "Day 8",
    title: "Return Cruise",
    body: "Free-return arc carries the crew back to Earth without engine burns.",
  },
  {
    t: "Day 10",
    title: "Splashdown",
    body: "Orion re-enters at ~25,000 mph and splashes down in the Pacific Ocean.",
  },
];

function MissionPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <SpaceScene variant="moon" />
          </Suspense>
        </div>
        <div className="from-background absolute inset-0 bg-gradient-to-b via-transparent to-transparent" />
        <div className="from-background absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
          <Reveal>
            <p className="text-accent font-mono text-xs tracking-[0.4em] uppercase">
              Mission Profile
            </p>
            <h1 className="mt-3 max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
              A free-return arc beyond the far side.
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Facts grid */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {Object.entries(missionFacts).map(([k, v], i) => (
            <Reveal key={k} delay={i * 60}>
              <div className="border-border/60 bg-card/50 hover:border-accent/60 rounded-lg border p-5 backdrop-blur-sm transition">
                <div className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">
                  {k.replace(/([A-Z])/g, " $1")}
                </div>
                <div className="text-foreground mt-2 font-mono text-lg font-semibold">{v}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission phases timeline */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <h2 className="text-4xl font-bold sm:text-5xl">Flight Plan</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Six key phases over roughly ten days — from liftoff at Kennedy to splashdown in the
            Pacific.
          </p>
        </Reveal>

        <div className="border-border/40 mt-12 border-l-2 pl-8">
          {phases.map((p, i) => (
            <Reveal key={p.t} delay={i * 100}>
              <div className="relative pb-10">
                <div className="bg-accent shadow-glow absolute top-1.5 -left-[39px] h-4 w-4 rounded-full" />
                <div className="text-accent font-mono text-xs tracking-[0.3em] uppercase">
                  {p.t}
                </div>
                <h3 className="mt-1 text-xl font-semibold">{p.title}</h3>
                <p className="text-muted-foreground mt-2 max-w-xl">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Apollo 8 comparison */}
      <section className="relative overflow-hidden px-6 py-24">
        <img
          src={moonImg}
          alt="Lunar landscape"
          width={1600}
          height={1024}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="from-background via-background/70 to-background absolute inset-0 bg-gradient-to-r" />
        <div className="relative mx-auto max-w-4xl">
          <Reveal>
            <p className="text-accent font-mono text-xs tracking-[0.4em] uppercase">
              Why It's Historic
            </p>
            <h2 className="mt-3 text-4xl font-bold sm:text-5xl">The first since Apollo 8.</h2>
            <p className="text-muted-foreground mt-6 leading-relaxed">
              In December 1968, Apollo 8 became the first crewed mission to orbit the Moon.
              Artemis II will be the first crewed lunar mission since Apollo 17 in 1972 — and the
              first ever to fly humans on the SLS / Orion stack. It clears the way for Artemis III
              to land astronauts, including the first woman, near the lunar south pole.
            </p>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
