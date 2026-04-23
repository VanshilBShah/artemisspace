import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import patch from "@/assets/artemis-patch.png";
import { Countdown } from "./Countdown";

const nav = [
  { to: "/", label: "Home" },
  { to: "/mission", label: "Mission" },
  { to: "/spacecraft", label: "Spacecraft" },
  { to: "/crew", label: "Crew" },
  { to: "/progress", label: "Progress" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 border-border/60 border-b backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src={patch}
            alt="Artemis II mission patch"
            width={40}
            height={40}
            className="h-10 w-10 transition-transform duration-500 group-hover:rotate-12"
          />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-foreground text-sm font-bold tracking-widest">ARTEMIS II</span>
            <span className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">
              NASA · CSA · ESA
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{
                className:
                  "text-accent border-accent/60 bg-accent/5 text-glow",
              }}
              inactiveProps={{
                className:
                  "text-muted-foreground hover:text-foreground border-transparent hover:border-border/60",
              }}
              className="rounded-md border px-3 py-1.5 font-mono text-xs tracking-[0.2em] uppercase transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Countdown compact />
        </div>

        <button
          aria-label="Toggle navigation"
          className="text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="bg-background/95 border-border/60 border-t backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-accent" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="border-border/40 border-b py-3 font-mono text-sm tracking-[0.2em] uppercase last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4">
              <Countdown compact />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
