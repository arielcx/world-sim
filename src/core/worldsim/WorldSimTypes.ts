export type WorldSimCountryId = string;
export type WorldSimDate = {
  year: number;
  month: number;
  day: number;
};

export const WORLD_SIM_SPEEDS = [
  "paused",
  "0.5x",
  "1x",
  "2x",
  "5x",
  "10x",
  "50x",
] as const;

export type WorldSimSpeed = (typeof WORLD_SIM_SPEEDS)[number];

export enum WorldSimGovernmentType {
  Democracy = "democracy",
  Authoritarian = "authoritarian",
  Monarchy = "monarchy",
  Technocracy = "technocracy",
  MilitaryJunta = "military_junta",
  RevolutionaryCouncil = "revolutionary_council",
}

export interface WorldSimCountryState {
  id: WorldSimCountryId;
  name: string;
  headOfState: string;
  governmentType: WorldSimGovernmentType;
  stability: number;
  approval: number;
  treasury: number;
  economicOutput: number;
  militaryReadiness: number;
  intelligence: number;
  population: number;
  legitimacy: number;
  threatLevel: number;
}

export interface WorldSimRelationship {
  sourceId: WorldSimCountryId;
  targetId: WorldSimCountryId;
  score: number;
  tradeVolume: number;
  militaryTension: number;
  lastUpdatedTick: number;
}

export interface WorldSimWorldState {
  date: WorldSimDate;
  tick: number;
  paused: boolean;
  speed: WorldSimSpeed;
  countries: WorldSimCountryState[];
  relationships: WorldSimRelationship[];
}

export interface WorldSimConfig {
  maxCountries: number;
  worldSeed: number;
  fictionalDisclaimer: string;
  defaultSpeed: WorldSimSpeed;
  observerModeEnabled: boolean;
  enableByok: boolean;
  enablePlatformCredits: boolean;
  eventCooldownTicks: number;
}

export const WORLD_SIM_DEFAULT_CONFIG: WorldSimConfig = {
  maxCountries: 193,
  worldSeed: 2027,
  fictionalDisclaimer:
    "Fictional AI-generated geopolitics simulation. Not a real-world forecast.",
  defaultSpeed: "1x",
  observerModeEnabled: true,
  enableByok: true,
  enablePlatformCredits: true,
  eventCooldownTicks: 12,
};

export const WORLD_SIM_DEFAULT_WORLD_STATE: WorldSimWorldState = {
  date: { year: 2027, month: 1, day: 1 },
  tick: 0,
  paused: false,
  speed: "1x",
  countries: [
    {
      id: "aurora",
      name: "Aurora",
      headOfState: "Prime Minister Liora Voss",
      governmentType: WorldSimGovernmentType.Democracy,
      stability: 72,
      approval: 68,
      treasury: 320,
      economicOutput: 90,
      militaryReadiness: 61,
      intelligence: 74,
      population: 42_000_000,
      legitimacy: 78,
      threatLevel: 31,
    },
    {
      id: "brass",
      name: "Brass",
      headOfState: "Marshal Rhen Dax",
      governmentType: WorldSimGovernmentType.MilitaryJunta,
      stability: 58,
      approval: 49,
      treasury: 280,
      economicOutput: 66,
      militaryReadiness: 87,
      intelligence: 58,
      population: 35_000_000,
      legitimacy: 51,
      threatLevel: 73,
    },
    {
      id: "cinder",
      name: "Cinder",
      headOfState: "Chancellor Mirel Okon",
      governmentType: WorldSimGovernmentType.Technocracy,
      stability: 77,
      approval: 71,
      treasury: 390,
      economicOutput: 81,
      militaryReadiness: 68,
      intelligence: 92,
      population: 50_000_000,
      legitimacy: 82,
      threatLevel: 42,
    },
  ],
  relationships: [
    {
      sourceId: "aurora",
      targetId: "brass",
      score: 18,
      tradeVolume: 120,
      militaryTension: 24,
      lastUpdatedTick: 0,
    },
    {
      sourceId: "aurora",
      targetId: "cinder",
      score: 32,
      tradeVolume: 140,
      militaryTension: 18,
      lastUpdatedTick: 0,
    },
    {
      sourceId: "brass",
      targetId: "cinder",
      score: -12,
      tradeVolume: 74,
      militaryTension: 63,
      lastUpdatedTick: 0,
    },
  ],
};

export function clampWorldSimScore(score: number): number {
  return Math.max(-100, Math.min(100, score));
}

export function normalizeWorldSimCountry(
  country: Partial<WorldSimCountryState>,
  fallback: WorldSimCountryState,
): WorldSimCountryState {
  return {
    ...fallback,
    ...country,
    stability: clampWorldSimScore(country.stability ?? fallback.stability),
    approval: clampWorldSimScore(country.approval ?? fallback.approval),
    militaryReadiness: clampWorldSimScore(
      country.militaryReadiness ?? fallback.militaryReadiness,
    ),
    intelligence: clampWorldSimScore(country.intelligence ?? fallback.intelligence),
    legitimacy: clampWorldSimScore(country.legitimacy ?? fallback.legitimacy),
    threatLevel: clampWorldSimScore(country.threatLevel ?? fallback.threatLevel),
  };
}
