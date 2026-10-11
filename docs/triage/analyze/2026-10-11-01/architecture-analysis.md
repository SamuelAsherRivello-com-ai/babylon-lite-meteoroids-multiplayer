[Overview](overview.md) · [Standardization analysis](standardization-analysis.md) · Architecture analysis · [Verification baseline](verification-baseline.md) · [Back](overview.md)

# Architecture

`main.jsx` composes React shell and game. `Content.jsx` owns entry, settings, keyboard/touch adapters and roster. `session.js` owns one connection, host clock or guest prediction/history. `presentation.js` owns pure snapshot decoding/wrapped interpolation/input aggregation. `renderer.js` owns WebGPU resources; `audio.js` owns gesture-unlocked effects. The pinned shared package owns rules and transport; browser secrets remain inside its connection adapter.

| # | Candidate | Value / risk / owner |
| --- | --- | --- |
| ARCH01 | Inject session clock/transport in future | Better lifecycle unit substitution; moderate refactor risk; defer to Rearchitect after real evolution warrants it |
| ARCH02 | Separate touch/UI composition if controls grow | Improves local readability; small present value and churn risk; deferred Rearchitect, no new layers now |

No dependency cycle observed among authored modules. World state has one owner (creator); snapshots are read-only guest outcomes. Guests never invoke `createWorld` or `stepWorld`. UI dialogs release local controls without stopping the host timer. Pure interpolation and input source tests cover meaningful seams; independent browser verification covers transport/lifecycle. These findings do not imply exhaustive verification of every WebGPU device or browser scheduling policy.
