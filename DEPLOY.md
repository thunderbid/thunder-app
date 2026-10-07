# THUNDER APP

Production source bridge for **thunder.bid**.

Cloudflare Pages settings:

- Framework preset: None
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

The build bootstraps the current live THUNDER site, applies the current mobile authority patch, copies the official wallet distribution, and emits no-cache headers for the homepage and wallet version manifest.
