/** Original short oscillators, synthesized only after a player's gesture. */
export class FlightAudio {
  unlock() {
    try {
      this.context ||= new AudioContext();
      this.context.resume();
    } catch {}
  }
  play(kind, muted) {
    if (muted || !this.context || this.context.state !== "running") return;
    const pitches = {
      shot: [700, 130],
      hit: [180, 70],
      fracture: [120, 35],
      death: [80, 20],
      wave: [330, 660],
      restart: [440, 880],
    };
    const [from, to] = pitches[kind],
      c = this.context,
      o = c.createOscillator(),
      g = c.createGain(),
      t = c.currentTime;
    o.type = kind === "wave" || kind === "restart" ? "sine" : "triangle";
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(to, t + 0.12);
    g.gain.setValueAtTime(0.045, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + 0.17);
  }
  close() {
    this.context?.close();
  }
}
