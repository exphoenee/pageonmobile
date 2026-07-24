import type { DeviceConfig, DeviceKind } from '../types';

/**
 * Single source of truth for device frames and their screen cut-outs.
 * (Previously duplicated between obj.js and main.js.)
 *
 * `imageDeviceSrc` is relative to `PreviewOptions.deviceFolder`.
 * `screenCoords` are in the natural pixel space of each frame image.
 */
export const DEVICE_CONFIGS: Record<DeviceKind, DeviceConfig> = {
  desktop: {
    imageDeviceSrc: 'computer-bk.webp',
    screenCoords: { topX: 230, topY: 220, bottomX: 2170, bottomY: 1330 },
  },
  notebook: {
    imageDeviceSrc: 'notebook-bk.webp',
    screenCoords: { topX: 226, topY: 451, bottomX: 1776, bottomY: 1429 },
  },
  tablet: {
    imageDeviceSrc: 'tablet-bk.webp',
    screenCoords: { topX: 180, topY: 150, bottomX: 1028, bottomY: 1275 },
  },
  phone: {
    imageDeviceSrc: 'phone-bk.webp',
    screenCoords: { topX: 575, topY: 255, bottomX: 1420, bottomY: 1750 },
  },
};

/** Stacking order (back to front) when composing the layout. */
export const DEVICE_ORDER: DeviceKind[] = [
  'desktop',
  'notebook',
  'tablet',
  'phone',
];
