"use client"

import { motion } from "framer-motion"

interface SplashScreenProps {
  onNext: () => void
  currentLanguage: string
  translations: any
  onLanguageChange?: (lang: string) => void
}

export default function SplashScreen({ onNext, currentLanguage, translations, onLanguageChange }: SplashScreenProps) {
  // Create a modified texts object with properly formatted Korean title
  const text = {
    ...translations[currentLanguage].splash,
    // Override the Korean title with properly broken lines
    title: currentLanguage === "kr" ? "당신의 이야기가\n살아 숨 쉬는 곳." : translations[currentLanguage].splash.title,
  }

  // Coral sunset color
  const coralSunset = "#FF6F61"

  return (
    <div
      className="flex flex-col h-full w-full bg-[#00A9E0] p-6 text-center relative overflow-hidden"
      style={{ height: "var(--app-height)" }}
    >
      {/* Language selector buttons */}
      <div className="absolute top-4 right-4 z-20 flex space-x-2">
        <button
          onClick={() => onLanguageChange && onLanguageChange("en")}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentLanguage === "en" ? "bg-white text-[#00A9E0]" : "bg-white/20 text-white"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => onLanguageChange && onLanguageChange("kr")}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentLanguage === "kr" ? "bg-white text-[#00A9E0]" : "bg-white/20 text-white"
          }`}
        >
          한국어
        </button>
      </div>

      {/* Main content centered in the screen with logo text moved down */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-12 mt-12"
        >
          {/* Logo text instead of image */}
          <motion.h1
            className="text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white">passport</span>

            <span style={{ color: coralSunset }}>r</span>
          </motion.h1>

          <div className="space-y-4">
            <h2
              className="text-3xl font-bold text-white whitespace-pre-line"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
            >
              {text.title}
            </h2>
            <p
              className="text-white/90 max-w-xs mx-auto"
              dangerouslySetInnerHTML={{ __html: text.description }}
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
            ></p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="mt-8 px-8 py-3 bg-white text-[#00A9E0] rounded-full font-medium shadow-lg hover:bg-white/90 transition-colors relative"
            style={{
              boxShadow: "0 4px 14px rgba(255, 255, 255, 0.3)",
            }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-sm text-white/80 whitespace-nowrap"
            >
              {currentLanguage === "en" ? "Tap to continue" : "탭하여 계속하기"}
            </motion.span>
            {text.button}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
