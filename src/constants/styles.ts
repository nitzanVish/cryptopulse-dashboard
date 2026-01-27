/**
 * Style Constants
 * 
 * Centralized style classes and constants for consistent styling across the application.
 * This makes it easier to:
 * - Maintain consistent styling
 * - Update styles in one place
 * - Support theme changes (light/dark mode)
 * - Reuse styles across components
 */

/**
 * Price change direction values
 * Single source of truth for price change directions
 * Use these constants instead of string literals throughout the application
 */
export const PRICE_CHANGE_DIRECTION = {
  UP: 'up',
  DOWN: 'down',
} as const;

/**
 * Price change color classes
 * Maps price change direction to Tailwind CSS classes
 */
export const PRICE_CHANGE_COLORS = {
  [PRICE_CHANGE_DIRECTION.UP]: 'text-green-600 dark:text-green-400',
  [PRICE_CHANGE_DIRECTION.DOWN]: 'text-red-600 dark:text-red-400',
  neutral: 'text-foreground',
} as const;

/**
 * Price change animation classes
 * Maps price change direction to CSS animation classes
 */
export const PRICE_CHANGE_ANIMATIONS = {
  [PRICE_CHANGE_DIRECTION.UP]: 'animate-price-up',
  [PRICE_CHANGE_DIRECTION.DOWN]: 'animate-price-down',
  neutral: '',
} as const;

/**
 * Base classes for PriceTag component
 */
export const PRICE_TAG_BASE_CLASSES = 'font-semibold transition-colors duration-300';
