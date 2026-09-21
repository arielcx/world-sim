import { describe, expect, it } from "vitest";
import { createWorldSimAction, validateWorldSimAction } from "../src/core/worldsim/WorldSimAction";
import { WorldSimEventQueue } from "../src/core/worldsim/WorldSimEventQueue";

describe("WorldSimEventQueue", () => {
  it("prioritizes higher-priority events first", () => {
    const queue = new WorldSimEventQueue();

    queue.enqueue({
      type: "border_pressure",
      countryId: "aurora",
      tick: 10,
      priority: 1,
      severity: 1,
      message: "low priority",
      factors: { threat: 0.4 },
    });
    queue.enqueue({
      type: "war_declared",
      countryId: "brass",
      tick: 11,
      priority: 5,
      severity: 4,
      message: "war declared",
      factors: { mobilization: 1 },
    });

    expect(queue.peek()?.type).toBe("war_declared");
    expect(queue.dequeue()?.message).toBe("war declared");
    expect(queue.size()).toBe(1);
  });

  it("supports draining a bounded number of queued events", () => {
    const queue = new WorldSimEventQueue();

    queue.enqueue({
      type: "approval_drop",
      countryId: "cinder",
      tick: 5,
      priority: 2,
      severity: 2,
      message: "approval falling",
      factors: { approval: -5 },
    });
    queue.enqueue({
      type: "resource_shortage",
      countryId: "cinder",
      tick: 6,
      priority: 3,
      severity: 3,
      message: "resource shortage",
      factors: { treasury: -12 },
    });

    expect(queue.drain(1)).toHaveLength(1);
    expect(queue.size()).toBe(1);
  });
});

describe("WorldSimAction validation", () => {
  it("accepts a well-formed action with strict scoring", () => {
    const action = createWorldSimAction(
      "aurora",
      "allocate_budget",
      { treasury: 80, priority: "defense" },
      { stability: 0.85, threat: 0.4 },
      "brass",
      0.82,
    );

    expect(validateWorldSimAction(action)).toBe(true);
  });

  it("rejects invalid action types and malformed IDs", () => {
    expect(
      validateWorldSimAction({
        id: "",
        actorCountryId: "",
        type: "not_a_real_action",
        confidence: 0.9,
        params: {},
        rationale: {},
      }),
    ).toBe(false);
  });
});
