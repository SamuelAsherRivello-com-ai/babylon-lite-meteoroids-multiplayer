import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { useContentShell } from "../shared/ContentShellContext.jsx";
import { GameSession } from "./game/session.js";
import { createArenaRenderer } from "./game/renderer.js";
import { FlightAudio } from "./game/audio.js";
import { COLORS } from "./game/presentation.js";
const Preferences = createContext(null);
const forcedMute = new URLSearchParams(location.search).get("mute") === "true";
export function GamePreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    try {
      return {
        mute: false,
        reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
        touch: matchMedia("(pointer: coarse)").matches,
        ...JSON.parse(localStorage.getItem("asteroids-preferences") || "{}"),
      };
    } catch {
      return { mute: false, reduced: false, touch: false };
    }
  });
  const update = (key, value) =>
    setPrefs((p) => {
      const next = { ...p, [key]: value };
      try {
        localStorage.setItem("asteroids-preferences", JSON.stringify(next));
      } catch {}
      return next;
    });
  return (
    <Preferences.Provider
      value={{ prefs: { ...prefs, mute: forcedMute || prefs.mute }, update }}
    >
      {children}
    </Preferences.Provider>
  );
}
export function GameSettings() {
  const { prefs, update } = useContext(Preferences);
  return (
    <>
      {[
        ["mute", "Mute sound"],
        ["reduced", "Reduce visual effects"],
        ["touch", "Show touch controls"],
      ].map(([key, label]) => (
        <label key={key}>
          <input
            type="checkbox"
            checked={prefs[key]}
            disabled={key === "mute" && forcedMute}
            onChange={(e) => update(key, e.target.checked)}
          />{" "}
          {label}
        </label>
      ))}
    </>
  );
}
const keyActions = {
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
  KeyW: "thrust",
  ArrowUp: "thrust",
  Space: "fire",
};
export function Content() {
  const [session] = useState(() => new GameSession()),
    state = useSyncExternalStore(session.subscribe, session.getSnapshot);
  const { prefs } = useContext(Preferences),
    prefsRef = useRef(prefs);
  prefsRef.current = prefs;
  const { paused, panelTarget } = useContentShell();
  const canvas = useRef(null),
    [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [code, setCode] = useState(
      () =>
        new URLSearchParams(location.search).get("room")?.toUpperCase() || "",
    ),
    [copied, setCopied] = useState(false);
  const [audio] = useState(() => new FlightAudio());
  useEffect(() => {
    session.setBlocked(paused);
  }, [paused, session]);
  useEffect(() => {
    let cancelled = false,
      cleanup = () => {};
    queueMicrotask(async () => {
      if (cancelled) return;
      cleanup = await createArenaRenderer(
        canvas.current,
        () => session.view(),
        prefsRef,
        () => setReady(true),
        (e) => {
          setError(e.message);
          session.dispose();
        },
        () => cancelled,
      );
      if (cancelled) cleanup();
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [session]);
  useEffect(() => {
    const down = (e) => {
      const a = keyActions[e.code];
      if (
        !a ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.target.closest("input,textarea,button,select,[contenteditable]") ||
        paused ||
        !state.connected
      )
        return;
      e.preventDefault();
      if (!e.repeat) session.controls.set(e.code, a, true);
      audio.unlock();
    };
    const up = (e) => {
      if (keyActions[e.code]) {
        session.controls.set(e.code, keyActions[e.code], false);
        if (state.connected) e.preventDefault();
      }
    };
    const clear = () => session.controls.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, [session, audio, paused, state.connected]);
  useEffect(
    () => () => {
      session.dispose();
      audio.close();
    },
    [session, audio],
  );
  // StrictMode replays effects before any user connection exists.
  useEffect(() => {
    session.disposed = false;
  }, [session]);
  const previous = useRef(null);
  useEffect(() => {
    const f = state.frame,
      old = previous.current;
    if (f && old) {
      const muted = prefsRef.current.mute;
      if (f.runId !== old.runId) audio.play("restart", muted);
      else if (f.wave !== old.wave) audio.play("wave", muted);
      else if (
        f.players.some(
          (p) => p.lives < (old.players.find((q) => q.id === p.id)?.lives || 0),
        )
      )
        audio.play("death", muted);
      else if (
        old.asteroids.some((a) => !f.asteroids.some((b) => b.id === a.id))
      )
        audio.play("fracture", muted);
      else if (
        old.asteroids.some((a) =>
          f.asteroids.some((b) => b.id === a.id && b.hp < a.hp),
        )
      )
        audio.play("hit", muted);
      else if (
        f.bullets.some(
          (b) =>
            !old.bullets.some((a) => a.id === b.id) && b.owner === state.id,
        )
      )
        audio.play("shot", muted);
    }
    previous.current = f;
  }, [state.frame, audio, state.id]);
  const start = (create) => {
    audio.unlock();
    session.disposed = false;
    session.start(create, create ? undefined : code.trim().toUpperCase());
  };
  const copy = async () => {
    const url = new URL(location.href);
    url.search = "";
    url.searchParams.set("room", state.code);
    try {
      await navigator.clipboard.writeText(url.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  const f = state.frame,
    me = f?.players.find((p) => p.id === state.id),
    countdown = f ? Math.max(0, Math.ceil(f.until - f.time)) : 0;
  const touch = (action, label) => (
    <button
      key={action}
      className="touch_button"
      aria-label={label}
      data-action={action}
      onPointerDown={(e) => {
        if (paused || !state.connected) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        session.controls.set(`pointer:${e.pointerId}`, action, true);
        audio.unlock();
        e.currentTarget.dataset.pressed = "true";
      }}
      onPointerUp={(e) => {
        session.controls.set(`pointer:${e.pointerId}`, action, false);
        delete e.currentTarget.dataset.pressed;
      }}
      onPointerCancel={(e) => {
        session.controls.set(`pointer:${e.pointerId}`, action, false);
        delete e.currentTarget.dataset.pressed;
      }}
      onLostPointerCapture={(e) => {
        session.controls.set(`pointer:${e.pointerId}`, action, false);
        delete e.currentTarget.dataset.pressed;
      }}
    >
      {label}
    </button>
  );
  return (
    <>
      <main className="flight">
      <canvas
        className="arena"
        ref={canvas}
        aria-label="Asteroids cooperative wrapping arena"
      />
      </main>
      {panelTarget &&
        createPortal(
          <div className="game_panel_content">
      {(!state.connected || error) && (
        <section className="entry panel" aria-label="Flight room">
          <h1>
            SHARE THE
            <br />
            <em>EMPTY SPACE.</em>
          </h1>
          <p>
            Break the rocks. Save your three lives.
            <br />
            Stay together through the next wave.
          </p>
          <div className="entry_actions">
            <button
              className="primary"
              disabled={!ready || state.connecting || Boolean(error)}
              onClick={() => start(true)}
            >
              Host a flight
            </button>
            <span className="or">or join a friend</span>
            <div className="join">
              <input
                aria-label="Room code"
                placeholder="ROOM CODE"
                value={code}
                maxLength={4}
                onChange={(e) =>
                  setCode(
                    e.target.value.replace(/[^a-z0-9]/gi, "").toUpperCase(),
                  )
                }
              />
              <button
                disabled={
                  !ready ||
                  state.connecting ||
                  code.length !== 4 ||
                  Boolean(error)
                }
                onClick={() => start(false)}
              >
                Join →
              </button>
            </div>
          </div>
          <p className="status" role="status">
            {error || (!ready ? "Starting WebGPU…" : state.status)}
          </p>
          <p className="instructions">
            A D / ← → rotate · W / ↑ thrust · SPACE fire
            <br />
            Guests can join or leave during any wave.
            <br />
            The host keeps the room alive. Keep the host tab active.
          </p>
        </section>
      )}
      {state.connected && f && (
        <>
          <section className="flight_hud" aria-label="Flight status">
            <div>
              <span className="eyebrow">SECTOR</span>
              <strong> {String(f.wave).padStart(2, "0")}</strong>
              <span className="rocks">
                {f.asteroids.length} rocks left ·{" "}
                {f.players.reduce((total, p) => total + p.score, 0)} team pts
              </span>
            </div>
            <div className="room">
              <span>
                ROOM <b>{state.code}</b>
              </span>
              <button onClick={copy}>{copied ? "Copied!" : "Invite ↗"}</button>
              <button onClick={() => session.dispose()}>
                {state.host ? "End flight" : "Leave"}
              </button>
            </div>
          </section>
          <div className="roster" aria-label="Pilot status">
            {f.players.map((p) => (
              <div
                key={p.id}
                style={{ "--pilot": COLORS[p.number - 1] }}
                className={p.id === state.id ? "pilot local" : "pilot"}
              >
                <b>
                  {p.number} {p.id === state.id ? "YOU" : `PILOT ${p.number}`}
                  {p.id === state.presence?.hostId ? " · HOST" : ""}
                </b>
                <span>
                  {p.lives > 0
                    ? "♥".repeat(p.lives) + "·".repeat(3 - p.lives)
                    : "SPECTATING"}
                </span>
                <small>
                  {p.score} PTS{p.respawn > f.time ? " · RESPAWNING" : ""}
                </small>
              </div>
            ))}
          </div>
          {(f.phase === "defeat" ||
            f.phase === "intermission" ||
            me?.lives === 0) && (
            <div className="wave_notice panel" role="status">
              <b>
                {f.phase === "defeat"
                  ? "FLIGHT OVER"
                  : f.phase === "intermission"
                    ? "SECTOR CLEARED"
                    : "SPECTATING"}
              </b>
              <span>
                {f.phase === "defeat"
                  ? `Everyone returns to wave 1 in ${countdown}`
                  : f.phase === "intermission"
                    ? `Next wave in ${countdown}`
                    : "Your teammates are still flying. You return next flight."}
              </span>
            </div>
          )}
          <div
            className="connection_notice"
            data-state={state.status}
            role="status"
          >
            CONNECTION · {state.status}
          </div>
          {prefs.touch && (
            <div className="touch_controls">
              <div>
                {touch("left", "↶")}
                {touch("right", "↷")}
                {touch("thrust", "THRUST")}
              </div>
              {touch("fire", "FIRE")}
            </div>
          )}
          {!prefs.touch && (
            <div className="keyboard_hint">
              ← → ROTATE &nbsp; ↑ THRUST &nbsp; SPACE FIRE
            </div>
          )}
        </>
      )}
          </div>,
          panelTarget,
        )}
    </>
  );
}
