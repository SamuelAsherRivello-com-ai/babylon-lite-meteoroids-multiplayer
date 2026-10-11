import { connectAsteroids } from "@rmc/multiplayer-client/asteroids-connection";
import {
  createWorld,
  setConnected,
  applyInput,
  stepWorld,
  snapshot,
  predictShip,
  TUNING,
  delta,
  wrap,
} from "@rmc/multiplayer-client/asteroids";
import { Controls, decode, interpolate } from "./presentation.js";
export const ENDPOINT =
  import.meta.env?.VITE_ASTEROIDS_ENDPOINT ||
  "https://rmc-asteroids-coop.vercel.app";
const neutral = { turn: 0, thrust: false, fire: false };

/** Only the creator instantiates a simulation; guests predict their own motion. */
export class GameSession {
  controls = new Controls();
  listeners = new Set();
  connection = null;
  world = null;
  frame = null;
  history = [];
  frames = [];
  predicted = null;
  correction = { x: 0, y: 0 };
  presence = null;
  state = {
    status: "Choose a room",
    connected: false,
    connecting: false,
    frame: null,
    presence: null,
  };
  blocked = false;
  disposed = false;
  attempt = 0;
  sequence = Date.now() * 1000;
  steps = 0;
  last = performance.now();
  subscribe = (f) => {
    this.listeners.add(f);
    return () => this.listeners.delete(f);
  };
  getSnapshot = () => this.state;
  notify(patch = {}) {
    this.state = {
      ...this.state,
      ...patch,
      frame: this.frame,
      presence: this.presence,
    };
    for (const f of this.listeners) f();
  }
  async start(create, code) {
    clearInterval(this.timer);
    this.connection?.leave();
    this.connection = null;
    this.world = null;
    this.frame = null;
    this.frames = [];
    this.history = [];
    this.presence = null;
    this.predicted = null;
    this.accumulator = 0;
    const attempt = ++this.attempt;
    const active = () => !this.disposed && this.attempt === attempt;
    let deadline;
    this.notify({
      connecting: true,
      status: create ? "Opening your flight room…" : "Joining flight room…",
    });
    try {
      if (create)
        this.world = createWorld(crypto.getRandomValues(new Uint32Array(1))[0]);
      const pending = connectAsteroids({
        endpoint: ENDPOINT,
        create,
        code,
        onPresence: (p) => {
          if (!active()) return;
          this.presence = p;
          if (this.world) {
            for (const v of this.world.players)
              setConnected(this.world, v.id, false, v.number);
            for (const v of p.players)
              setConnected(this.world, v.id, true, v.number);
          }
          this.notify();
        },
        onInput: (i) => {
          if (active() && this.world) applyInput(this.world, i.id, i);
        },
        onState: (f) => {
          if (active() && !this.world) this.receive(f);
        },
        onStatus: (s) => {
          if (active()) this.notify({ status: String(s) });
        },
        onEnded: (r) => {
          if (active()) this.end(String(r || "Session ended"));
        },
      });
      pending.then(
        (c) => {
          if (!active()) c.leave();
        },
        () => {},
      );
      const c = await Promise.race([
        pending,
        new Promise((_, reject) => {
          deadline = setTimeout(() => {
            this.attempt++;
            reject(new Error("Room connection timed out. Try again."));
          }, 25000);
        }),
      ]);
      if (!active()) {
        await c.leave();
        return;
      }
      this.connection = c;
      this.last = performance.now();
      this.received = this.last;
      this.notify({
        connecting: false,
        connected: true,
        status: "Connected",
        code: c.code,
        host: c.host,
        id: c.id,
      });
      this.timer = setInterval(() => this.pump(), 1000 / 60);
      if (import.meta.env?.DEV) window.__asteroids = this;
    } catch (e) {
      this.world = null;
      this.notify({ connecting: false, connected: false, status: e.message });
    } finally {
      clearTimeout(deadline);
    }
  }
  receive(raw) {
    if (this.disposed) return;
    const f = decode(raw),
      now = performance.now(),
      old = this.frame;
    if (old && f.tick <= old.tick && f.runId === old.runId) return;
    this.received = now;
    this.frame = f;
    this.frames.push({ f, at: now });
    while (this.frames.length > 8) this.frames.shift();
    const me = f.players.find((p) => p.id === this.connection?.id);
    if (me) {
      const reset =
        !old ||
        old.runId !== f.runId ||
        !this.predicted ||
        me.lives !== this.predicted.lives ||
        me.respawn !== this.predicted.respawn;
      if (reset) {
        this.history = [];
        this.controls.clear();
      }
      this.history = this.history.filter((h) => h.seq > me.ack);
      const next = { ...me };
      if (me.lives > 0 && !me.respawn && f.phase === "playing")
        for (const h of this.history) predictShip(next, h.input, TUNING.tick);
      this.correction = reset
        ? { x: 0, y: 0 }
        : {
            x: delta(next.x, this.predicted.x, 640),
            y: delta(next.y, this.predicted.y, 360),
          };
      this.predicted = next;
    }
    this.notify({ status: "Connected" });
  }
  pump() {
    if (!this.connection || !this.state.connected) return;
    const now = performance.now(),
      elapsed = (now - this.last) / 1000;
    this.last = now;
    if (elapsed > 0.5) {
      this.controls.clear();
      this.accumulator = 0;
      this.notify({ status: "Host clock resumed" });
    }
    this.accumulator = (this.accumulator || 0) + Math.min(0.1, elapsed);
    while (this.accumulator >= TUNING.tick) {
      this.accumulator -= TUNING.tick;
      this.tick();
    }
    if (!this.world && now - this.received > 2000)
      this.notify({ status: "Waiting for host — keep the host tab active" });
  }
  tick() {
    const c = this.connection,
      f = this.world || this.frame;
    if (!f) return;
    const me = f.players.find((p) => p.id === c.id);
    const input =
      this.blocked || me?.lives === 0 ? neutral : this.controls.read();
    const seq = ++this.sequence;
    if (this.world) {
      applyInput(this.world, c.id, { ...input, seq, runId: f.runId });
      const oldRun = f.runId;
      stepWorld(this.world);
      if (oldRun !== f.runId) this.controls.clear();
      this.frame = decode(snapshot(this.world, this.presence?.serial || 0));
    } else if (
      this.predicted?.lives > 0 &&
      !this.predicted.respawn &&
      f.phase !== "defeat"
    ) {
      predictShip(this.predicted, input, TUNING.tick);
      // Acknowledgements identify each sent interval's final tick, so replay only later ticks.
      this.history.push({ seq, input });
      if (this.history.length > 120) this.history.shift();
    }
    if (++this.steps % 3 === 0) {
      try {
        if (this.world)
          c.publish(snapshot(this.world, this.presence?.serial || 0));
        else c.input({ ...input, seq, runId: f.runId });
      } catch (e) {
        this.end(e.message);
      }
      this.notify();
    }
    this.correction.x *= 0.82;
    this.correction.y *= 0.82;
  }
  view() {
    if (this.world) return this.world;
    if (!this.frame) return null;
    const target = performance.now() - 100;
    let a = this.frames[0],
      b = this.frames.at(-1);
    for (let i = 1; i < this.frames.length; i++)
      if (this.frames[i].at >= target) {
        a = this.frames[i - 1];
        b = this.frames[i];
        break;
      }
    const view = interpolate(
      a?.f,
      b.f,
      Math.max(0, Math.min(1, (target - a.at) / Math.max(1, b.at - a.at))),
    );
    return {
      ...view,
      players: view.players.map((p) =>
        p.id === this.connection?.id && this.predicted
          ? {
              ...this.predicted,
              input: this.blocked ? neutral : this.controls.read(),
              x: wrap(this.predicted.x + this.correction.x, 640),
              y: wrap(this.predicted.y + this.correction.y, 360),
            }
          : p,
      ),
    };
  }
  setBlocked(value) {
    this.blocked = value;
    if (value) this.controls.clear();
  }
  end(reason) {
    this.attempt++;
    clearInterval(this.timer);
    this.controls.clear();
    this.connection?.leave();
    this.notify({ connected: false, connecting: false, status: reason });
  }
  dispose() {
    this.disposed = true;
    this.end(this.connection ? "You left the room" : "Choose a room");
    this.connection = null;
    this.world = null;
    this.frame = null;
    this.frames = [];
    this.history = [];
    this.predicted = null;
    this.presence = null;
    this.accumulator = 0;
  }
}
