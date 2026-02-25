/**
 * Image utilities
 *
 * Helpers for image loading and error handling (e.g. fallback placeholders).
 */

/** Data URL for a 32×32 gray placeholder SVG (used when coin image fails to load) */
const FALLBACK_PLACEHOLDER =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%23ccc"/></svg>';

/**
 * Sets the image element's src to a fallback placeholder on load error.
 * Use as onError handler: onError={handleImageError}
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>): void {
  (e.target as HTMLImageElement).src = FALLBACK_PLACEHOLDER;
}
