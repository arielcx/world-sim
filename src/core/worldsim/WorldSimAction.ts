export type WorldSimActionType =
  | "propose_treaty"
  | "accept_treaty"
  | "reject_treaty"
  | "declare_war"
  | "offer_peace"
  | "mobilize"
  | "demobilize"
  | "allocate_budget"
  | "invest_infrastructure"
  | "launch_intelligence_operation"
  | "appoint_official"
  | "call_election"
  | "suppress_unrest"
  | "attempt_coup"
  | "change_government";

export interface WorldSimAction {
  id: string;
  actorCountryId: string;
  type: WorldSimActionType;
  targetCountryId?: string;
  params: Record<string, number | string | boolean>;
  rationale: Record<string, number | string | boolean>;
  confidence: number;
}

export const VALID_WORLD_SIM_ACTION_TYPES: ReadonlySet<WorldSimActionType> =
  new Set([
    "propose_treaty",
    "accept_treaty",
    "reject_treaty",
    "declare_war",
    "offer_peace",
    "mobilize",
    "demobilize",
    "allocate_budget",
    "invest_infrastructure",
    "launch_intelligence_operation",
    "appoint_official",
    "call_election",
    "suppress_unrest",
    "attempt_coup",
    "change_government",
  ]);

export function validateWorldSimAction(
  candidate: Partial<WorldSimAction>,
): candidate is WorldSimAction {
  if (
    typeof candidate.id !== "string" ||
    candidate.id.length === 0 ||
    typeof candidate.actorCountryId !== "string" ||
    candidate.actorCountryId.length === 0 ||
    typeof candidate.type !== "string" ||
    !VALID_WORLD_SIM_ACTION_TYPES.has(candidate.type as WorldSimActionType) ||
    !Number.isFinite(candidate.confidence) ||
    candidate.confidence < 0 ||
    candidate.confidence > 1
  ) {
    return false;
  }

  if (
    candidate.targetCountryId !== undefined &&
    (typeof candidate.targetCountryId !== "string" ||
      candidate.targetCountryId.length === 0)
  ) {
    return false;
  }

  if (candidate.params == null || typeof candidate.params !== "object") {
    return false;
  }

  if (candidate.rationale == null || typeof candidate.rationale !== "object") {
    return false;
  }

  return true;
}

export function createWorldSimAction(
  actorCountryId: string,
  type: WorldSimActionType,
  params: Record<string, number | string | boolean> = {},
  rationale: Record<string, number | string | boolean> = {},
  targetCountryId?: string,
  confidence = 0.5,
): WorldSimAction {
  return {
    id: `worldsim-action-${actorCountryId}-${type}-${Math.random().toString(16).slice(2)}`,
    actorCountryId,
    type,
    targetCountryId,
    params,
    rationale,
    confidence: Math.max(0, Math.min(1, confidence)),
  };
}
