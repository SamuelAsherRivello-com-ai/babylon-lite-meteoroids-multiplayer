[Overview](overview.md) · [Standardization analysis](standardization-analysis.md) · [Architecture analysis](architecture-analysis.md) · Verification baseline · [Back](overview.md)

# Final verification baseline

| # | Check | Source / scope | Verified result |
| --- | --- | --- | --- |
| VERI01 | `npm test` | Root manifest; eight pure/layout/package tests | Eight pass on required Node 24 locally and final release CI |
| VERI02 | `npm run build` | Vite/Pages subpath | Passed locally and in Release/Pages CI |
| VERI03 | Four independent headless Edge contexts | Actual client and public relay | Join/drop, keyboard move/fire, settings continuity and guest refresh identity passed |
| VERI04 | Delayed WebSocket + CDP touch | Browser transition harness | 150 ms RTT ±50 ms jitter; turn/thrust/fire together and cancellation pass |
| VERI05 | Natural wave + explicit lifecycle fixtures | Browser transition harness | Natural wave two; collision/spectator/5-second replay and terminal host loss pass; fixture distinction documented |
| VERI06 | Fullscreen / unavailable GPU / DPR | Independent headless contexts | Fullscreen and neutral controls; unsupported message/disabled launch; DPR 1/2 backing resize pass |
| VERI07 | Public release | Release 38112234658 / Pages 38112273340 | v0.1.1: 600-second public test with two renewals/client, waves 1–8 and natural replay. v0.1.2: final targeted public controls/team HUD/wave-two/synchronization check passes with zero errors |
| VERI08 | Dependency advisory | `npm audit --omit=dev` | Zero vulnerabilities after compatible source-map-js update |

See [durable gameplay evidence](../../../verification.md) for final continuity results. Physical touch hardware, native browser UI zoom and exhaustive WebGPU coverage remain unverified. No runtime, dependency, generated-build, secret or browser-log contents excluded by repository boundaries were used as triage evidence. Recommended future sequence: focused pure tests → build → proportionate headless scenario → public release verification when runtime changes.


