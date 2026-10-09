# arseia-coop

This repo serves two jobs:

1. **Deployed release** (repo root): `game.html`, `server.js`, `package.json`, `audio/`, `app/`, `img/`. Render redeploys the co-op server from `main` on every push. Do not edit, move or rename these files; the owner's release process replaces them.
2. **Game source for co-development**: `source/`. Before any work, read `source/AI-작업-원칙.md` (the owner's design rules, history, mobile notes and work process) and `source/함께-개발-안내.md` (build and #qa commands).

Rules in short:
- Never push to `main`. Work on a branch and open a pull request describing what changed and the #qa result.
- Change only files under `source/`.
- Never add code that removes, clears or empty-overwrites localStorage character keys (`arseia-char-0`..`7`, `arseia-apprentice-save-v1`). New save fields default when missing.
- Before a PR: build passes (`BUILD_OK`), full #qa passes, every attack spell hits (t11A), zero console errors. Every fixed bug gets a new permanent test in `source/v5/qa.js`.
- Reply to the user in Korean, in plain words (the owner and collaborators are not developers).
