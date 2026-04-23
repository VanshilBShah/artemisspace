import { useEffect, useState } from "react";
import { LAUNCH_DATE } from "@/data/missionData";

function getParts(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { d, h, m, s };
}

type Props = { compact?: boolean };

export function Countdown({ compact = false }: Props) {
  const [parts, setParts] = useState(() => getParts(LAUNCH_DATE));

  useEffect(() => {
    const id = setInterval(() => setParts(getParts(LAUNCH_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  const cells: Array<[number, string]> = [
    [parts.d, "DAYS"],
    [parts.h, "HRS"],
    [parts.m, "MIN"],
    [parts.s, "SEC"],
  ];

  if (compact) {
    return (
      <span className="text-accent font-mono text-xs tracking-widest uppercase">
        T-{String(parts.d).padStart(3, "0")}:{String(parts.h).padStart(2, "0")}:
        {String(parts.m).padStart(2, "0")}:{String(parts.s).padStart(2, "0")}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3 sm:gap-6">
      {cells.map(([val, label]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-foreground font-mono text-3xl font-bold tabular-nums sm:text-5xl">
            {String(val).padStart(2, "0")}
          </span>
          <span className="text-muted-foreground mt-1 font-mono text-[10px] tracking-[0.2em] sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
