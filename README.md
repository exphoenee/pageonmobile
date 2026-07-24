# Page on Mobile

A small, dependency-free widget that renders website screenshots into device
mockups (desktop, notebook, tablet, phone) on a `<canvas>` and auto-scrolls
each screenshot to preview how a page looks across devices.

**🌐 Live demo:** https://exphoenee.github.io/pageonmobile/

- **TypeScript**, ships as an **ESM** package with type declarations.
- **Zero runtime dependencies** — plain DOM + Canvas 2D.
- Widget payload ~7 kB JS + 2 kB CSS; device frames are WebP (~250 kB total).

## Install

```bash
npm install pageonmobile
```

## Usage (as a package)

```ts
import { Preview } from 'pageonmobile';
import 'pageonmobile/style.css';

const preview = new Preview({
  containerId: 'myPreview', // id of an existing element on the page
  direction: 'right', // 'left' | 'right' | 'none'
  scrollSpeed: 300, // pixels per second (frame-rate independent)
  deviceFolder: '/device-frames/', // where the frame images are hosted (see below)
  screenImage: {
    desktop: '/shots/home.webp', // YOUR screenshots — any URL
    notebook: '/shots/home.webp',
    tablet: '/shots/home-tablet.webp',
    phone: '/shots/home-mobile.webp',
  },
});

// Runtime control
preview.pause(); // pause all devices
preview.setScreenshot('/shots/pricing.webp', 'phone');
preview.destroy(); // stop the rAF loop + remove DOM/listeners
```

```html
<div id="myPreview" style="width: 900px; aspect-ratio: 16/15"></div>
```

Only the devices you list in `screenImage` are rendered; the layout adapts to
the present subset via CSS (`data-devices` on the collection element).

### Device frames

The package ships the four **WebP** device frames in
`node_modules/pageonmobile/media/device/`. They must be reachable by a URL at
runtime, and `deviceFolder` must point at that URL (default `media/device/`):

- **Static hosting** — copy them into your public folder and set
  `deviceFolder` to that path:
  ```bash
  cp node_modules/pageonmobile/media/device/*.webp public/device-frames/
  ```
- **Bundlers (Vite/webpack)** — import them so the bundler emits hashed URLs,
  or reference `pageonmobile/media/device/phone-bk.webp` via the package
  `exports`.

The screenshots in `screenImage` are entirely yours — provide any image URLs
(WebP recommended for size).

## Develop locally

```bash
npm install
npm run dev        # Vite dev server with HMR (demo page)
npm run build      # typecheck + build the demo to dist/ (GitHub Pages)
npm run build:lib  # build the publishable package to lib/ (+ .d.ts)
npm run preview    # serve the built demo
npm run lint
npm run format
```

Deployed to **GitHub Pages** at `exphoenee.github.io/pageonmobile/` via
`.github/workflows/deploy.yml` (Vite `base` is `/pageonmobile/`).

## Project layout

```
src/
├── index.ts                 # package entry — public API + widget CSS
├── main.ts                  # demo page entry / wiring (not shipped)
├── core/
│   ├── Preview.ts           # orchestrates the device stack; lifecycle + public API
│   ├── Device.ts            # one device: DOM, canvas, image loading, drawing, events
│   └── ScrollAnimator.ts    # requestAnimationFrame, delta-time ping-pong scroll
├── config/
│   └── devices.config.ts    # single source of truth for frames + screen cut-outs
├── types/
│   └── index.ts             # shared types / the public options contract
└── styles/
    ├── preview.css          # widget styles (shipped as pageonmobile/style.css)
    └── style.css            # demo page chrome (imports preview.css)
media/device/*.webp          # device frames (shipped in the package)
lib/                          # built package output (npm run build:lib)
dist/                         # built demo app (npm run build → GitHub Pages)
```

## Notes on the rewrite

Replaces the original single-file vanilla-JS `Preview` class. Fixed along the
way: `|| true` options that could never be disabled, animation starting before
images loaded, leaked `setInterval` timers (now a single disposable rAF loop),
a broken `changeImage`, and never-triggering hover slow-down. Device layout
moved from JS string concatenation into CSS.

## Publishing to npm

The package builds to `lib/` and ships only `lib/` + the WebP frames (see the
`files` field). Declarations and the library bundle are produced automatically
by the `prepublishOnly` hook, so you never build by hand.

> **`npm publish` does not bump the version.** npm refuses to overwrite an
> already-published version (`E403`), so each release needs a new version
> number. Use the `release` scripts below to bump + publish in one step.

**First publish** (version `1.0.0`, name still free — no bump needed):

```bash
npm login                     # once; opens a browser for npmjs.com
npm publish --dry-run         # preview the tarball (nothing uploaded)
npm publish --access public
```

**Every release after that** — auto-bumps, publishes and pushes the git tag:

```bash
npm run release          # patch: 1.0.0 -> 1.0.1
npm run release:minor    # minor: 1.0.1 -> 1.1.0
npm run release:major    # major: 1.1.0 -> 2.0.0
```

Each `release` script runs `npm version <type>` (bumps `package.json`, commits
and creates a git tag), then `npm publish --access public`, then
`git push --follow-tags`.

Notes:

- `npm version` **requires a clean git working tree** — commit your changes
  first, then run a `release` script.
- If `pageonmobile` is ever taken by someone else, publish under a scope you
  own: set `"name": "@exphoenee/pageonmobile"` (scoped packages still need
  `--access public` to be free/public).
- `prepublishOnly` runs `npm run build:lib`; verify `npm publish --dry-run`
  lists `lib/*` and `media/device/*-bk.webp` and nothing else.
- If 2FA is on your npm account, add `--otp=<code>` to the publish command.

## License

[MIT](./LICENSE.md) © exphoenee
