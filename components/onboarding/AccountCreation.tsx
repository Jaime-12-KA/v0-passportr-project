"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaGoogle, FaApple, FaChevronLeft, FaEnvelope } from "react-icons/fa"
import { useRouter } from "next/navigation"

interface AccountCreationProps {
  onNext: () => void
  onBack: () => void
  currentLanguage: string // 현재 언어 속성 추가
  translations: any // 번역 데이터 속성 추가
}

export default function AccountCreation({ onNext, onBack, currentLanguage, translations }: AccountCreationProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const router = useRouter()

  // For MVP demo purposes - check if we should enable demo mode
  useEffect(() => {
    const isDemoMode = localStorage.getItem("demoMode") === "true"
    setDemoMode(isDemoMode)
  }, [])

  // 현재 언어에 맞는 텍스트 가져오기
  const t = translations[currentLanguage].account

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // For MVP demo, we'll bypass actual Firebase authentication
      // and use a mock authentication flow

      // Check if using test credentials
      if (email === "test@passportr.com" && password === "test123") {
        console.log("Test user logged in successfully")

        // Store login state in localStorage
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("demoMode", "true")

        // Proceed to next step or redirect to main app
        setTimeout(() => {
          setIsLoading(false)
          onNext()
        }, 1000)
        return
      }

      // For demo purposes, accept any valid-looking email/password
      if (email.includes("@") && password.length >= 6) {
        console.log("Demo user logged in successfully")

        // Store login state in localStorage
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("demoMode", "true")

        // Proceed to next step or redirect to main app
        setTimeout(() => {
          setIsLoading(false)
          onNext()
        }, 1000)
        return
      }

      // If credentials don't meet basic requirements
      throw new Error("Invalid email or password format")
    } catch (error: any) {
      console.error("Authentication error:", error)
      setError(error.message || "Authentication failed. Please try again.")
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setError("")
    setIsLoading(true)

    try {
      // For MVP demo, we'll bypass actual social authentication
      console.log(`${provider} login simulation successful`)

      // Store login state
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", `demo-${provider.toLowerCase()}@passportr.com`)
      localStorage.setItem("demoMode", "true")

      // Proceed to next step after a short delay to simulate authentication
      setTimeout(() => {
        setIsLoading(false)
        onNext()
      }, 1000)
    } catch (error: any) {
      console.error(`${provider} login error:`, error)
      setError(`${provider} login failed. Please try again.`)
      setIsLoading(false)
    }
  }

  // For demo/testing purposes - quick login with test account
  const handleTestLogin = () => {
    setEmail("test@passportr.com")
    setPassword("test123")
  }

  // For MVP demo - skip authentication
  const handleSkipAuth = () => {
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userEmail", "demo@passportr.com")
    localStorage.setItem("demoMode", "true")
    localStorage.setItem("skipOnboarding", "true")

    // Redirect to main app
    router.push("/")
  }

  return (
    <div className="h-full w-full bg-cloud-white flex flex-col">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-light-sand flex items-center justify-center">
          <FaChevronLeft className="text-deep-navy" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-deep-navy text-center mb-8">{isLogin ? t.signIn : t.signUp}</h2>

          {/* Social login buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin("Google")}
              className="w-full py-3 bg-brand-blue text-white rounded-lg font-medium flex items-center justify-center shadow-sm hover:bg-brand-blue/90 transition-colors"
              disabled={isLoading}
            >
              <FaGoogle className="mr-2" />
              {t.continueWith} Google
            </button>
            <button
              onClick={() => handleSocialLogin("Apple")}
              className="w-full py-3 bg-deep-navy text-white rounded-lg font-medium flex items-center justify-center shadow-sm hover:bg-deep-navy/90 transition-colors"
              disabled={isLoading}
            >
              <FaApple className="mr-2" />
              {t.continueWith} Apple
            </button>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-light-sand"></div>
            <span className="px-4 text-stone-gray text-sm">or</span>
            <div className="flex-1 h-px bg-light-sand"></div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
              {error.includes("invalid-credential") && (
                <div className="mt-1 text-xs">
                  For demo purposes, use test@passportr.com / test123 or click "Use test account" below.
                </div>
              )}
            </div>
          )}

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-deep-navy mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-light-sand focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder={t.emailPlaceholder}
                required
                style={{ cursor: "text" }}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-deep-navy mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-light-sand focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder={t.passwordPlaceholder}
                required
                style={{ cursor: "text" }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-sunset-coral text-white rounded-lg font-medium shadow-sm hover:bg-sunset-coral/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : isLogin ? (
                "Log in"
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-stone-gray hover:text-deep-navy transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>

          {/* Demo options */}
          <div className="mt-6 flex flex-col items-center space-y-3">
            <button
              onClick={handleTestLogin}
              className="text-xs text-stone-gray hover:text-brand-blue transition-colors flex items-center justify-center"
            >
              <FaEnvelope className="mr-1" />
              Use test account
            </button>

            <button
              onClick={handleSkipAuth}
              className="text-xs text-sunset-coral hover:text-sunset-coral/80 transition-colors"
            >
              Skip for MVP demo →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
