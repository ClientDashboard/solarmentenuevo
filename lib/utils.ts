import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Checks if the current environment is development or preview
 */
export function isDevelopmentOrPreview(): boolean {
  // Check for development environment
  if (process.env.NODE_ENV === "development") {
    return true
  }

  // Check for Vercel preview environment
  if (process.env.VERCEL_ENV === "preview") {
    return true
  }

  // Check for specific preview domains
  const url = process.env.NEXT_PUBLIC_SITE_URL || ""
  if (url.includes("vercel.app") || url.includes("localhost")) {
    return true
  }

  return false
}

// Also add the formatNumber function if it doesn't exist yet
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function formatCurrency(num: number): string {
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
