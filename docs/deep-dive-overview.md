# Game architecture and maintenance

The fixed 640 × 360 world belongs to the creator's browser. Vercel Hobby relays input and complete frames through the shared server's isolated Asteroids transport; its first-party private Blob registry and Runtime Cache preserve membership across planned socket renewals. No paid or third-party Redis service is used.

| Module | Owner and contract |
| --- | --- |
| `asteroids/src/main.jsx` | React composition |
| `asteroids/src/ui/` | BrowserSurface landscape/gutters, four corner roles, local settings dialog |
| `asteroids/src/content/Content.jsx` | Room UI, keyboard/pointer adapters, roster and feedback |
| `asteroids/src/content/game/session.js` | Creator fixed-step clock, guest motion prediction/reconciliation, connection lifecycle |
| `asteroids/src/content/game/presentation.js` | Pure decode, wrap interpolation and independent control sources |
| `asteroids/src/content/game/renderer.js` | Babylon Lite WebGPU resources and fixed target presentation |
| `asteroids/src/content/game/audio.js` | Original gesture-unlocked event sounds |
| Released `@rmc/multiplayer-client` | Browser-safe rules, input validation, wave/lives ledger and transport |

Dependency direction: composition → adapters → released rules/connection or pure presentation. Rendering reads simulation snapshots; it never owns gameplay time. Guests never simulate health, collisions, lives, scores or wave advancement.

Update the backend rules/tests/release first when changing the contract, then update the exact tarball pin, lockfile, integration evidence and gameplay tests together. Keep artwork generator, atlas frame mapping and provenance synchronized. Changes to Vite base or app paths require production build/Pages checks. Changes to input or lifecycle require real independent browser clients, including spectator/reset and refresh tests. Update README/screenshots when player-facing behavior changes.

Definition of done: meaningful unit checks, Node 24 CI, production build, independent browser gameplay, strict OpenSpec validation, released tag, public Pages gameplay/version verification, and clean scoped Git synchronization. Physical mobile hardware and suspended-browser scheduling remain explicitly limited.

No client secret belongs in source, URLs, screenshots or diagnostics. Private recovery bearers remain in browser-tab session storage. Generated output/dependencies/machine settings are excluded by the existing ignore boundaries. Preserve shared-backend changes from other projects; commit only scoped files on main.
