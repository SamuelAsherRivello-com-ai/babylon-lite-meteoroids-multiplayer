# Artwork provenance

All game raster artwork is original procedural pixel art created for Asteroids Multiplayer Clone. No commercial Asteroids artwork, screenshots, fonts, or sounds were copied into these assets.

The source generator is `scripts/generate-art.py`; final PNG assets are in `asteroids/src/content/game/art/`. Run it with Python and Pillow to reproduce the artwork.

| Asset | Source dimensions | Purpose |
| --- | --- | --- |
| `sprites.png` | 2048 × 1024 | 64-pixel atlas cells containing four ship colors with 32 directional headings each, thrust variants, asteroid shapes and health palettes, projectiles, fracture frames, protection rings, and original pixel digits for player numbers |
| `starfield.png` | 640 × 360 | Fixed logical-resolution arena background |
| `gutter.png` | 512 × 512 | Subtle coordinated starfield and asteroid pattern outside the viewport |

The palette uses navy backgrounds with mint, amber, lilac, and pink player accents. Ship direction uses discrete source frames; rendering does not rotate the raster sprites arbitrarily. The arena is fixed at 640 × 360 logical pixels. Small displays may require fractional downscaling, which is a documented presentation exception rather than a change to world coordinates.

Sound effects will be synthesized from original Web Audio oscillator/noise envelopes during integration. Actual playable screenshots will be captured separately after the game exists; the source assets are not gameplay evidence.

