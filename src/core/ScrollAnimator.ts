/**
 * Frame-rate independent ping-pong scroll position driver.
 *
 * Owns a single `requestAnimationFrame` loop, advances a scroll offset back
 * and forth between 0 and `maxScroll`, and invokes `onFrame` with the current
 * offset. Speed is in pixels-per-second, so playback is identical at 60/120/144 Hz.
 */
export class ScrollAnimator {
  private rafId = 0;
  private lastTime = 0;
  private position = 0;
  private forward = true;
  private running = false;
  private _paused = false;

  /** Pixels per second at full speed. */
  speed: number;
  /** Multiplier applied to `speed` (e.g. 1 = full, 1/3 = slowed on hover). */
  speedFactor = 1;

  constructor(
    private maxScroll: number,
    speed: number,
    private readonly onFrame: (position: number) => void,
  ) {
    this.speed = speed;
  }

  /** Update the scrollable range when the screenshot dimensions become known. */
  setMaxScroll(maxScroll: number): void {
    this.maxScroll = Math.max(0, maxScroll);
    if (this.position > this.maxScroll) this.position = this.maxScroll;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  /** Pause advancing but keep the current position (loop keeps drawing). */
  set paused(value: boolean) {
    this._paused = value;
  }
  get paused(): boolean {
    return this._paused;
  }

  /** Stop the loop entirely and release the rAF handle. */
  destroy(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private tick = (now: number): void => {
    if (!this.running) return;
    const deltaSeconds = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (!this._paused && this.maxScroll > 0) {
      const step = this.speed * this.speedFactor * deltaSeconds;
      this.position += this.forward ? step : -step;

      if (this.position >= this.maxScroll) {
        this.position = this.maxScroll;
        this.forward = false;
      } else if (this.position <= 0) {
        this.position = 0;
        this.forward = true;
      }
    }

    this.onFrame(this.position);
    this.rafId = requestAnimationFrame(this.tick);
  };
}
