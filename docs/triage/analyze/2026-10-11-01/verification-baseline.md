[Overview](overview.md) · [Standardization analysis](standardization-analysis.md) · [Architecture analysis](architecture-analysis.md) · Verification baseline · [Back](overview.md)

# Verification baseline

| # | Check | Source / scope | Actual evidence |
| --- | --- | --- | --- |
| VERI01 | `npm test` | Manifest, seven meaningful pure/layout/package contract tests | Passed seven tests on system Node 26; Node 24 CI verification pending |
| VERI02 | `npm run build` | Vite, production Pages path | Passed; build is not gameplay proof |
| VERI03 | Four independent Edge contexts | Real client/public Vercel backend | Passed joins, keyboard move/fire, settings continued host ticks, guest refresh identity and drop; screenshot captured |
| VERI04 | Public backend release gates | Shared server Release v0.9.12 | 154 tests; staged 600 seconds, four renewals, stable probe; game-client long-run is distinct |
| VERI05 | Touch, latency, spectator/reset | Headless gameplay transition harness | In progress; physical touch hardware unverified |

Recommended sequence after conformity changes: local links and module import scan, seven tests, production build, headless regression; release CI runs Node 24 and public gameplay must be checked separately.
