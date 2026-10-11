[Overview](overview.md) · Standardization analysis · [Architecture analysis](architecture-analysis.md) · [Verification baseline](verification-baseline.md) · [Back](overview.md)

# Standardization

| # | Finding | Classification | Evidence / action |
| --- | --- | --- | --- |
| STND01 | Showcase modules remain outside the runtime import graph | orphan candidate, confirmed starter-only role | `BabylonPresentation`, world HUD, config, overlay, images and render-resolution helpers have no game consumers; preserve `pixel-grid-entry.js`, remove only confirmed starter scope |
| STND02 | Template-current documentation describes a showcase | confirmed stale | README and AI/deep-dive/layout guides need actual game identity, paths, commands and ownership |
| STND03 | Agent guidance lacks the game module/maintenance map | partial readiness | Add concise pointers without replacing template constraints |
| STND04 | Skills source links use six excluded duplicate directories | confirmed stale | Fix catalog links to preserved generated root skills and record collision decision |

AI readiness: instructions nailed; commands nailed (`package.json`, workflows); orientation partial; definition of done partial; maintenance relationships partial; safety boundaries nailed (existing ignore files and no client secrets). No additional ignore file recommended. Historical template archived OpenSpec material was intentionally excluded during bootstrap; game planning is retained. Imported library content is intentionally source-controlled workflow material, not an orphan solely because the runtime does not import it.
