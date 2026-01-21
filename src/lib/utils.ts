import { getStoredSettings } from '../hooks/useSettings';

/**
 * Get the n8n instance URL from settings or environment variables
 * Can be called with settings object or without (will use stored settings)
 */
export const getN8nUrl = (settings?: { n8nUrl: string }): string => {
  const resolvedSettings = settings || getStoredSettings();
  return resolvedSettings.n8nUrl || import.meta.env.VITE_N8N_URL || '';
};

/**
 * Format a duration in seconds to a human-readable string
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
};

/**
 * Truncate a string to a specified length with ellipsis
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

/**
 * Copy text to clipboard and return success status
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Debounce a function call
 */
export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Export data to CSV file
 */
export const exportToCSV = (data: Record<string, unknown>[], filename: string): void => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header];
          const stringValue = value === null || value === undefined ? '' : String(value);
          // Escape quotes and wrap in quotes if contains comma or quote
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};
