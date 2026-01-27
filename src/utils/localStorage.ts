/**
 * LocalStorage Utility
 * 
 * Helper functions for saving and loading data from LocalStorage.
 * Provides type-safe wrappers around LocalStorage API with error handling.
 */

const WATCHLIST_STORAGE_KEY = 'cryptopulse-watchlist';

/**
 * Saves watchlist to LocalStorage
 * 
 * @param coinIdsMap - Map of coin IDs (Record<string, boolean>) to save
 */
export function saveWatchlistToStorage(coinIdsMap: Record<string, boolean>): void {
  try {
    // Convert map to array for storage (backward compatibility)
    const coinIdsArray = Object.keys(coinIdsMap);
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(coinIdsArray));
  } catch (error) {
    console.error('Failed to save watchlist to LocalStorage:', error);
  }
}

/**
 * Loads watchlist from LocalStorage
 * 
 * @returns Array of coin IDs, or empty array if not found or on error
 */
export function loadWatchlistFromStorage(): string[] {
  try {
    const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load watchlist from LocalStorage:', error);
  }
  return [];
}

/**
 * Clears watchlist from LocalStorage
 */
export function clearWatchlistFromStorage(): void {
  try {
    localStorage.removeItem(WATCHLIST_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear watchlist from LocalStorage:', error);
  }
}
