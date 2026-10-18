# THUNDER LABS | Open-source foundation

This feature branch introduces five user-selected free technologies:
1. Playwright 1.64.1 for real Chromium regression checks.
3. Konva 10.9.0 for drag-and-drop visual scene editing.
4. Phaser 3.90.0 for browser game prototyping.
5. Howler 2.2.4 for audio playback (audio starts on user interaction).
6. GitHub Actions for automated build, tests, and artifact upload.

## Commands
```sh
npm install
npm run build:labs
npm run dev:labs
# open http://127.0.0.1:4173/labs/scene-workshop/
npm run test:labs
```

The generated `dist-labs/labs/scene-workshop/index.html` embeds minified vendored libraries and can be opened as a single local HTML file. A separate `THIRD_PARTY_NOTICES.txt` is generated, and license notices are also embedded inside the HTML. Do not edit the generated file; edit the source HTML.

## Deployment and safety
- The existing `npm run build` and `build.js` are deliberately untouched. Current production remains unchanged.
- GitHub Actions creates a reviewable artifact. It does **not** auto-deploy or push to production.
- The existing production bridge fetches current live HTML from thunder.bid; it is not equivalent to a fully source-controlled application. Migrating the real source is a separate task.
- Library versions are pinned directly in package.json. Commit a generated package-lock.json after running npm install in an environment with npm registry access to enable npm ci.
- A browser smoke test verifies both editors and basic interactions. This is not exhaustive gameplay testing.
