# Landscape app and pixel rendering

BrowserSurface keeps a landscape app boundary with the square game view on the left and a right-side HUD/settings panel. The square view grows to the largest size allowed by the window and the panel; the HUD remains scrollable when its contents exceed the available height. In fullscreen, both regions retain the same side-by-side composition.

Babylon Lite 1.32.0 uses WebGPU only. The game initializes the template PixelPerfect2D entry API, snaps sprite anchors after the layer view, and retains fractional simulation coordinates. Direction is selected from 32 original ship frames. A fixed 640 × 360 nearest-sampled render target preserves logical world bounds and gameplay framing. Its 16:9 image is centered inside the square game view with aspect ratio intact; the existing starfield fills the surrounding square presentation area. Presentation uses integer physical scaling where space permits and fractional fitting on smaller screens. This small-screen exception cannot guarantee equal physical pixel widths.

The right panel contains room entry/actions, wave and team status, pilot roster, connection feedback, settings, version, and enabled touch controls. Keyboard actions remain bound to the game session. Touch actions continue to use independent control sources so rotation, thrust, and fire remain concurrent.

The renderer-owned surface view supplies logical projection dimensions; only the presenter uses the actual canvas backing size. Game sprites use `addSprite`, `update`, `updateView` and `centerView`. Renderer-owned presentation sprite helpers are confined to renderer infrastructure. Resource disposal is idempotent and external atlas textures have one owner.

Unsupported WebGPU or graphics initialization errors show a room-entry error and prevent launch. No fallback renderer is provided. Settings release local input while the creator's timer continues. Browsers may suspend inactive tabs; keep the host active, and guests display a host-wait message during stalls.
