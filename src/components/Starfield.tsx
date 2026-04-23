import { useEffect, useMemo, useRef } from "react";

type StarfieldProps = {
  density?: number;
  className?: string;
};

// Lightweight CSS starfield used as the persistent backdrop on every page.
export function Starfield({ density = 120, className = "" }: StarfieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  const stars = useMemo(() => {
    return Array.from({ length: density }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.7,
    }));
  }, [density]);

  // Subtle parallax via mouse
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-space-gradient ${className}`}
    >
      <div ref={ref} className="absolute inset-0 transition-transform duration-300 ease-out">
        {stars.map((s) => (
          <span
            key={s.id}
            className="animate-twinkle absolute rounded-full bg-foreground"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>
      {/* Nebula tint */}
      <div className="bg-nebula absolute inset-0 opacity-50" />
    </div>
  );
}
