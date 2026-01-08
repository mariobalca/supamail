import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getURL = () => {
  let url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;

  // Remove trailing slash if present
  url = url.endsWith('/') ? url.slice(0, -1) : url;
  return url;
};
