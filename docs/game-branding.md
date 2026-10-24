# Meteoroids branding

![Meteoroids logo with mint and amber ships flying between fractured blue rocks](images/game-logo.png)

Official name: **Meteoroids**.

## Art direction

Icy block lettering, mint and amber triangular ships, and fractured slate-blue space rocks on a dark starfield.

The existing docs/screenshots/public-desktop.png gameplay capture and asteroids/src/content/game/renderer.js establish triangular ships, blue-gray rocks and the dark starfield. The screenshot was viewed for visual context only. The final image was generated from a text prompt without supplying, cropping, tracing or compositing a screenshot.

## Asset and usage

- File: `docs/images/game-logo.png`.
- Purpose: README splash illustration and game-directory thumbnail.
- Generation: built-in OpenAI image generation through the existing Codex session. No API key, separately billed API or external image service was used.
- Format: opaque PNG, 1536 by 1024 pixels.
- Keep the complete title visible when displaying or resizing the image. The official name excludes "Multiplayer"; multiplayer capability remains documented separately in the README.

## Final generation prompt

```text
Use case: logo-brand. Create a completely original landscape 3:2 arcade splash illustration from scratch. Exact and only text: "Meteoroids", spelled M-e-t-e-o-r-o-i-d-s. Huge readable custom block pixel lettering in icy pale blue with mint highlights dominates the upper middle, with generous safe margins for thumbnail readability. Below it, a sleek small triangular mint spacecraft and an amber companion bank between large fractured slate-blue space rocks, their pale steel polygon outlines and fissures catching the light. Sparse tiny star points against very dark midnight navy. Pixel-art promotional illustration with crisp pixel edges and restrained limited colors; exciting diagonal thrust trails, chunky original rock silhouettes, great graphic clarity at 240px wide. Inspired by the actual game's blue-gray polygonal meteoroids, tiny triangular mint/amber ships and dark starfield. Entirely new composition, no screenshot or gameplay screen, no HUD, no photorealism, no borrowed franchise art, no watermark, no other lettering and never Multiplayer. Opaque background.
```
