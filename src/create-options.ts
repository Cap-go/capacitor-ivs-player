import type { CapacitorIvsPlayerCreateOptions } from './definitions';

const PROJECTION_SELECTOR_REQUIRED = 'projectionSelector is required when nativeUiEngine is true';

export function validateCapacitorIvsPlayerCreateOptions(options: CapacitorIvsPlayerCreateOptions): void {
  if (options.nativeUiEngine === true) {
    const selector = options.projectionSelector?.trim();
    if (!selector) {
      throw new Error(PROJECTION_SELECTOR_REQUIRED);
    }
  }
}

export function usesNativeUiEngine(options: CapacitorIvsPlayerCreateOptions): boolean {
  return options.nativeUiEngine === true;
}

export { PROJECTION_SELECTOR_REQUIRED };
