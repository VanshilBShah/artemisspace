// Artemis II mission data — curated as of April 2026

import wisemanImg from "@/assets/crew-wiseman.jpg";
import gloverImg from "@/assets/crew-glover.jpg";
import kochImg from "@/assets/crew-koch.jpg";
import hansenImg from "@/assets/crew-hansen.jpg";

// Target launch: April 2026 → set a forward-looking placeholder
export const LAUNCH_DATE = new Date("2026-04-15T13:00:00Z");

export type CrewMember = {
  id: string;
  name: string;
  role: string;
  agency: "NASA" | "CSA";
  image: string;
  bio: string;
  firsts: string[];
  flights: number;
};

export const crew: CrewMember[] = [
  {
    id: "wiseman",
    name: "Reid Wiseman",
    role: "Commander",
    agency: "NASA",
    image: wisemanImg,
    bio: "Captain in the U.S. Navy and veteran of Expedition 41 aboard the ISS. Selected as Chief of the Astronaut Office before stepping down to command Artemis II.",
    firsts: ["First Artemis commander", "165 days in space prior"],
    flights: 1,
  },
  {
    id: "glover",
    name: "Victor Glover",
    role: "Pilot",
    agency: "NASA",
    image: gloverImg,
    bio: "Naval aviator and pilot of NASA's SpaceX Crew-1. Will be the first person of color to fly a lunar mission.",
    firsts: ["First person of color on a lunar mission", "Pilot of Crew-1"],
    flights: 1,
  },
  {
    id: "koch",
    name: "Christina Koch",
    role: "Mission Specialist",
    agency: "NASA",
    image: kochImg,
    bio: "Holder of the record for longest single spaceflight by a woman (328 days) and participant in the first all-female spacewalk.",
    firsts: ["First woman to fly to the Moon", "Longest single flight by a woman"],
    flights: 1,
  },
  {
    id: "hansen",
    name: "Jeremy Hansen",
    role: "Mission Specialist",
    agency: "CSA",
    image: hansenImg,
    bio: "Colonel in the Royal Canadian Air Force and CF-18 fighter pilot. Will be the first Canadian to travel beyond low-Earth orbit.",
    firsts: ["First Canadian to leave low-Earth orbit", "First non-American on a lunar mission"],
    flights: 0,
  },
];

export type Milestone = {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "complete" | "in-progress" | "upcoming";
};

export const milestones: Milestone[] = [
  {
    id: "orion-cm",
    title: "Orion Crew Module Complete",
    description:
      "Crew module assembly, fueling and integration with the European Service Module finalized at Kennedy Space Center.",
    date: "Oct 2024",
    status: "complete",
  },
  {
    id: "esm-int",
    title: "Service Module Integration",
    description:
      "ESA-built European Service Module mated to Orion. Power, propulsion and life support systems verified.",
    date: "Mar 2025",
    status: "complete",
  },
  {
    id: "crew-training",
    title: "Crew Training Milestones",
    description:
      "10,000+ hours of simulator, neutral buoyancy, and survival training completed across the four-person crew.",
    date: "Aug 2025",
    status: "complete",
  },
  {
    id: "sls-core",
    title: "SLS Core Stage at KSC",
    description:
      "Boeing-built core stage delivered from Michoud Assembly Facility to Kennedy Space Center.",
    date: "Nov 2025",
    status: "complete",
  },
  {
    id: "vab-stack",
    title: "Stacking in the VAB",
    description:
      "Solid rocket boosters, core stage and Orion stacked on Mobile Launcher 1 inside the Vehicle Assembly Building.",
    date: "Jan 2026",
    status: "complete",
  },
  {
    id: "wdr",
    title: "Wet Dress Rehearsal",
    description:
      "Full propellant load and terminal countdown demonstration at Launch Complex 39B.",
    date: "Mar 2026",
    status: "in-progress",
  },
  {
    id: "launch",
    title: "Launch",
    description:
      "Liftoff from LC-39B. 10-day free-return trajectory beyond the far side of the Moon.",
    date: "Apr 2026",
    status: "upcoming",
  },
];

export type NewsUpdate = {
  date: string;
  headline: string;
  summary: string;
  source: string;
};

export const updates: NewsUpdate[] = [
  {
    date: "Apr 12, 2026",
    headline: "Wet dress rehearsal completes terminal count to T-9.34s",
    summary:
      "Teams successfully loaded over 700,000 gallons of cryogenic propellants and proceeded to within 9 seconds of launch before standing down as planned.",
    source: "NASA",
  },
  {
    date: "Apr 02, 2026",
    headline: "Crew completes final integrated launch-day simulation",
    summary:
      "Wiseman, Glover, Koch and Hansen ran through a full launch-and-ascent profile in the Orion simulator with mission control at JSC.",
    source: "NASA",
  },
  {
    date: "Mar 18, 2026",
    headline: "Artemis II rolls to Launch Complex 39B",
    summary:
      "The 322-foot-tall integrated stack made the 4-mile journey atop the crawler-transporter in just over 9 hours.",
    source: "Kennedy Space Center",
  },
  {
    date: "Feb 28, 2026",
    headline: "Flight readiness review clears next milestone",
    summary:
      "Agency leadership approves moving from stacking operations into the wet dress rehearsal campaign.",
    source: "NASA HQ",
  },
];

export const missionFacts = {
  duration: "~10 days",
  crewSize: 4,
  flybyDistance: "~4,600 mi past the far side",
  trajectory: "Free return",
  apogee: "~230,000 mi from Earth",
  vehicleHeight: "322 ft (98 m)",
  thrust: "8.8 million lbf at liftoff",
  splashdown: "Pacific Ocean",
};
