"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"

interface CustomizationScreenProps {
  language: "en" | "ko"
  onStart: () => void
}

export default function CustomizationScreen({ language, onStart }: CustomizationScreenProps) {
  const [activePassport, setActivePassport] = useState(0)
  const [currentLanguage, setCurrentLanguage] = useState(language)

  useEffect(() => {
    setCurrentLanguage(language)
  }, [language])

  // Auto-rotate through passport designs
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePassport((prev) => (prev + 1) % passportDesigns.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const texts = {
    en: {
      title: "Design your passport, your style.",
      description: "Passportr is your unique space, reflecting your taste and story.",
      button: "Begin My Journey",
    },
    ko: {
      title: "당신만의 스타일로 여권을 디자인하세요.",
      description: "Passportr는 당신의 취향과 이야기를 반영하는 독특한 공간입니다.",
      button: "여정 시작하기",
    },
  }

  // Passport design options with updated image URLs
  const passportDesigns = [
    {
      id: "classic",
      name: currentLanguage === "en" ? "Classic Blue" : "클래식 블루",
      image: "/images/new-cover-classic.png",
    },
    {
      id: "green",
      name: currentLanguage === "en" ? "Forest Green" : "포레스트 그린",
      image: "/images/new-cover-green.png",
    },
    {
      id: "yellow",
      name: currentLanguage === "en" ? "Sunshine Yellow" : "선샤인 옐로우",
      image: "/images/new-cover-yellow.png",
    },
    {
      id: "coral",
      name: currentLanguage === "en" ? "Coral Orange" : "코랄 오렌지",
      image: "/images/new-cover-coral.png",
    },
  ]

  // Handle button click with animation
  const handleStartClick = () => {
    // Play button click sound
    try {
      const clickSound = new Audio("/sounds/button-click.mp3")
      clickSound.volume = 0.5
      clickSound.play().catch((err) => console.log("Click sound failed:", err))
    } catch (error) {
      console.log("Error playing click sound:", error)
    }

    onStart()
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background */}
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

      {/* Main content */}
      <motion.div
        className="text-center px-8 max-w-md z-10 mb-8"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-white mb-4" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
          {texts[language].title}
        </h2>
        <p className="text-lg text-white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
          {texts[language].description}
        </p>
      </motion.div>

      {/* Passport carousel */}
      <div className="relative w-full max-w-xs h-80 mb-12 z-10">
        <div className="absolute inset-0 flex items-center justify-center">
          {passportDesigns.map((design, index) => (
            <motion.div
              key={index}
              className="absolute w-64 h-80 rounded-xl overflow-hidden shadow-xl"
              initial={{
                opacity: 0,
                scale: 0.8,
                rotateY: index === activePassport ? 0 : 30,
                z: index === activePassport ? 0 : -100,
              }}
              animate={{
                opacity: index === activePassport ? 1 : 0.5,
                scale: index === activePassport ? 1 : 0.8,
                rotateY: index === activePassport ? 0 : 30,
                z: index === activePassport ? 0 : -100,
                x: index === activePassport ? 0 : index < activePassport ? -50 : 50,
              }}
              transition={{ duration: 0.5 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src={design.image || "/placeholder.svg"}
                alt={design.name}
                width={256}
                height={320}
                className="w-full h-full object-cover"
              />

              {/* Passport design name */}
              <div
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent"
                style={{ color: "white" }}
              >
                <p className="font-medium">{design.name}</p>
              </div>

              {/* Decorative elements */}
              <div
                className="absolute top-4 right-4 w-12 h-12 rounded-full"
                style={{ backgroundColor: design.color, opacity: 0.8 }}
              ></div>
            </motion.div>
          ))}
        </div>

        {/* Passport selection indicators */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2">
          {passportDesigns.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${index === activePassport ? "bg-brand-coral" : "bg-stone-gray"}`}
              onClick={() => setActivePassport(index)}
            ></button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <motion.button
        className="px-8 py-4 bg-brand-coral text-white rounded-full font-bold text-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl z-10"
        whileTap={{ scale: 0.95 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={handleStartClick}
      >
        {texts[language].button}
      </motion.button>
    </div>
  )
}
