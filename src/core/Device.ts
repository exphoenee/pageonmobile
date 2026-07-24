import type { DeviceConfig, DeviceKind } from '../types';
import { ScrollAnimator } from './ScrollAnimator';

/** Load an image and resolve once it is decoded and ready to draw. */
function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = src;
  return img
    .decode()
    .then(() => img)
    .catch(
      () =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        }),
    );
}

interface DeviceInit {
  kind: DeviceKind;
  config: DeviceConfig;
  frameSrc: string;
  screenshotSrc: string;
  animator: {
    scrollSpeed: number;
    speedDivider: number;
    slowDownOnHover: boolean;
    stopOnClick: boolean;
    stopped: boolean;
  };
}

/**
 * One device in the stack: builds its DOM/canvas, loads its frame + screenshot,
 * and drives a ping-pong scroll animation of the screenshot inside the screen
 * cut-out. Fully self-contained and disposable via {@link destroy}.
 */
export class Device {
  readonly kind: DeviceKind;
  readonly root: HTMLDivElement;

  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly config: DeviceConfig;
  private readonly init: DeviceInit['animator'];

  private frame?: HTMLImageElement;
  private screenshot?: HTMLImageElement;
  private animator?: ScrollAnimator;
  private disposed = false;

  private readonly screenWidth: number;
  private readonly screenHeight: number;
  private sliceHeight = 0;

  private readonly onEnter: () => void;
  private readonly onLeave: () => void;
  private readonly onClick: () => void;

  constructor(private readonly params: DeviceInit) {
    this.kind = params.kind;
    this.config = params.config;
    this.init = params.animator;

    const { topX, topY, bottomX, bottomY } = this.config.screenCoords;
    this.screenWidth = bottomX - topX;
    this.screenHeight = bottomY - topY;

    this.root = document.createElement('div');
    this.root.className = 'device';
    this.root.dataset.device = this.kind;
    this.root.id = `${this.kind}-device`;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'device__canvas';
    this.ctx = this.canvas.getContext('2d')!;
    this.root.appendChild(this.canvas);

    // Bound handlers kept as fields so they can be removed on destroy.
    this.onEnter = () => {
      this.root.classList.add('is-hovered');
      if (this.animator) this.animator.speedFactor = 1 / this.init.speedDivider;
    };
    this.onLeave = () => {
      this.root.classList.remove('is-hovered');
      if (this.animator) this.animator.speedFactor = 1;
    };
    this.onClick = () => {
      if (this.animator) this.animator.paused = !this.animator.paused;
    };
  }

  /** Load assets, size the canvas and start animating. */
  async start(): Promise<void> {
    const [frame, screenshot] = await Promise.all([
      loadImage(this.params.frameSrc),
      loadImage(this.params.screenshotSrc),
    ]);
    if (this.disposed) return;

    this.frame = frame;
    this.screenshot = screenshot;

    // Backing store matches the (hi-res) frame art; CSS scales it to fit.
    this.canvas.width = frame.naturalWidth;
    this.canvas.height = frame.naturalHeight;

    const imageToScreen = this.screenWidth / screenshot.naturalWidth;
    this.sliceHeight = this.screenHeight / imageToScreen;
    const maxScroll = Math.max(0, screenshot.naturalHeight - this.sliceHeight);

    this.ctx.drawImage(frame, 0, 0);

    this.animator = new ScrollAnimator(
      maxScroll,
      this.init.scrollSpeed,
      (pos) => this.draw(pos),
    );
    this.animator.paused = this.init.stopped;
    this.attachBehaviour();
    this.animator.start();
  }

  private draw(scrollPos: number): void {
    if (!this.frame || !this.screenshot) return;
    const { topX, topY } = this.config.screenCoords;
    // Screen cut-out is opaque in the frame, so redrawing just the screenshot
    // slice into the exact destination rect each frame is sufficient.
    this.ctx.drawImage(
      this.screenshot,
      0,
      scrollPos,
      this.screenshot.naturalWidth,
      this.sliceHeight,
      topX,
      topY,
      this.screenWidth,
      this.screenHeight,
    );
  }

  private attachBehaviour(): void {
    if (this.init.slowDownOnHover) {
      this.canvas.addEventListener('mouseenter', this.onEnter);
      this.canvas.addEventListener('mouseleave', this.onLeave);
    }
    if (this.init.stopOnClick) {
      this.canvas.addEventListener('click', this.onClick);
    }
  }

  /** Swap the on-screen screenshot at runtime. */
  async setScreenshot(src: string): Promise<void> {
    const screenshot = await loadImage(src);
    if (this.disposed) return;
    this.screenshot = screenshot;
    const imageToScreen = this.screenWidth / screenshot.naturalWidth;
    this.sliceHeight = this.screenHeight / imageToScreen;
    this.animator?.setMaxScroll(
      Math.max(0, screenshot.naturalHeight - this.sliceHeight),
    );
  }

  pause(paused = true): void {
    if (this.animator) this.animator.paused = paused;
  }

  destroy(): void {
    this.disposed = true;
    this.animator?.destroy();
    this.canvas.removeEventListener('mouseenter', this.onEnter);
    this.canvas.removeEventListener('mouseleave', this.onLeave);
    this.canvas.removeEventListener('click', this.onClick);
    this.root.remove();
  }
}
