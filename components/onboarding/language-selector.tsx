"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface LanguageSelectorProps {
  onSelectLanguage: (language: "en" | "ko") => void
}

export default function LanguageSelector({ onSelectLanguage }: LanguageSelectorProps) {
  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      style={{ pointerEvents: "auto" }}
    >
      {/* Background with gradient */}
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

      {/* Logo */}
      <motion.div
        className="mb-12 z-10 flex-shrink-0"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/passportr_logo1-hT1YLDYxz1wqgsUKAq1a0pA84yXuxu.png"
          alt="Passportr Logo"
          width={240}
          height={240}
          className="w-auto h-auto"
          priority
        />
      </motion.div>

      {/* Language selection text */}
      <motion.h2
        className="text-xl font-medium text-white mb-8 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Choose Your Language / 언어를 선택하세요
      </motion.h2>

      {/* Language buttons */}
      <motion.div
        className="flex flex-col space-y-4 w-64 z-10 flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelectLanguage("en")
          }}
          className="px-8 py-4 bg-brand-coral text-white rounded-lg font-bold text-lg shadow-md transform transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
          style={{ pointerEvents: "auto", zIndex: 50 }}
        >
          English
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelectLanguage("ko")
          }}
          className="px-8 py-4 bg-brand-navy text-white rounded-lg font-bold text-lg shadow-md transform transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
          style={{ pointerEvents: "auto", zIndex: 50 }}
        >
          한국어
        </button>
      </motion.div>
    </div>
  )
}
