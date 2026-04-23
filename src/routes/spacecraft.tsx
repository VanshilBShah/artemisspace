import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import slsImg from "@/assets/sls-rocket.jpg";
import orionImg from "@/assets/orion-capsule.jpg";

const SpaceScene = lazy(() =>
  import("@/components/three/SpaceScene").then((m) => ({ default: m.SpaceScene })),
);

export const Route = createFileRoute("/spacecraft")({
  head: () => ({
    meta: [
      { title: "Spacecraft — Orion & SLS · Artemis II" },
      {
        name: "description",
        content:
          "Inside the Artemis II hardware — Orion crew vehicle and the Space Launch System Block 1, the most powerful rocket NASA has ever flown.",
      },
      { property: "og:title", content: "Spacecraft — Orion & SLS · Artemis II" },
      {
        property: "og:description",
        content: "Specs and systems behind Orion and the SLS Block 1.",
      },
      { property: "og:image", content: orionImg },
    ],
  }),
  component: SpacecraftPage,
});

const orionSpecs = [
  { label: "Height", value: "10.5 ft" },
  { label: "Diameter", value: "16.5 ft" },
  { label: "Crew", value: "4 astronauts" },
  { label: "Habitable Vol.", value: "316 ft³" },
  { label: "Max Re-entry", value: "~25,000 mph" },
  { label: "Heat Shield", value: "AVCOAT" },
];

const slsSpecs = [
  { label: "Height", value: "322 ft" },
  { label: "Mass", value: "5.75M lbs" },
  { label: "Thrust", value: "8.8M lbf" },
  { label: "Stage 1", value: "Core + 2 SRBs" },
  { label: "Upper Stage", value: "ICPS" },
  { label: "Payload to TLI", value: "27 t" },
];

function SpacecraftPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-12">
        <Reveal>
          <p className="text-accent font-mono text-xs tracking-[0.4em] uppercase">The Hardware</p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">
            Built to leave Earth.
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Two flight elements, decades of engineering — Orion and the Space Launch System are the
            only hardware on Earth designed to send humans beyond low-Earth orbit.
          </p>
        </Reveal>
      </section>

      {/* ORION */}
      <section className="relative px-6 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="border-border/60 bg-card/40 relative h-[480px] overflow-hidden rounded-lg border">
              <Suspense
                fallback={
                  <img
                    src={orionImg}
                    alt="Orion spacecraft"
                    width={1600}
                    height={1024}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                }
              >
                <SpaceScene variant="spacecraft" />
              </Suspense>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-accent font-mono text-xs tracking-[0.4em] uppercase">
              Crew Vehicle
            </p>
            <h2 className="mt-3 text-4xl font-bold">Orion</h2>
            <p className="text-muted-foreground mt-4">
              The Orion crew module is built by Lockheed Martin and powered by the European Service
              Module from ESA + Airbus. It carries four astronauts, life support for 21 days, and a
              heat shield rated for lunar return velocities.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {orionSpecs.map((s) => (
                <div
                  key={s.label}
                  className="border-border/50 bg-card/40 rounded-md border p-3 font-mono"
                >
                  <div className="text-muted-foreground text-[10px] tracking-[0.25em] uppercase">
                    {s.label}
                  </div>
                  <div className="text-foreground mt-1 text-sm font-semibold">{s.value}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SLS */}
      <section className="relative px-6 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <Reveal delay={150} className="md:order-2">
            <div className="border-border/60 relative aspect-[3/4] overflow-hidden rounded-lg border">
              <img
                src={slsImg}
                alt="SLS rocket on launchpad"
                width={1280}
                height={1600}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="from-background/60 absolute inset-0 bg-gradient-to-t to-transparent" />
            </div>
          </Reveal>
          <Reveal>
            <p className="text-accent font-mono text-xs tracking-[0.4em] uppercase">
              Launch Vehicle
            </p>
            <h2 className="mt-3 text-4xl font-bold">SLS Block 1</h2>
            <p className="text-muted-foreground mt-4">
              The Space Launch System is the most powerful rocket NASA has ever flown — a
              two-stage, super heavy-lift vehicle generating 8.8 million pounds of thrust at
              liftoff. The Block 1 configuration uses an ICPS upper stage to send Orion toward the
              Moon.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {slsSpecs.map((s) => (
                <div
                  key={s.label}
                  className="border-border/50 bg-card/40 rounded-md border p-3 font-mono"
                >
                  <div className="text-muted-foreground text-[10px] tracking-[0.25em] uppercase">
                    {s.label}
                  </div>
                  <div className="text-foreground mt-1 text-sm font-semibold">{s.value}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
