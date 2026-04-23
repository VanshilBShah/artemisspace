
# Artemis II Mission Website — Plan

A cinematic, NASA-grade website for the 2026 Artemis II crewed lunar flyby mission, featuring a real Three.js 3D scroll experience on the homepage and dedicated pages for crew, spacecraft, and mission progress.

## Site Architecture

**Hybrid structure** — immersive scrolling homepage + dedicated routes:

- `/` — **Home** — Cinematic 3D scroll experience
- `/crew` — Meet the four astronauts
- `/spacecraft` — Orion capsule + SLS rocket deep dive
- `/mission` — Mission profile, trajectory, objectives
- `/progress` — Current status, milestones, timeline to launch

Shared header with NASA-style nav and persistent starfield background. Footer with mission patch, links, and launch countdown.

## Homepage — 3D Scroll Experience

A single Three.js canvas pinned behind the page that reacts to scroll position. Each scroll section triggers a new "scene":

1. **Hero** — Earth slowly rotating, Artemis II logo fades in, animated countdown to launch
2. **Mission intro** — Camera pulls back from Earth, text appears: "First crewed lunar mission in over 50 years"
3. **The trajectory** — Animated path drawing from Earth → free-return lunar flyby → splashdown
4. **The spacecraft** — Orion capsule rotates into view, hotspots reveal modules (Crew Module, Service Module, LAS)
5. **The crew** — Four astronaut cards slide in over a Moon backdrop
6. **The Moon** — Camera arrives at Moon, lunar surface detail, mission objectives overlay
7. **CTA section** — Links to deep-dive pages, launch window info

Built with `three`, `@react-three/fiber`, `@react-three/drei`. Scroll-driven via Drei's `ScrollControls`. Multi-layer parallax starfield, subtle nebula shader, lens flares for sun.

## Crew Page (`/crew`)

Four detailed profiles: **Reid Wiseman** (Commander), **Victor Glover** (Pilot), **Christina Koch** (Mission Specialist), **Jeremy Hansen** (CSA Mission Specialist). Portrait, role, bio, mission firsts, social/agency links. Hover effects with glow and patch reveal.

## Spacecraft Page (`/spacecraft`)

Two sections — **Orion** and **SLS Block 1**. Each with a small embedded 3D model viewer, technical specs (height, thrust, crew capacity), key systems, and mission role. Annotated diagrams.

## Mission Page (`/mission`)

Mission profile: 10-day flight, free-return trajectory, ~4,600 miles past the Moon. Objectives, science goals, comparison to Apollo 8, what makes it historic. Animated trajectory diagram.

## Progress Page (`/progress`) — The "where they stand" page

Curated current status as of April 2026:

- **Launch readiness gauge** — visual % to launch with target date
- **Vertical milestone timeline** — completed (✓), in-progress (pulsing), upcoming
  - Orion crew module complete · Service module integration · Crew training milestones · SLS core stage at KSC · Stacking in VAB · Wet dress rehearsal · Launch
- **Live status cards** — Crew training hours, days to launch, integration phase
- **Recent updates feed** — curated news cards (date, headline, summary, source link)
- **Launch window panel** — target date, backup windows, weather criteria

## Visual Design — Deep Space / NASA Official

- **Palette**: deep space black `#000`, NASA navy `#0B3D91`, NASA red `#FC3D21`, off-white `#FFFFFF`, cool grey accents, cyan glow `#5BC0EB` for active states
- **Typography**: Inter or Helvetica Neue (NASA-style sans), large bold display weights for headlines, mono for technical data/countdowns
- **Imagery**: real NASA mission photography, mission patch as recurring motif
- **Motion**: smooth scroll, subtle text fade-up on intersection, glowing pulse on active timeline nodes, animated countdown ticker
- **Background**: persistent low-opacity starfield with parallax twinkle on every page

## Technical Notes

- Three.js with React Three Fiber for the 3D scenes
- Performance: lazy-load 3D assets, mobile fallback to static hero image with parallax CSS, prefers-reduced-motion respected
- Each route gets its own SEO metadata (title, description, og:image)
- All progress data lives in a typed `missionData.ts` file — easy to update later
- Fully responsive; 3D scene simplifies on small screens

After approval, I'll build it out — starting with the design system, shared layout, and the Three.js homepage, then the four sub-pages.
