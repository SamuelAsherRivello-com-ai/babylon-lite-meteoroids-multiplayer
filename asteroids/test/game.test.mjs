import test from "node:test";
import assert from "node:assert/strict";
import { GameSession } from "../src/content/game/session.js";
import {
  Controls,
  blendEntity,
  interpolate,
  decode,
} from "../src/content/game/presentation.js";
import {
  createWorld,
  setConnected,
  snapshot,
  hitAsteroid,
  stepWorld,
} from "@rmc/multiplayer-client/asteroids";

test("wrap interpolation crosses the seam instead of the arena", () => {
  const v = blendEntity(
    { x: 638, y: 359, angle: 6.2 },
    { x: 2, y: 1, angle: 0.1 },
    0.5,
  );
  assert.equal(v.x, 0);
  assert.equal(v.y, 0);
  assert.ok(v.angle > 6.2);
});
test("new runs and removed entities do not inherit stale visuals", () => {
  const a = {
    runId: 1,
    players: [],
    asteroids: [{ id: 1, x: 300, y: 100 }],
    bullets: [],
  };
  const b = {
    runId: 1,
    players: [],
    asteroids: [{ id: 2, x: 5, y: 5 }],
    bullets: [],
  };
  assert.deepEqual(interpolate(a, b, 0.5), b);
  assert.equal(interpolate(a, { ...b, runId: 2 }, 0.5).runId, 2);
});
test("concurrent keyboard and touch release only their own source; cancel clears all", () => {
  const c = new Controls();
  c.set("keyboard", "thrust", true);
  c.set("finger1", "thrust", true);
  c.set("finger2", "right", true);
  c.set("finger3", "fire", true);
  c.set("finger1", "thrust", false);
  assert.deepEqual(c.read(), { turn: 1, thrust: true, fire: true });
  c.set("keyboard", "thrust", false);
  assert.equal(c.read().thrust, false);
  c.clear();
  assert.deepEqual(c.read(), { turn: 0, thrust: false, fire: false });
});
test("the pinned release supplies exact wave one, then resets all connected pilots", () => {
  const w = createWorld(55);
  for (let i = 1; i <= 4; i++) setConnected(w, "pilot" + i, true, i);
  let hits = 0;
  while (w.asteroids.length) {
    const a = w.asteroids[0];
    hitAsteroid(w, a.id);
    hits++;
  }
  assert.equal(hits, 9);
  assert.equal(decode(snapshot(w, 4)).players.length, 4);
  stepWorld(w);
  assert.equal(w.phase, "intermission");
  for (const p of w.players) p.lives = 0;
  stepWorld(w);
  assert.equal(w.phase, "defeat");
  for (let i = 0; i < 301; i++) stepWorld(w);
  assert.equal(w.runId, 2);
  assert.equal(w.wave, 1);
  assert.ok(w.players.every((p) => p.lives === 3 && p.score === 0));
});

test("guest receiver rejects old-run frames even with a newer tick and accepts the next run", () => {
  const session = new GameSession(),
    frame = snapshot(createWorld(42), 1);
  session.receive({ ...frame, runId: 2, tick: 100 });
  session.receive({ ...frame, runId: 1, tick: 999 });
  assert.equal(session.frame.runId, 2);
  assert.equal(session.frame.tick, 100);
  session.receive({ ...frame, runId: 2, tick: 99 });
  assert.equal(session.frame.tick, 100);
  session.receive({ ...frame, runId: 3, tick: 101 });
  assert.equal(session.frame.runId, 3);
});
