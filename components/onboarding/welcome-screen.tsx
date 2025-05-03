"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef } from "react"

interface WelcomeScreenProps {
  language: "en" | "ko"
}

export default function WelcomeScreen({ language }: WelcomeScreenProps) {
  const logoRef = useRef<HTMLDivElement>(null)

  // Animation for the logo glow effect
  useEffect(() => {
    if (!logoRef.current) return

    const animateGlow = () => {
      const logo = logoRef.current
      if (!logo) return

      // Pulse animation
      let opacity = 0
      let increasing = true
      const interval = setInterval(() => {
        if (increasing) {
          opacity += 0.02
          if (opacity >= 1) {
            increasing = false
          }
        } else {
          opacity -= 0.02
          if (opacity <= 0.3) {
            increasing = true
          }
        }

        logo.style.boxShadow = `0 0 ${20 + opacity * 15}px ${opacity * 8}px rgba(30, 136, 229, ${opacity * 0.5})`
      }, 50)

      return () => clearInterval(interval)
    }

    const cleanup = animateGlow()
    return cleanup
  }, [])

  const texts = {
    en: {
      title: "Your everyday life becomes a journey.",
      description: "Discover hidden city gems and turn every moment into a special memory with Passportr.",
    },
    ko: {
      title: "당신의 일상이 여행이 됩니다.",
      description: "Passportr와 함께 숨겨진 도시의 보석을 발견하고 모든 순간을 특별한 추억으로 만드세요.",
    },
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-blue to-brand-blue/70"></div>

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url("/patterns/passport-pattern.svg")',
          backgroundSize: "100px",
          backgroundRepeat: "repeat",
        }}
      ></div>

      {/* Logo with animation */}
      <motion.div
        className="mb-8 z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <div
          ref={logoRef}
          className="w-40 h-40 relative rounded-full bg-white p-2 shadow-lg"
          style={{ boxShadow: "0 0 20px 5px rgba(30, 136, 229, 0.3)" }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/passportr_logo1-hT1YLDYxz1wqgsUKAq1a0pA84yXuxu.png"
            alt="Passportr Logo"
            width={160}
            height={160}
            className="w-full h-full object-contain"
          />
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        className="text-center px-8 max-w-md z-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2
          className="text-3xl font-bold text-white mb-4 font-serif"
          style={{ fontFamily: "Georgia, serif", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
        >
          {texts[language].title}
        </h2>
        <p className="text-lg text-white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
          {texts[language].description}
        </p>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 z-0"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 0.2 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <div
          className="w-full h-full bg-contain bg-repeat-x bg-bottom"
          style={{ backgroundImage: 'url("/images/city-skyline-silhouette.png")' }}
        ></div>
      </motion.div>
    </div>
  )
}
