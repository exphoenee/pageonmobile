/** Device kinds this widget can render. */
export type DeviceKind = 'desktop' | 'notebook' | 'tablet' | 'phone';

/** Direction the device stack tilts / faces. */
export type Direction = 'left' | 'right' | 'none';

/**
 * Rectangle (in the device PNG's natural pixel space) where the website
 * screenshot is drawn — i.e. the "screen" cut-out of the device frame.
 */
export interface ScreenCoords {
  topX: number;
  topY: number;
  bottomX: number;
  bottomY: number;
}

/** Static, per-device-kind definition: which frame image and where its screen is. */
export interface DeviceConfig {
  imageDeviceSrc: string;
  screenCoords: ScreenCoords;
}

/** Options accepted by {@link Preview}. */
export interface PreviewOptions {
  /** Id of an existing element to fill with the device stack. */
  containerId: string;
  /** Map of device kind -> screenshot URL. Only listed devices are rendered. */
  screenImage: Partial<Record<DeviceKind, string>>;
  /** Pixels scrolled per second (frame-rate independent). Default 300. */
  scrollSpeed?: number;
  /** Tilt direction of the stack. Default 'right'. */
  direction?: Direction;
  /** Slow scrolling while the pointer hovers a device. Default true. */
  slowDownOnHover?: boolean;
  /** Toggle scroll pause when a device is clicked. Default true. */
  stopOnClick?: boolean;
  /** How much slower hover scrolling is vs. full speed. Default 3. */
  speedDivider?: number;
  /** Start paused. Default false. */
  stopped?: boolean;
  /** Override the folder holding device frame PNGs. Default 'media/device/'. */
  deviceFolder?: string;
}
