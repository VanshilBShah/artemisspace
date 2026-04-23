import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "@/components/Layout";
import { Countdown } from "@/components/Countdown";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Users, Target, Activity } from "lucide-react";
import patch from "@/assets/artemis-patch.png";
import moonImg from "@/assets/moon-earthrise.jpg";
import orionImg from "@/assets/orion-capsule.jpg";
import { missionFacts } from "@/data/missionData";

const SpaceScene = lazy(() =>
  import("@/components/three/SpaceScene").then((m) => ({ default: m.SpaceScene })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Artemis II — Return to the Moon · NASA 2026 Crewed Lunar Mission" },
      {
        name: "description",
        content:
          "Cinematic mission portal for NASA's Artemis II — the first crewed lunar flyby in over 50 years. Explore the crew, spacecraft, trajectory and live launch countdown.",
      },
      { property: "og:title", content: "Artemis II — Return to the Moon" },
      {
        property: "og:description",
        content:
          "First crewed lunar mission in over 50 years. Live countdown, mission profile and crew details.",
      },
      { property: "og:image", content: moonImg },
      { name: "twitter:image", content: moonImg },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <Layout immersive>
      {/* HERO with 3D Earth */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Suspense fallback={<div className="bg-space-gradient h-full w-full" />}>
            <SpaceScene variant="earth" />
          </Suspense>
        </div>

        {/* Vignette */}
        <div className="from-background/80 via-background/0 to-background/90 pointer-events-none absolute inset-0 bg-gradient-to-b" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <Reveal>
            <div className="mb-6 flex justify-center">
              <img
                src={patch}
                alt="Artemis II mission patch"
                width={120}
                height={120}
                className="h-24 w-24 sm:h-32 sm:w-32"
              />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-accent font-mono text-xs tracking-[0.5em] uppercase sm:text-sm">
              NASA · CSA · ESA — Mission AR-002
            </p>
          </Reveal>
          <Reveal delay={300}>
            <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl">
              ARTEMIS{" "}
              <span className="from-accent text-glow bg-gradient-to-r to-white bg-clip-text text-transparent">
                II
              </span>
            </h1>
          </Reveal>
          <Reveal delay={450}>
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base sm:text-lg">
              Four humans. Ten days. A free-return flight beyond the far side of the Moon — the
              first crewed lunar voyage in more than half a century.
            </p>
          </Reveal>
          <Reveal delay={600}>
            <div className="border-border/40 bg-background/40 mt-10 inline-flex flex-col items-center rounded-lg border px-6 py-4 backdrop-blur-md">
              <span className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
                T-Minus to Launch
              </span>
              <div className="mt-3">
                <Countdown />
              </div>
            </div>
          </Reveal>
          <Reveal delay={750}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/80 group">
                <Link to="/mission">
                  Explore the Mission
                  <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-accent/40 text-accent hover:bg-accent/10"
              >
                <Link to="/progress">Mission Status</Link>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="border-border/60 flex h-10 w-6 justify-center rounded-full border pt-2">
            <div className="bg-accent h-2 w-1 animate-bounce rounded-full" />
          </div>
        </div>
      </section>

      {/* MISSION INTRO */}
      <section className="relative px-6 py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          <Reveal>
            <p className="text-accent font-mono text-xs tracking-[0.4em] uppercase">
              Mission Profile
            </p>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              The first crewed lunar mission in over 50 years.
            </h2>
            <p className="text-muted-foreground mt-6 leading-relaxed">
              Artemis II is the first crewed flight of NASA's Space Launch System and the Orion
              spacecraft. It will fly four astronauts approximately 4,600 miles past the far side
              of the Moon on a free-return trajectory — confirming that every Artemis system is
              ready for humans before the lunar landing on Artemis III.
            </p>
            <Button
              asChild
              variant="link"
              className="text-accent mt-4 px-0"
            >
              <Link to="/mission">
                Read the full profile <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>

          <Reveal delay={200}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Duration", value: missionFacts.duration },
                { label: "Crew", value: `${missionFacts.crewSize} astronauts` },
                { label: "Apogee", value: missionFacts.apogee },
                { label: "Trajectory", value: missionFacts.trajectory },
                { label: "Vehicle", value: missionFacts.vehicleHeight },
                { label: "Liftoff Thrust", value: missionFacts.thrust },
              ].map((f) => (
                <div
                  key={f.label}
                  className="border-border/50 bg-card/40 group hover:border-accent/60 rounded-md border p-4 backdrop-blur-sm transition-all"
                >
                  <div className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">
                    {f.label}
                  </div>
                  <div className="text-foreground mt-2 font-mono text-base font-semibold">
                    {f.value}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRAJECTORY 3D SCENE */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <SpaceScene variant="trajectory" />
          </Suspense>
        </div>
        <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent" />
        <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-6 pb-16">
          <Reveal>
            <p className="text-accent font-mono text-xs tracking-[0.4em] uppercase">
              The Trajectory
            </p>
            <h2 className="mt-3 max-w-2xl text-4xl font-bold sm:text-5xl">
              Earth → far side of the Moon → splashdown.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl">
              A hybrid free-return path that lets gravity do the work — Orion loops behind the
              Moon and is slung back toward Earth without firing its main engine.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SPACECRAFT */}
      <section className="relative px-6 py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          <Reveal>
            <div className="relative h-[420px] overflow-hidden rounded-lg">
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
          <Reveal delay={200}>
            <p className="text-accent font-mono text-xs tracking-[0.4em] uppercase">
              The Spacecraft
            </p>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Orion + SLS Block 1.</h2>
            <p className="text-muted-foreground mt-6">
              A 322-foot Space Launch System carries the Orion crew vehicle, its European Service
              Module, and the Launch Abort System on the most powerful rocket NASA has ever flown.
            </p>
            <Button asChild variant="link" className="text-accent mt-4 px-0">
              <Link to="/spacecraft">
                Explore the hardware <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* MOON / OBJECTIVES */}
      <section className="relative overflow-hidden">
        <img
          src={moonImg}
          alt="Lunar surface with Earth in the distance"
          width={1600}
          height={1024}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="from-background via-background/60 to-background absolute inset-0 bg-gradient-to-b" />
        <div className="relative mx-auto max-w-6xl px-6 py-32">
          <Reveal>
            <p className="text-accent font-mono text-xs tracking-[0.4em] uppercase">
              Mission Objectives
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-bold sm:text-5xl">
              Prove the systems. Train the crew. Set the stage for landing.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Rocket,
                title: "Validate hardware",
                body: "Confirm Orion, SLS and ground systems perform with humans aboard in deep space.",
              },
              {
                icon: Users,
                title: "Test life support",
                body: "Operate the Environmental Control & Life Support System for a 10-day mission.",
              },
              {
                icon: Target,
                title: "Pave the way for III",
                body: "Demonstrate every flight phase short of lunar descent ahead of the 2027 landing.",
              },
            ].map((o, i) => (
              <Reveal key={o.title} delay={i * 120}>
                <div className="border-border/60 bg-card/60 hover:border-accent/60 h-full rounded-lg border p-6 backdrop-blur-md transition-all">
                  <div className="bg-primary/20 ring-accent/30 inline-flex h-12 w-12 items-center justify-center rounded-md ring-1">
                    <o.icon className="text-accent h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{o.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{o.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <Activity className="text-accent mx-auto h-10 w-10 animate-pulse" />
            <h2 className="mt-6 text-4xl font-bold sm:text-5xl">Track every milestone.</h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              From wet dress rehearsal to liftoff — follow the live mission status, the integrated
              vehicle, and the four humans who will fly it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/80">
                <Link to="/progress">Mission Progress</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-accent/40 text-accent hover:bg-accent/10"
              >
                <Link to="/crew">Meet the Crew</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
