"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface WelcomePageProps {
  language: "en" | "ko"
}

export default function WelcomePage({ language }: WelcomePageProps) {
  const texts = {
    en: {
      welcome: "Welcome to Passportr!",
      description: "Capture your city experiences in a unique digital passport.",
    },
    ko: {
      welcome: "Passportr에 오신 것을\n환영합니다!",
      description: "독특한 디지털 여권으로\n도시 경험을 기록하세요.",
    },
  }

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center overflow-hidden relative"
      onClick={(e) => e.stopPropagation()}
      style={{ pointerEvents: "auto" }}
    >
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/onboarding-background.png"
          alt="Travel Background"
          fill
          className="object-cover blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-brand-navy bg-opacity-60"></div>
      </div>

      {/* Logo */}
      <motion.div
        className="w-full text-center z-10 mb-8 flex-shrink-0"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
      >
        <h1 className="text-4xl font-bold text-brand-cloud drop-shadow-md">Passportr</h1>
      </motion.div>

      {/* Text content - centered vertically and horizontally */}
      <motion.div
        className="flex flex-col items-center text-center px-8 max-w-md z-10 flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h1
          className="text-3xl font-bold text-brand-cloud mb-4 drop-shadow-lg whitespace-pre-line"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
        >
          {texts[language].welcome}
        </h1>
        <p
          className="text-lg text-brand-cloud drop-shadow-lg whitespace-pre-line"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
        >
          {texts[language].description}
        </p>
      </motion.div>
    </div>
  )
}
