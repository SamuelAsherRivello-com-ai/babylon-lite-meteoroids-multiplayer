# Proposal

## Why

The current 16:9 game viewport reserves most HUD and settings space inside the play area, limiting the size and readability of both. A landscape app boundary can use its width more effectively by placing the game view on the left and a persistent information and controls column on the right.

## What Changes

- Replace the single landscape game viewport presentation with a landscape app surface containing the largest usable square game view on the left and a dedicated HUD/settings column on the right.
- Move the title, room actions, team and pilot status, connection feedback, settings, version, and applicable controls into the right column while keeping game entry and failure feedback usable.
- Preserve Asteroids rules, multiplayer authority, player actions, keyboard bindings, touch actions, and the fixed logical simulation bounds; the square presentation must show the complete existing world without cropping or distorting it.
- Keep the app boundary landscape in windowed and fullscreen presentation and adapt sizing so the game and its essential controls remain usable when available space is constrained.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `pixel-game-presentation`: Replace the landscape game viewport and in-viewport HUD placement with a square game presentation beside a right-side HUD within a landscape app boundary, while preserving full-world framing and the existing gameplay contract.

## Impact

- UI composition and layout in `asteroids/src/ui/` and `asteroids/src/content/Content.jsx`.
- Canvas sizing and pixel-perfect presentation in `asteroids/src/content/game/renderer.js`; simulation and multiplayer rules remain unchanged.
- Presentation specs and layout-focused verification. No dependency, backend, release, or deployment changes are intended.
