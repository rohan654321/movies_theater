import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind and custom classnames
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string to a readable format
 * Example: "2023-08-20" → "August 20, 2023"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Extracts the year from a date string
 * Example: "2023-08-20" → "2023"
 */
export function formatYear(dateString: string): string {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  return date.getFullYear().toString();
}

/**
 * Formats runtime minutes to hours and minutes
 * Example: 135 → "2h 15m"
 */
export function formatRuntime(minutes: number): string {
  if (!minutes) return "Unknown";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
}
