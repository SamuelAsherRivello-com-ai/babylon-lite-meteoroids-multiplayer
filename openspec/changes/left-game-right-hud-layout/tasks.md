# Tasks

## 1. Landscape app composition

- [x] 1.1 Rework the app surface into a left square game region and right HUD region sized from the available landscape boundary; verify with layout-focused checks that resizing and fullscreen never overlap the regions.
- [x] 1.2 Move title, version, settings, room entry/actions, flight status, roster, connection feedback, and enabled touch controls into the right panel; verify UI checks cover entry, active flight, settings, and simultaneous touch actions.
- [x] 1.3 Update the relevant layout/integration documentation and player-facing README or screenshots; verify the docs describe the new panel placement and retained landscape app boundary.

## 2. Square game presentation

- [x] 2.1 Fit the complete 640×360 logical world into the square game region without crop, stretch, or simulation-bound changes; verify renderer checks cover full-world framing, pixel alignment, resize, zoom, and DPR changes.
- [x] 2.2 Verify existing keyboard, touch, room lifecycle, host authority, and spectator behavior remain unchanged using the relevant project checks.

## 3. Integration and review

- [x] 3.1 Run the production build and required headless checks; verify they pass before opening the user preview.
- [x] 3.2 Start exactly one Vite preview, verify the game view and right-side HUD in windowed and fullscreen layouts, and present that preview for user review.
- [x] 3.3 Stop after presenting the preview and wait for explicit user approval; do not merge or commit before that approval.
