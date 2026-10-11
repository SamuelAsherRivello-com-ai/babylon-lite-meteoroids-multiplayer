import test from "node:test";
import assert from "node:assert/strict";
import { defaultLayout, fitViewport } from "../src/ui/layout.js";
import {
  BabylonLiteAIEntry as Entry,
  BabylonLiteMode,
} from "../src/content/babylon/pixel-grid-entry.js";
import { createGridSpriteAtlas, createSprite2DLayer } from "@babylonjs/lite";

test("fixed landscape framing remains complete at desktop, narrow mobile, and zoomed sizes", () => {
  for (const [w, h] of [
    [1920, 1080],
    [844, 390],
    [390, 844],
    [640, 360],
    [500, 280],
  ]) {
    const r = fitViewport(w, h, defaultLayout);
    assert.ok(r.width <= w && r.height <= h + 0.001);
    assert.ok(Math.abs(r.width / r.height - 640 / 360) < 0.001);
  }
});
test("entry snaps projected anchors while preserving fractional simulation positions", () => {
  Entry.configure({ mode: BabylonLiteMode.PixelPerfect2D });
  const atlas = createGridSpriteAtlas(
    { width: 64, height: 64 },
    { cellWidthPx: 64, cellHeightPx: 64 },
  );
  const layer = createSprite2DLayer(atlas);
  Entry.centerView(layer, 320, 180, 640, 360);
  const sprite = Entry.addSprite(layer, {
    positionPx: [123.45, 234.56],
    sizePx: [64, 64],
    frame: 0,
  });
  assert.deepEqual(Entry.getSimulationPosition(sprite), [123.45, 234.56]);
  const result = Entry.move(sprite, [639.8, 0.2]);
  assert.deepEqual(result.renderPositionPx, [640, 0]);
  assert.deepEqual(result.simulationPosition, [639.8, 0.2]);
});
