import { delta, wrap } from "@rmc/multiplayer-client/asteroids";
export const COLORS = ["#7af4d3", "#ffbd76", "#a8a0ff", "#ff89a9"];
export function decode(f) {
  return {
    ...f,
    players: f.players.map((p) => ({
      id: p[0],
      number: p[1],
      lives: p[2],
      score: p[3],
      x: p[4],
      y: p[5],
      vx: p[6],
      vy: p[7],
      angle: p[8],
      respawn: p[9],
      protectedUntil: p[10],
      ack: p[11],
    })),
    asteroids: f.asteroids.map((a) => ({
      id: a[0],
      x: a[1],
      y: a[2],
      vx: a[3],
      vy: a[4],
      radius: a[5],
      hp: a[6],
      maxHp: a[7],
      depth: a[8],
      shape: a[9],
    })),
    bullets: f.bullets.map((b) => ({
      id: b[0],
      owner: b[1],
      x: b[2],
      y: b[3],
      vx: b[4],
      vy: b[5],
      until: b[6],
    })),
  };
}
export function blendEntity(a, b, t) {
  if (!a) return b;
  return {
    ...b,
    x: wrap(a.x + delta(a.x, b.x, 640) * t, 640),
    y: wrap(a.y + delta(a.y, b.y, 360) * t, 360),
    ...(b.angle === undefined
      ? {}
      : { angle: a.angle + delta(a.angle, b.angle, Math.PI * 2) * t }),
  };
}
export function interpolate(a, b, t) {
  if (!a || a.runId !== b.runId) return b;
  return {
    ...b,
    ...Object.fromEntries(
      ["players", "asteroids", "bullets"].map((key) => {
        const old = new Map(a[key].map((v) => [v.id, v]));
        return [key, b[key].map((v) => blendEntity(old.get(v.id), v, t))];
      }),
    ),
  };
}
export class Controls {
  sources = new Map();
  set(source, action, pressed) {
    if (pressed) this.sources.set(source, action);
    else this.sources.delete(source);
  }
  clear() {
    this.sources.clear();
  }
  read() {
    const s = new Set(this.sources.values());
    return {
      turn: Number(s.has("right")) - Number(s.has("left")),
      thrust: s.has("thrust"),
      fire: s.has("fire"),
    };
  }
}
