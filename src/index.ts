/**
 * Public library entry point for the `pageonmobile` package.
 *
 * Consumers do:
 *   import { Preview } from 'pageonmobile';
 *   import 'pageonmobile/style.css';
 */
import './styles/preview.css';

export { Preview } from './core/Preview';
export type {
  PreviewOptions,
  DeviceKind,
  Direction,
  DeviceConfig,
  ScreenCoords,
} from './types';
