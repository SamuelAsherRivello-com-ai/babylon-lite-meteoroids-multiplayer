# Landscape and pixel rendering

The template BrowserSurface fits one landscape 16:9 viewport with independent gutters. Orientation overrides and template showcase shortcuts were removed. All primary game UI stays inside the viewport and fullscreen.

Babylon Lite 1.32.0 uses WebGPU only. The game initializes the template PixelPerfect2D entry API, snaps sprite anchors after the layer view, and retains fractional simulation coordinates. Direction is selected from 32 original ship frames. A fixed 640 × 360 nearest-sampled render target preserves world framing through resizing, browser zoom and DPR changes. Presentation uses integer physical scaling on viewports at least 640 × 360 CSS pixels; smaller screens use fractional fitting to keep the whole arena readable. This small-screen exception cannot guarantee equal physical pixel widths.

The renderer-owned surface view supplies logical projection dimensions; only the presenter uses the actual canvas backing size. Game sprites use `addSprite`, `update`, `updateView` and `centerView`. Renderer-owned presentation sprite helpers are confined to renderer infrastructure. Resource disposal is idempotent and external atlas textures have one owner.

Unsupported WebGPU or graphics initialization errors show a room-entry error and prevent launch. No fallback renderer is provided. Settings release local input while the creator's timer continues. Browsers may suspend inactive tabs; keep the host active, and guests display a host-wait message during stalls.
