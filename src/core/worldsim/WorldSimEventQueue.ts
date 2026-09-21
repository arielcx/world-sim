import type {
  WorldSimCountryId,
  WorldSimCountryState,
  WorldSimSpeed,
} from "./WorldSimTypes";

export type WorldSimEventType =
  | "border_pressure"
  | "war_declared"
  | "treaty_proposed"
  | "treaty_broken"
  | "economic_crisis"
  | "approval_drop"
  | "stability_crisis"
  | "coup_risk"
  | "election_due"
  | "intelligence_discovery"
  | "resource_shortage"
  | "alliance_formed";

export interface WorldSimEvent {
  id: string;
  type: WorldSimEventType;
  countryId: WorldSimCountryId;
  targetCountryId?: WorldSimCountryId;
  tick: number;
  priority: number;
  severity: number;
  message: string;
  factors: Record<string, number | string | boolean>;
  speed?: WorldSimSpeed;
}

export class WorldSimEventQueue {
  private events: WorldSimEvent[] = [];

  enqueue(
    event: Omit<WorldSimEvent, "id"> & { id?: string },
  ): WorldSimEvent {
    const created: WorldSimEvent = {
      id: event.id ?? `worldsim-event-${this.events.length}-${Date.now()}`,
      type: event.type,
      countryId: event.countryId,
      targetCountryId: event.targetCountryId,
      tick: event.tick,
      priority: event.priority,
      severity: event.severity,
      message: event.message,
      factors: { ...event.factors },
      speed: event.speed,
    };

    this.events.push(created);
    this.events.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      if (a.tick !== b.tick) return a.tick - b.tick;
      return a.id.localeCompare(b.id);
    });
    return created;
  }

  dequeue(): WorldSimEvent | null {
    return this.events.shift() ?? null;
  }

  drain(limit = Number.POSITIVE_INFINITY): WorldSimEvent[] {
    const items = this.events.splice(0, Math.max(0, Math.floor(limit)));
    this.events.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      if (a.tick !== b.tick) return a.tick - b.tick;
      return a.id.localeCompare(b.id);
    });
    return items;
  }

  size(): number {
    return this.events.length;
  }

  queuedForCountry(countryId: WorldSimCountryId): WorldSimEvent[] {
    return this.events.filter((event) => event.countryId === countryId);
  }

  clear(): void {
    this.events.length = 0;
  }

  peek(): WorldSimEvent | null {
    return this.events[0] ?? null;
  }
}

export interface WorldSimAgentPrompt {
  country: WorldSimCountryState;
  tick: number;
  event?: WorldSimEvent;
  worldStateSummary: string;
}

export const WORLD_SIM_EVENT_SEVERITY = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
} as const;
