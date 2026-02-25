/**
 * Date formatting utilities
 */

/**
 * Formats a timestamp (ms) to axis/tooltip time string (HH:mm, 24h, no seconds)
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted time string (e.g., "14:30")
 */
export function formatTimeAxis(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Formats a timestamp (ms) to a time string (HH:MM:SS, 24h)
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted time string (e.g., "14:30:45")
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Formats a timestamp to a readable date string
 * 
 * @param timestamp - ISO timestamp string
 * @returns Formatted date string (e.g., "Jan 15, 2:30 PM")
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
