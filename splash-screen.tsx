"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { FaGlobeAsia } from "react-icons/fa"

interface SplashScreenProps {
  onComplete: () => void
  currentLanguage: string
  onLanguageChange: (language: string) => void
}

const SplashScreen = ({ onComplete, currentLanguage, onLanguageChange }: SplashScreenProps) => {
  const [showContent, setShowContent] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Show content after a short delay
    const timer1 = setTimeout(() => {
      setShowContent(true)
    }, 500)

    // Start fade out animation after 2.5 seconds
    const timer2 = setTimeout(() => {
      setFadeOut(true)
    }, 2500)

    // Complete the splash screen after 3 seconds
    const timer3 = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 bg-deep-navy flex flex-col items-center justify-center transition-opacity duration-500 z-50 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{
        overflow: "hidden",
        height: "100dvh", // Use dynamic viewport height for better mobile support
        width: "100dvw", // Use dynamic viewport width
      }}
    >
      <div className="relative w-full h-full max-w-md px-4 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="mb-4 sm:mb-6 relative">
            <Image
              src="/images/passport-logo.png"
              alt="Passportr Logo"
              width={180}
              height={180}
              className={`transition-transform duration-700 ${showContent ? "scale-100" : "scale-90"} w-32 h-32 sm:w-44 sm:h-44 md:w-48 md:h-48`}
              priority
            />
          </div>
          <h1
            className={`text-3xl sm:text-4xl font-bold text-cloud-white mb-2 transition-all duration-700 serif-font ${
              showContent ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
            }`}
          >
            Passportr
          </h1>
          <p
            className={`text-light-sand text-center mb-6 sm:mb-8 px-4 text-sm sm:text-base transition-all duration-700 delay-100 ${
              showContent ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
            }`}
          >
            {currentLanguage === "en" ? "Your digital passport to the world" : "세계를 향한 당신의 디지털 여권"}
          </p>
          <div
            className={`flex space-x-3 sm:space-x-4 transition-all duration-700 delay-200 ${
              showContent ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
            }`}
          >
            <button
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center text-sm sm:text-base ${
                currentLanguage === "en" ? "bg-sunset-coral text-white" : "bg-light-sand text-deep-navy"
              }`}
              onClick={() => onLanguageChange("en")}
            >
              <FaGlobeAsia className="mr-1.5 sm:mr-2" />
              English
            </button>
            <button
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center text-sm sm:text-base ${
                currentLanguage === "ko" ? "bg-sunset-coral text-white" : "bg-light-sand text-deep-navy"
              }`}
              onClick={() => onLanguageChange("ko")}
            >
              <FaGlobeAsia className="mr-1.5 sm:mr-2" />
              한국어
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen
