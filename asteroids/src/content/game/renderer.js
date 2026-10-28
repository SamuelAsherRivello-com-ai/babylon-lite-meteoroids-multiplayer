import {
  createEngine,
  disposeEngine,
  loadTexture2D,
  releaseTexture,
  createGridSpriteAtlas,
  createSprite2DLayer,
  createSpriteRenderer,
  registerSpriteRenderer,
  disposeSpriteRenderer,
  disposeSpriteAtlas,
  createRenderTexture2D,
  setSpriteRendererTarget,
  renderFrame,
  resizeEngine,
} from "@babylonjs/lite";
import {
  BabylonLiteAIEntry as Entry,
  BabylonLiteMode,
} from "../babylon/pixel-grid-entry.js";
import spritesUrl from "./art/sprites.png?url";
import starsUrl from "./art/starfield-portrait.png?url";
const VIEW_WIDTH = 360;
const VIEW_HEIGHT = 640;
const projectPoint = (x, y) => [((VIEW_WIDTH - y) % VIEW_WIDTH + VIEW_WIDTH) % VIEW_WIDTH, ((x % VIEW_HEIGHT) + VIEW_HEIGHT) % VIEW_HEIGHT];
const textureOptions = {
  invertY: false,
  minFilter: "nearest",
  magFilter: "nearest",
  mipMaps: false,
  addressModeU: "clamp-to-edge",
  addressModeV: "clamp-to-edge",
};

