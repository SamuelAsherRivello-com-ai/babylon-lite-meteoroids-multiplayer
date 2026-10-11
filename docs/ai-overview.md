# AI overview

Canonical instructions: [AGENTS.md](../AGENTS.md), [template checklist](../AGENTS_TEMPLATE_USAGE_CHECKLIST.md), and [game architecture/maintenance](deep-dive-overview.md).

This project explicitly imports the shared skills library as required by game creation. [Provenance](source-provenance.md) records pinned source revisions and generated-skill collision decisions. Six root OpenSpec skills remain CLI-generated at 1.13.1; do not hand-edit them. Use `npx --yes @fission-ai/openspec@1.13.1` for this project; do not change global installations.

Commands are in the root package and workflows. Use `npm ci`, `npm test`, `npm run build`, and `npm run dev`. Browser tests must run headlessly by user preference. Do not start a second Vite process or disturb another project's server.
