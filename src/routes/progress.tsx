import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { milestones, updates, LAUNCH_DATE } from "@/data/missionData";
import { CheckCircle2, Circle, Loader2, ExternalLink, Calendar, Cloud, Clock } from "lucide-react";
import { Countdown } from "@/components/Countdown";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Mission Progress — Artemis II" },
      {
        name: "description",
        content:
          "Where the Artemis II mission stands today — launch readiness, milestones complete, and the road to liftoff in April 2026.",
      },
      { property: "og:title", content: "Mission Progress — Artemis II" },
      {
        property: "og:description",
        content: "Live status, milestone timeline, and recent updates for Artemis II.",
      },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const completed = milestones.filter((m) => m.status === "complete").length;
  const total = milestones.length;
  const readiness = Math.round((completed / total) * 100);
  const daysToLaunch = Math.max(
    0,
    Math.ceil((LAUNCH_DATE.getTime() - Date.now()) / 86_400_000),
  );

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-12">
        <Reveal>
          <p className="text-accent font-mono text-xs tracking-[0.4em] uppercase">
            Where they stand
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">Mission Progress.</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            A curated snapshot of Artemis II readiness as of April 2026 — milestones, status, and
            the latest updates from Kennedy Space Center.
          </p>
        </Reveal>
      </section>

      {/* Top status row */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="grid gap-5 md:grid-cols-3">
          <Reveal>
            <div className="border-border/60 bg-card/60 rounded-lg border p-6 backdrop-blur-md">
              <div className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">
                Launch Readiness
              </div>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-glow font-mono text-5xl font-bold">{readiness}%</span>
                <span className="text-accent font-mono text-xs tracking-widest">
                  {completed}/{total} MILESTONES
                </span>
              </div>
              <Progress value={readiness} className="mt-4 [&>div]:bg-accent bg-secondary h-2" />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="border-border/60 bg-card/60 rounded-lg border p-6 backdrop-blur-md">
              <div className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">
                T-Minus
              </div>
              <div className="mt-4">
                <Countdown />
              </div>
              <div className="text-muted-foreground mt-3 font-mono text-xs">
                ≈ {daysToLaunch} days · target 15 Apr 2026
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="border-border/60 bg-card/60 rounded-lg border p-6 backdrop-blur-md">
              <div className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">
                Current Phase
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Loader2 className="text-accent h-6 w-6 animate-spin" />
                <span className="text-foreground text-2xl font-semibold">Wet Dress Rehearsal</span>
              </div>
              <div className="text-muted-foreground mt-3 text-sm">
                Terminal countdown demonstration at LC-39B in progress.
              </div>
            </div>
          </Reveal>
        </div>

        {/* Quick stat cards */}
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {[
            { label: "Crew training hours", value: "10,400+" },
            { label: "Integration phase", value: "Stacked" },
            { label: "Vehicle status", value: "On Pad 39B" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="border-border/50 bg-card/40 rounded-md border p-5 backdrop-blur-sm">
                <div className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">
                  {s.label}
                </div>
                <div className="text-foreground mt-2 font-mono text-xl font-semibold">
                  {s.value}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline + Updates side by side */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Reveal>
              <h2 className="text-3xl font-bold">Milestone Timeline</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                From hardware delivery to liftoff.
              </p>
            </Reveal>

            <div className="border-border/40 mt-8 border-l-2 pl-8">
              {milestones.map((m, i) => {
                const Icon =
                  m.status === "complete"
                    ? CheckCircle2
                    : m.status === "in-progress"
                      ? Loader2
                      : Circle;
                const dotClass =
                  m.status === "complete"
                    ? "bg-primary border-primary"
                    : m.status === "in-progress"
                      ? "bg-accent border-accent shadow-glow animate-pulse-glow"
                      : "bg-card border-border";
                const iconClass =
                  m.status === "complete"
                    ? "text-primary-foreground"
                    : m.status === "in-progress"
                      ? "text-accent animate-spin"
                      : "text-muted-foreground";
                return (
                  <Reveal key={m.id} delay={i * 80}>
                    <div className="relative pb-10">
                      <div
                        className={`absolute top-1.5 -left-[42px] h-5 w-5 rounded-full border-2 ${dotClass}`}
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        <Icon className={`h-4 w-4 ${iconClass}`} />
                        <span className="text-accent font-mono text-xs tracking-[0.25em] uppercase">
                          {m.date}
                        </span>
                        <Badge
                          variant={m.status === "complete" ? "secondary" : "outline"}
                          className="font-mono text-[9px] tracking-widest uppercase"
                        >
                          {m.status}
                        </Badge>
                      </div>
                      <h3 className="mt-2 text-xl font-semibold">{m.title}</h3>
                      <p className="text-muted-foreground mt-2 max-w-xl text-sm">
                        {m.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <aside className="lg:col-span-2">
            <Reveal>
              <h2 className="text-3xl font-bold">Recent Updates</h2>
              <p className="text-muted-foreground mt-2 text-sm">Curated mission news.</p>
            </Reveal>
            <div className="mt-8 space-y-4">
              {updates.map((u, i) => (
                <Reveal key={u.headline} delay={i * 80}>
                  <article className="border-border/60 bg-card/60 hover:border-accent/60 group rounded-lg border p-5 backdrop-blur-md transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-mono text-[10px] tracking-[0.25em] uppercase">
                        {u.date}
                      </span>
                      <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                        {u.source}
                      </span>
                    </div>
                    <h3 className="group-hover:text-accent mt-2 text-base font-semibold transition-colors">
                      {u.headline}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">{u.summary}</p>
                    <span className="text-accent/80 mt-3 inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase">
                      Read more <ExternalLink className="h-3 w-3" />
                    </span>
                  </article>
                </Reveal>
              ))}
            </div>

            {/* Launch window panel */}
            <Reveal delay={200}>
              <div className="border-accent/40 bg-card/60 mt-6 rounded-lg border p-5 backdrop-blur-md">
                <div className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase">
                  Launch Window
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-accent h-4 w-4" />
                    <span className="text-foreground">Target: 15 Apr 2026, 13:00 UTC</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-accent h-4 w-4" />
                    <span className="text-foreground">Backup: 17–22 Apr 2026</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Cloud className="text-accent h-4 w-4" />
                    <span className="text-foreground">
                      Weather: 80% favorable per 45th WS forecast
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
