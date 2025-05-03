/**
 * Enhanced haptic feedback utility with debugging and fallbacks
 */

// Debug mode - set to true to see console logs
const DEBUG = false

// Flag to track if haptic feedback is available
let hapticAvailable: boolean | null = null

// Flag to track if we've attempted initialization
let initializationAttempted = false

// Define haptic patterns
export const hapticPatterns = {
  light: "light",
  medium: "medium",
  heavy: "heavy",
  success: "success",
  warning: "warning",
  error: "error",
  stamp: "stamp",
  strong: "strong",
}

/**
 * Trigger haptic feedback with visual fallback and debug info
 * @param pattern - Vibration pattern in milliseconds
 * @returns boolean indicating if haptic feedback was triggered
 */
export function triggerHapticFeedback(pattern: string = hapticPatterns.medium): boolean {
  // Check if the navigator object exists and has the vibrate method
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    if (DEBUG) console.log(`Triggering haptic feedback: ${pattern}`)

    // Define vibration patterns (in milliseconds)
    let vibrationPattern: number | number[] = 20 // Default medium vibration

    switch (pattern) {
      case hapticPatterns.light:
        vibrationPattern = 10
        break
      case hapticPatterns.medium:
        vibrationPattern = 20
        break
      case hapticPatterns.heavy:
        vibrationPattern = 30
        break
      case hapticPatterns.success:
        vibrationPattern = [10, 30, 10]
        break
      case hapticPatterns.warning:
        vibrationPattern = [20, 40, 20]
        break
      case hapticPatterns.error:
        vibrationPattern = [30, 50, 30]
        break
      case hapticPatterns.stamp:
        vibrationPattern = [10, 20, 50]
        break
      case hapticPatterns.strong:
        vibrationPattern = 40
        break
      default:
        vibrationPattern = 20
    }

    try {
      // Attempt to trigger vibration
      navigator.vibrate(vibrationPattern)

      // Show visual feedback for devices without vibration
      showVisualHapticFeedback(pattern)

      return true
    } catch (error) {
      console.warn("Error triggering haptic feedback:", error)

      // Show visual feedback as fallback
      showVisualHapticFeedback(pattern)

      return false
    }
  } else {
    if (DEBUG) console.log("Haptic feedback not supported on this device")

    // Show visual feedback for devices without vibration support
    showVisualHapticFeedback(pattern)

    return false
  }
}

// Function to show visual feedback for haptic events
function showVisualHapticFeedback(pattern: string): void {
  // Create a visual element for haptic feedback
  const hapticVisual = document.createElement("div")
  hapticVisual.className = "haptic-feedback-visual"

  // Adjust opacity based on pattern intensity
  switch (pattern) {
    case hapticPatterns.light:
      hapticVisual.style.opacity = "0.1"
      break
    case hapticPatterns.medium:
      hapticVisual.style.opacity = "0.15"
      break
    case hapticPatterns.heavy:
    case hapticPatterns.strong:
      hapticVisual.style.opacity = "0.2"
      break
    case hapticPatterns.success:
      hapticVisual.style.backgroundColor = "rgba(0, 255, 0, 0.1)"
      break
    case hapticPatterns.warning:
      hapticVisual.style.backgroundColor = "rgba(255, 255, 0, 0.1)"
      break
    case hapticPatterns.error:
      hapticVisual.style.backgroundColor = "rgba(255, 0, 0, 0.1)"
      break
    case hapticPatterns.stamp:
      hapticVisual.style.backgroundColor = "rgba(255, 126, 103, 0.15)"
      break
  }

  // Add to document
  document.body.appendChild(hapticVisual)

  // Remove after animation completes
  setTimeout(() => {
    if (hapticVisual.parentNode) {
      hapticVisual.parentNode.removeChild(hapticVisual)
    }
  }, 300)
}

/**
 * Stop any ongoing vibration
 */
export const stopHaptic = (): void => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(0)
      if (DEBUG) console.log("Stopped haptic feedback")
    } catch (error) {
      console.warn("Failed to stop haptic feedback:", error)
    }
  }
}

/**
 * Initialize haptic feedback
 * This function attempts to initialize haptic feedback and determines if it's available
 * @returns boolean indicating if haptic feedback is available
 */
export const initHaptics = (): boolean => {
  if (initializationAttempted) {
    if (DEBUG) console.log("Haptic initialization already attempted, status:", hapticAvailable)
    return hapticAvailable || false
  }

  initializationAttempted = true

  if (DEBUG) console.log("Initializing haptic feedback")
  try {
    // Check if the vibration API is available
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      if (DEBUG) console.log("Vibration API is available, attempting to initialize")

      // Try to trigger a silent vibration to request permission on iOS
      navigator.vibrate(0)

      // Test with a very short vibration
      setTimeout(() => {
        try {
          navigator.vibrate(1)
          hapticAvailable = true
        } catch (e) {
          console.warn("Test vibration failed:", e)
          hapticAvailable = false
        }
      }, 100)

      hapticAvailable = true
      return true
    } else {
      if (DEBUG) console.log("Vibration API is not available")
    }
  } catch (error) {
    console.warn("Haptic initialization failed:", error)
  }

  // If vibration API is not available, set flag to false
  hapticAvailable = false
  if (DEBUG) console.log("Haptic feedback not available, using visual feedback instead")
  return false
}

/**
 * Check if haptic feedback is supported
 * @returns boolean indicating if haptic feedback is supported
 */
export function isHapticFeedbackSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.vibrate
}

/**
 * Force a haptic feedback test
 * This can be called from a button click to test haptic feedback
 */
export function testHapticFeedback(): void {
  console.log("Testing haptic feedback patterns...")

  const patterns = Object.values(hapticPatterns)
  let index = 0

  const testNextPattern = () => {
    if (index < patterns.length) {
      const pattern = patterns[index]
      console.log(`Testing pattern: ${pattern}`)
      triggerHapticFeedback(pattern)
      index++
      setTimeout(testNextPattern, 1000)
    } else {
      console.log("Haptic feedback test complete")
    }
  }

  testNextPattern()
}

export const isHapticSupported = (): boolean => {
  return typeof navigator !== "undefined" && "vibrate" in navigator
}
