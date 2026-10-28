import test from "node:test";
import assert from "node:assert/strict";
import { fitPresentationFrame } from "../src/ui/presentation.js";

test("fullscreen presentation fits 16:9 and 16:10 monitors", () => {
  for (const aspect of [16 / 9, 16 / 10]) {
    const frame = fitPresentationFrame(aspect * 800, 800);
    assert.equal(frame.width, aspect * 800);
    assert.equal(frame.height, 800);
  }
});

test("fullscreen presentation clamps ultra-wide and narrow displays", () => {
  assert.deepEqual(fitPresentationFrame(2400, 900), { width: 1600, height: 900, aspect: 16 / 9 });
  assert.deepEqual(fitPresentationFrame(1200, 1200), { width: 1200, height: 750, aspect: 16 / 10 });
});
