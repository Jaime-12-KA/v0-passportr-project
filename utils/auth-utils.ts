// Simple authentication utilities for MVP demo

export const isLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isLoggedIn") === "true"
}

export const getUserEmail = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("userEmail")
}

export const logout = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("userEmail")
  // Keep demoMode for consistency
}

export const isDemoMode = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("demoMode") === "true"
}
