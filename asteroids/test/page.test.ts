import test from "node:test";
import assert from "node:assert/strict";
import config from "../../vite.config.ts";
test("production assets and app root use the actual GitHub Pages subpath", () => {
  assert.equal(config.root, "asteroids");
  assert.equal(config.base, "/babylon-lite-meteoroids-multiplayer/");
});
