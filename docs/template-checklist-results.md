# Template checklist results

Each numbered item corresponds in order to the source [template usage checklist](../AGENTS_TEMPLATE_USAGE_CHECKLIST.md). Verified means the applicable requirement was reviewed and satisfied; conditional paths are explicitly classified. Public delivery evidence is recorded separately.

| Item | Requirement (first line) | Outcome | Evidence / exception |
| --- | --- | --- | --- |
| 1.1 | Identify the reuse mode: new GitHub repository, local project copy, or | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 1.2 | Confirm or discover the project's purpose, target platforms, selected | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 1.3 | Decide whether the resulting project is a **game** or an **app**. For a | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 1.4 | Choose **portrait** or **landscape** for the app or game concept before | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 1.5 | For a game, replace the Babylon showcase with the requested game; do not | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 1.6 | Keep primary game content in the viewport so it works in windowed and | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 1.7 | Game audio is optional and music is not recommended. If sound is | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 1.8 | For GitHub creation, use GitHub's **Use this template** flow when the user | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 1.9 | If repository settings or access prevent the selected workflow, continue | **not applicable** | Authenticated template creation and Pages access worked. |
| 1.10 | Decide whether optional AI skills belong in the resulting project. Skills | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 1.11 | Consider these possible sources for optional skills: | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 1.12 | Have humans choose and install only the relevant skill using their AI | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 2.1 | For a new repository, initialize fresh history with exactly one initial | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 2.2 | For GitHub creation, verify `origin` points to the new project repository | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 2.3 | Before project-specific implementation, rename the copied `project-name/` | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 2.4 | Rename the README H1 (`# {project-name}`) and replace introduction, | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 2.5 | In the README's **Original AI Prompt** section, replace | **unverified** | Original text and follow-ups preserved; no source share URL was available, so the placeholder is explicitly retained. |
| 2.6 | When the destination is on GitHub and settings are accessible, set its | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 2.7 | For GitHub repositories, set the About website URL to | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 2.8 | Remove or replace template images, demo links, commands, packages, and | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 2.9 | Configure CI or deployment only when required and after the target and | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 2.10 | Keep baseline package configuration at the repository root and | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 2.11 | Preserve or deliberately adapt the four HTML corner roles in `AGENTS.md`. | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 3.1 | Add only the runtime, package manager, and dependencies required by the | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 3.2 | Document actual setup, run, test, build, and formatting commands in the | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 3.3 | Update `.gitignore` for generated outputs, local state, and secrets. Keep | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 3.4 | Add a safe `.env.example` only if configuration is required; include no | **not applicable** | No configuration file is required; an optional credential-free build variable is documented. Existing .aiignore excludes .env files. |
| 3.5 | Add focused automated checks when appropriate to the chosen stack and | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 3.6 | For user-visible work, verify the rendered result in its real runtime or | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 3.7 | Document manual verification when it is necessary and cannot be | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 4.1 | Generate repository-local `.agents/skills/openspec-*` files in the | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 4.2 | Verify `openspec --version` reports `1.13.1`. If missing or different, | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 4.3 | Run `openspec doctor --json` from the repository root. Confirm | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 4.4 | Reopen Codex at the resulting repository root and verify `$openspec-*` | **unverified** | CLI 1.13.1 generation and doctor are verified; app restart/autocomplete UI was not inspected. |
| 4.5 | Replace neutral `openspec/config.yaml` context with verified project | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 4.6 | Keep `changes/` for active work and `specs/` for accepted specifications. | **verified** | All five accepted specs validated and the completed game change archived on 2026-10-11. |
| 5.1 | Search for `project-name`, including paths in configuration and ignore | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 5.2 | Run each applicable, documented local setup, test, build, and formatting | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 5.3 | Verify README links, screenshots, commands, packages, deployment | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 5.4 | Verify the README's Original AI Prompt link points to the earliest | **unverified** | Original text and follow-ups preserved; no source share URL was available, so the placeholder is explicitly retained. |
| 5.5 | For GitHub destinations, verify About metadata and website URL when | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 5.6 | Report each checklist item using one of these outcomes: **verified**, | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 5.7 | Call the project ready only when all applicable local checks pass and | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 6.1 | Is the project purpose reflected in a renamed app folder instead of | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 6.2 | Does the Vite configuration point to the resulting app folder? | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 6.3 | Have the project-name, owner, and repository placeholders been replaced | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 6.4 | Does the README describe the actual project rather than the generic | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 6.5 | Are setup, run, test, and build instructions based on commands that | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 6.6 | Have template demo links, images, packages, and release instructions | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 6.7 | Does the app preserve or deliberately adapt the four HTML corner roles | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 6.8 | Does the project document and implement exactly one selected orientation | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 6.9 | If the game includes sound, does it provide a UI mute toggle and a URL | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 6.10 | Are React UI shortcuts kept clear of WASD, the arrow keys, Spacebar, and | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 6.11 | Does `.gitignore` cover the resulting project's generated files and | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |
| 6.12 | Are applicable checks and user-visible behavior verified, with any | **verified** | Source, runtime, documentation and delivery checks recorded in docs/verification.md and docs/source-provenance.md. |

Template-use scorecard: all twelve section-six answers are true (12/12), subject to the clearly disclosed source-share URL, Codex autocomplete UI and physical-device limitations. Those limitations do not imply unverified public gameplay.

