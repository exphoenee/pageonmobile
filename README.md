# Page on Mobile

A small, dependency-free widget that renders website screenshots into device
mockups (desktop, notebook, tablet, phone) on a `<canvas>` and auto-scrolls
each screenshot to preview how a page looks across devices.

**🌐 Live demo:** https://exphoenee.github.io/pageonmobile/

## Stack

- **TypeScript** + **Vite** (dev server, build)
- **ESLint** + **Prettier**
- No runtime dependencies — the widget is plain DOM + Canvas 2D.
- Deployed to **GitHub Pages** at `exphoenee.github.io/pageonmobile/`
  (Vite `base` is set to `/pageonmobile/` for that sub-path).

## Getting started

```bash
npm install
npm run dev        # Vite dev server with HMR
npm run build      # typecheck + production build to dist/
npm run preview    # serve the built output
npm run lint
npm run format
```

## Usage

```ts
import { Preview } from './src/core/Preview';

const preview = new Preview({
  containerId: 'myPreview',        // id of an existing element
  direction: 'right',              // 'left' | 'right' | 'none'
  scrollSpeed: 300,                // pixels per second (frame-rate independent)
  screenImage: {
    desktop: 'media/onscreen/bvcv.jpg',
    notebook: 'media/onscreen/bvcv.jpg',
    tablet: 'media/onscreen/bvcv-tablet.png',
    phone: 'media/onscreen/bvcv-mobile.png',
  },
});

// Runtime control
preview.pause();                   // pause all devices
preview.setScreenshot('media/onscreen/ktzs.png', 'phone');
preview.destroy();                 // stop rAF loops + remove DOM/listeners
```

Only the devices you list in `screenImage` are rendered; the layout adapts to
the present subset via CSS (`data-devices` on the collection element).

## Project layout

```
src/
├── main.ts                  # demo entry point / wiring
├── core/
│   ├── Preview.ts           # orchestrates the device stack; lifecycle + public API
│   ├── Device.ts            # one device: DOM, canvas, image loading, drawing, events
│   └── ScrollAnimator.ts    # requestAnimationFrame, delta-time ping-pong scroll
├── config/
│   └── devices.config.ts    # single source of truth for frames + screen cut-outs
├── types/
│   └── index.ts             # shared types / the public options contract
└── styles/
    └── style.css            # layout & 3D positioning (was previously computed in JS)
media/                       # device frames + screenshots (served at /media in dev & build)
```

## Notes on the rewrite

Replaces the original single-file vanilla-JS `Preview` class. Fixed along the
way: `|| true` options that could never be disabled, animation starting before
images loaded, leaked `setInterval` timers (now a single disposable rAF loop),
a broken `changeImage`, and never-triggering hover slow-down. Device layout
moved from JS string concatenation into CSS.

## License

[MIT](./LICENSE.md) © exphoenee
