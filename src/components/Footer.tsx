import { Link } from "@tanstack/react-router";
import patch from "@/assets/artemis-patch.png";
import { Countdown } from "./Countdown";

export function Footer() {
  return (
    <footer className="border-border/40 bg-space relative z-10 border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4">
            <img
              src={patch}
              alt="Artemis II mission patch"
              width={64}
              height={64}
              loading="lazy"
              className="h-16 w-16"
            />
            <div>
              <div className="text-foreground text-lg font-bold tracking-widest">ARTEMIS II</div>
              <div className="text-muted-foreground font-mono text-xs tracking-[0.25em] uppercase">
                Return to the Moon · 2026
              </div>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 max-w-md text-sm">
            The first crewed mission of NASA's Artemis program — sending four astronauts on a
            free-return flight beyond the far side of the Moon for the first time in more than 50
            years.
          </p>
        </div>

        <div>
          <h4 className="text-foreground font-mono text-xs tracking-[0.25em] uppercase">
            Mission
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/mission" className="text-muted-foreground hover:text-accent">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/spacecraft" className="text-muted-foreground hover:text-accent">
                Spacecraft
              </Link>
            </li>
            <li>
              <Link to="/crew" className="text-muted-foreground hover:text-accent">
                Crew
              </Link>
            </li>
            <li>
              <Link to="/progress" className="text-muted-foreground hover:text-accent">
                Progress
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground font-mono text-xs tracking-[0.25em] uppercase">
            T-Minus
          </h4>
          <div className="mt-4">
            <Countdown compact />
          </div>
          <p className="text-muted-foreground mt-3 text-xs">Launch window opens April 2026.</p>
        </div>
      </div>

      <div className="border-border/30 border-t">
        <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4 font-mono text-[10px] tracking-[0.2em] uppercase sm:flex-row sm:justify-between">
          <span>Unofficial fan tribute · Imagery & data based on public NASA releases</span>
          <span>Ad astra · Per aspera</span>
        </div>
      </div>
    </footer>
  );
}
