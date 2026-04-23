import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { crew } from "@/data/missionData";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/crew")({
  head: () => ({
    meta: [
      { title: "Crew — Artemis II" },
      {
        name: "description",
        content:
          "Meet the four astronauts of Artemis II: Reid Wiseman, Victor Glover, Christina Koch and Jeremy Hansen.",
      },
      { property: "og:title", content: "Crew — Artemis II" },
      {
        property: "og:description",
        content: "The four humans flying NASA's first crewed lunar mission in over 50 years.",
      },
    ],
  }),
  component: CrewPage,
});

function CrewPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-20">
        <Reveal>
          <p className="text-accent font-mono text-xs tracking-[0.4em] uppercase">The Crew</p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">
            Four humans. One Moon.
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Three NASA astronauts and one Canadian Space Agency mission specialist will fly the
            first crewed Artemis mission. Together they bring decades of flight experience, polar
            research, and military aviation.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {crew.map((c, i) => (
            <Reveal key={c.id} delay={i * 100}>
              <article className="group border-border/60 bg-card/60 hover:border-accent/60 hover:shadow-glow relative overflow-hidden rounded-lg border backdrop-blur-md transition-all duration-500">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={c.image}
                    alt={`${c.name}, ${c.role}`}
                    width={768}
                    height={960}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="from-card via-card/30 absolute inset-0 bg-gradient-to-t to-transparent" />
                  <Badge className="bg-primary/80 text-primary-foreground absolute top-3 right-3 backdrop-blur">
                    {c.agency}
                  </Badge>
                </div>
                <div className="p-5">
                  <p className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase">
                    {c.role}
                  </p>
                  <h2 className="mt-2 text-xl font-bold">{c.name}</h2>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{c.bio}</p>
                  <ul className="mt-4 space-y-1.5">
                    {c.firsts.map((f) => (
                      <li
                        key={f}
                        className="text-foreground flex items-start gap-2 font-mono text-xs"
                      >
                        <span className="text-accent">▸</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="border-border/40 mt-4 flex items-center justify-between border-t pt-3 font-mono text-[10px] tracking-widest uppercase">
                    <span className="text-muted-foreground">Spaceflights</span>
                    <span className="text-foreground">{c.flights}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </Layout>
  );
}
