# Design

## Context

See `proposal.md` for motivation. The current BrowserSurface fits one 16:9 viewport; `Content.jsx` renders room state, roster, connection feedback, and touch controls inside that viewport. The Babylon renderer and shared Asteroids rules use a fixed 640×360 logical world, so a square presentation must preserve the complete world and its geometry.

## Goals / Non-Goals

**Goals:**

- Compose a landscape app surface with a square game presentation on the left and a right-side game panel.
- Make the square presentation as large as the app boundary and panel allocation permit without overlap.
- Keep authoritative simulation bounds, rendering pixel policy, gameplay rules, and control actions stable.

**Non-Goals:**

- Change host authority, multiplayer protocol, asteroid rules, world wrapping, player movement, or room lifecycle.
- Add a portrait app boundary or change deployment, dependencies, or backend services.

## Decisions

- Use the existing BrowserSurface as the full landscape app boundary and compose the game view and panel as adjacent regions. Derive the square view size from available boundary height and width after reserving the panel and spacing; center the combined composition when extra space remains.
- Keep the Babylon logical render target and shared 640×360 world unchanged. Fit the entire landscape world inside the square view with its aspect ratio preserved, using the surrounding square area as presentation background. Do not crop, stretch, or simulate extra world space to fill the square.
- Move React-owned title, room entry/actions, wave and team data, pilot roster, connection messages, settings, version, and touch actions to the right-side panel. Keep keyboard actions on the game session and route touch actions through the same existing independent control sources.
- Make both regions resize from the app boundary and retain their layout in fullscreen. When space is limited, scale the square view down to preserve the full world and keep the panel within the boundary; the panel may scroll its contents rather than overlap the game.
- Considered keeping the 16:9 game viewport and moving only the HUD outside it. That would leave the requested square left game area unused and preserve the current space imbalance, so the selected design uses a square presentation surface with the original playfield fitted inside.

## Risks / Trade-offs

- [The 16:9 playfield occupies only part of the square presentation surface] → Keep the complete playfield centered, extend its existing background through the unused area, and verify no gameplay pixels are cropped.
- [A right-side panel can become cramped in a narrow window] → Compute the game view from remaining space, keep panel content accessible by scrolling, and verify windowed and fullscreen layouts.
- [Moving touch controls changes their screen position] → Preserve the existing pointer capture and independent action handling, and check simultaneous rotate, thrust, and fire use.

## Migration Plan

1. Recompose the app boundary and move the current React UI into the right-side panel.
2. Connect panel state and controls to the existing game session without changing simulation contracts.
3. Size the Babylon canvas to the square game view while preserving its fixed logical world framing.
4. Verify layout, full-world framing, and existing input behavior, then start exactly one Vite preview for user review.
5. Stop for the user's explicit approval before any merge or commit; do not include deployment in this change.

Rollback is a source change revert; no persistent data or backend migration is introduced.