/** Renderer-owned fixed-resolution target; gameplay sprites only use the entry API. */
export async function createArenaRenderer(
  canvas,
  getView,
  preferences,
  onReady,
  onError,
  cancelled,
) {
  let engine, raf;
  const textures = [],
    atlases = [],
    renderers = [];
  let destroyed = false;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(raf);
    for (const r of renderers) disposeSpriteRenderer(r);
    for (const t of textures) releaseTexture(t);
    if (engine) disposeEngine(engine);
  };
  try {
    if (!navigator.gpu)
      throw new Error(
        "WebGPU is unavailable. Use a current Chrome or Edge browser with hardware acceleration.",
      );
    Entry.configure({ mode: BabylonLiteMode.PixelPerfect2D });
    engine = await createEngine(canvas, { msaaSamples: 1 });
    if (cancelled()) {
      destroy();
      return () => {};
    }
    for (const url of [starsUrl, spritesUrl]) {
      textures.push(await loadTexture2D(engine, url, textureOptions));
      if (cancelled()) {
        destroy();
        return () => {};
      }
    }
    const stars = createGridSpriteAtlas(textures[0], {
      cellWidthPx: VIEW_WIDTH,
      cellHeightPx: VIEW_HEIGHT,
      columns: 1,
      rows: 1,
      pivot: [0.5, 0.5],
    });
    const atlas = createGridSpriteAtlas(textures[1], {
      cellWidthPx: 64,
      cellHeightPx: 64,
      columns: 32,
      rows: 16,
      pivot: [0.5, 0.5],
    });
    atlases.push(stars, atlas);
    const bg = createSprite2DLayer(stars),
      layer = createSprite2DLayer(atlas);
    for (const l of [bg, layer]) {
      Entry.updateView(l, { zoom: 1 });
      Entry.centerView(l, VIEW_WIDTH / 2, VIEW_HEIGHT / 2, VIEW_WIDTH, VIEW_HEIGHT);
    }
    Entry.addSprite(bg, {
      positionPx: [VIEW_WIDTH / 2, VIEW_HEIGHT / 2],
      sizePx: [VIEW_WIDTH, VIEW_HEIGHT],
      frame: 0,
    });
    const surface = Object.create(engine);
    Object.defineProperty(surface, "canvas", {
      value: { width: VIEW_WIDTH, height: VIEW_HEIGHT },
    });
    const worldRenderer = createSpriteRenderer(surface, {
      layers: [bg, layer],
      clear: true,
      clearValue: { r: 0.02, g: 0.04, b: 0.08, a: 1 },
    });
    renderers.push(worldRenderer);
    const target = createRenderTexture2D(engine, VIEW_WIDTH, VIEW_HEIGHT, textureOptions);
    textures.push(target);
    setSpriteRendererTarget(worldRenderer, target);
    registerSpriteRenderer(worldRenderer);
    const presentationAtlas = createGridSpriteAtlas(target, {
      cellWidthPx: VIEW_WIDTH,
      cellHeightPx: VIEW_HEIGHT,
      columns: 1,
      rows: 1,
      pivot: [0.5, 0.5],
    });
    atlases.push(presentationAtlas);
    const presentationLayer = createSprite2DLayer(presentationAtlas);
    const screen = Entry.addPresentationSprite(presentationLayer, {
      positionPx: [VIEW_WIDTH / 2, VIEW_HEIGHT / 2],
      sizePx: [VIEW_WIDTH, VIEW_HEIGHT],
      frame: 0,
    });
    const presenter = createSpriteRenderer(engine, {
      layers: [presentationLayer],
      clear: true,
      clearValue: { r: 0.02, g: 0.04, b: 0.08, a: 1 },
    });
    renderers.push(presenter);
    registerSpriteRenderer(presenter);
    const pool = [],
      flashes = new Map();
      let used = 0,
      previous = null,
      effects = [],
      last = performance.now();
    const draw = (frame, x, y, size) => {
      const [viewX, viewY] = projectPoint(x, y);
      for (const dx of [
        0,
        ...(viewX - size / 2 < 0 ? [VIEW_WIDTH] : []),
        ...(viewX + size / 2 > VIEW_WIDTH ? [-VIEW_WIDTH] : []),
      ])
        for (const dy of [
          0,
          ...(viewY - size / 2 < 0 ? [VIEW_HEIGHT] : []),
          ...(viewY + size / 2 > VIEW_HEIGHT ? [-VIEW_HEIGHT] : []),
        ]) {
          let sprite = pool[used];
          if (!sprite) {
            sprite = Entry.addSprite(layer, {
              positionPx: [viewX + dx, viewY + dy],
              sizePx: [size, size],
              frame,
            });
            pool.push(sprite);
          }
          Entry.update(sprite, {
            positionPx: [viewX + dx, viewY + dy],
            sizePx: [size, size],
            frame,
            visible: true,
          });
          used++;
        }
    };
    const loop = (now) => {
      if (cancelled()) return;
      try {
        resizeEngine(engine);
        const fit = Math.min(canvas.width / VIEW_WIDTH, canvas.height / VIEW_HEIGHT);
        const scale =
          canvas.clientWidth >= VIEW_WIDTH && canvas.clientHeight >= VIEW_HEIGHT
            ? Math.max(1, Math.floor(fit))
            : fit;
        const w = VIEW_WIDTH * scale,
          h = VIEW_HEIGHT * scale;
        Entry.updatePresentationSprite(screen, {
          positionPx: [
            Math.floor((canvas.width - w) / 2) + w / 2,
            Math.floor((canvas.height - h) / 2) + h / 2,
          ],
          sizePx: [w, h],
        });
        const v = getView();
        used = 0;
        if (v) {
          if (
            previous &&
            previous.runId === v.runId &&
            !preferences.current.reduced
          ) {
            const current = new Map(v.asteroids.map((a) => [a.id, a]));
            for (const a of previous.asteroids) {
              const next = current.get(a.id);
              if (!next || next.hp < a.hp)
                effects.push({ x: a.x, y: a.y, at: now });
            }
          }
          for (const a of v.asteroids)
            draw(
              256 + a.shape * 5 + Math.min(4, a.hp - 1),
              a.x,
              a.y,
              (64 * a.radius) / 22,
            );
          const numbers = new Map(v.players.map((p) => [p.id, p.number]));
          for (const b of v.bullets)
            draw(276 + (numbers.get(b.owner) || 1) - 1, b.x, b.y, 64);
          for (const p of v.players) {
            if (p.connected === false || p.lives <= 0 || p.respawn) continue;
            const n = p.number - 1,
              heading =
              ((Math.round(((Math.PI / 2 - p.angle) / (Math.PI * 2)) * 32) % 32) + 32) % 32;
            draw(n * 32 + heading + (p.input?.thrust ? 128 : 0), p.x, p.y, 64);
            if (
              p.input?.fire &&
              v.phase === "playing" &&
              !preferences.current.reduced
            ) {
              if (now - (flashes.get(p.id) || 0) > 180) flashes.set(p.id, now);
              if (now - flashes.get(p.id) < 60)
                draw(
                  276 + n,
                  p.x + Math.cos(p.angle) * 15,
                  p.y + Math.sin(p.angle) * 15,
                  64,
                );
            }
            if (p.protectedUntil > v.time) draw(296 + n, p.x, p.y, 64);
            draw(300 + n, p.x, p.y - 18, 48);
          }
          if (!preferences.current.reduced) {
            effects = effects.filter((e) => now - e.at < 320);
            for (const e of effects)
              draw(
                280 + Math.min(15, Math.floor((now - e.at) / 20)),
                e.x,
                e.y,
                64,
              );
          } else effects = [];
          previous = {
            runId: v.runId,
            asteroids: v.asteroids.map((a) => ({ ...a })),
          };
        }
        for (let i = used; i < pool.length; i++)
          Entry.update(pool[i], { visible: false });
        renderFrame(engine, Math.min(100, now - last));
        last = now;
        raf = requestAnimationFrame(loop);
      } catch (e) {
        onError(e);
        destroy();
      }
    };
    onReady();
    raf = requestAnimationFrame(loop);
    return destroy;
  } catch (e) {
    destroy();
    if (!cancelled()) onError(e);
    return () => {};
  }
}
