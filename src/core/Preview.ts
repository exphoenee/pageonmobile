import type { DeviceKind, PreviewOptions } from '../types';
import { DEVICE_CONFIGS, DEVICE_ORDER } from '../config/devices.config';
import { Device } from './Device';

/** Resolve user options against defaults (fixing the old `|| true` bug: a
 * caller can now actually pass `false`). */
function withDefaults(options: PreviewOptions) {
  return {
    scrollSpeed: options.scrollSpeed ?? 300,
    direction: options.direction ?? 'right',
    slowDownOnHover: options.slowDownOnHover ?? true,
    stopOnClick: options.stopOnClick ?? true,
    speedDivider: options.speedDivider ?? 3,
    stopped: options.stopped ?? false,
    deviceFolder: options.deviceFolder ?? 'media/device/',
  } as const;
}

/**
 * Builds a stack of {@link Device}s inside a container element and orchestrates
 * their lifecycle. Layout/positioning is delegated to CSS via the
 * `data-devices` / `data-direction` attributes on the collection element.
 */
export class Preview {
  private readonly collection: HTMLElement;
  private readonly devices = new Map<DeviceKind, Device>();

  constructor(options: PreviewOptions) {
    const el = document.getElementById(options.containerId);
    if (!el) {
      throw new Error(
        `Preview: container #${options.containerId} was not found.`,
      );
    }
    const defaults = withDefaults(options);

    this.collection = el;
    this.collection.classList.add('device-collection');

    const kinds = DEVICE_ORDER.filter((k) => k in options.screenImage);
    if (kinds.length === 0) {
      throw new Error('Preview: `screenImage` must list at least one device.');
    }
    // CSS keys its layout off which devices are present + tilt direction.
    this.collection.dataset.devices = kinds.join(' ');
    this.collection.dataset.direction = defaults.direction;

    for (const kind of kinds) {
      const config = DEVICE_CONFIGS[kind];
      const device = new Device({
        kind,
        config,
        frameSrc: defaults.deviceFolder + config.imageDeviceSrc,
        screenshotSrc: options.screenImage[kind]!,
        animator: {
          scrollSpeed: defaults.scrollSpeed,
          speedDivider: defaults.speedDivider,
          slowDownOnHover: defaults.slowDownOnHover,
          stopOnClick: defaults.stopOnClick,
          stopped: defaults.stopped,
        },
      });
      this.collection.appendChild(device.root);
      this.devices.set(kind, device);
      // Fire and forget; failures surface in the console per-device.
      void device.start().catch((err) => console.error(err));
    }
  }

  /** Replace the screenshot on one device (or all if `kind` omitted). */
  async setScreenshot(src: string, kind?: DeviceKind): Promise<void> {
    const targets = kind
      ? [this.devices.get(kind)].filter(Boolean)
      : [...this.devices.values()];
    await Promise.all(targets.map((d) => d!.setScreenshot(src)));
  }

  pause(paused = true): void {
    for (const d of this.devices.values()) d.pause(paused);
  }

  /** Tear everything down: stop rAF loops, remove listeners and DOM. */
  destroy(): void {
    for (const d of this.devices.values()) d.destroy();
    this.devices.clear();
    delete this.collection.dataset.devices;
    delete this.collection.dataset.direction;
  }
}
