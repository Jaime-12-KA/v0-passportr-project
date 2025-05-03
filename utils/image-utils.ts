import type React from "react"
/**
 * Image path utility functions
 */

import { getAssetPath } from "./asset-utils"

/**
 * Get the normalized image path, handling base paths and extensions
 * @param path The image path
 * @returns The normalized image path
 */
export const getImagePath = (path: string): string => {
  return getAssetPath(normalizeImagePath(path))
}

/**
 * Normalize image path extensions to lowercase
 * @param path The image path
 * @returns The normalized image path with lowercase extension
 */
export const normalizeImagePath = (path: string): string => {
  if (!path) return ""

  // Extract extension and convert to lowercase
  const parts = path.split(".")
  if (parts.length > 1) {
    const ext = parts.pop()?.toLowerCase()
    return [...parts, ext].join(".")
  }

  return path
}

/**
 * Handle image load errors and provide fallback image
 * @param event The image load error event
 * @param fallbackSrc The fallback image path
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackSrc: string): void => {
  const target = event.target as HTMLImageElement
  console.warn(`Image failed to load: ${target.src}, using fallback: ${fallbackSrc}`)
  target.src = getImagePath(fallbackSrc)
}
