"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { FaStamp, FaCalendarDay, FaBolt, FaPassport, FaMapMarkerAlt, FaBook, FaUser } from "react-icons/fa"
import { BiTimeFive } from "react-icons/bi"
import type { JSX } from "react"

interface CheckinDemoPageProps {
  language: "en" | "ko"
}

export default function CheckinDemoPage({ language }: CheckinDemoPageProps) {
  const [showStampEffect, setShowStampEffect] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiElements, setConfettiElements] = useState<JSX.Element[]>([])
  const [demoComplete, setDemoComplete] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(language)

  const texts = {
    en: {
      title: "Royal Palace Stamp Collected!",
      subtitle: "You've checked in at Gyeongbokgung Palace",
      date: "2025. 4. 18.",
      rewards: "Rewards",
      stamp: "+1 Stamp",
      streak: "+1 Day Streak",
      xp: "+100 XP",
      close: "Close",
      share: "Share",
      swipeText: "Swipe to continue",
    },
    ko: {
      title: "왕궁 스탬프 수집 완료!",
      subtitle: "경복궁에 체크인했습니다",
      date: "2025. 4. 18.",
      rewards: "보상",
      stamp: "+1 스탬프",
      streak: "+1일 연속",
      xp: "+100 XP",
      close: "닫기",
      share: "공유하기",
      swipeText: "계속하려면 스와이프하세요",
    },
  }

  useEffect(() => {
    // 페이지 로드 후 애니메이션 시작
    const timer1 = setTimeout(() => {
      setShowStampEffect(true)

      // 스탬프 효과음 재생
      try {
        const audio = new Audio("/stamp-sound.mp3")
        audio.volume = 0.7
        audio.play().catch((e) => console.warn("Audio play failed:", e))
      } catch (error) {
        console.error("Error playing stamp sound:", error)
      }

      // 컨페티 효과 생성
      createConfetti()
    }, 1000)

    // 데모 완료 표시
    const timer2 = setTimeout(() => {
      setDemoComplete(true)
    }, 2500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  // 컨페티 효과 생성 함수
  const createConfetti = () => {
    const colors = ["#1E88E5", "#FF5252", "#FFB300", "#FFE0B2"]
    const newConfetti: JSX.Element[] = []

    for (let i = 0; i < 100; i++) {
      const left = Math.random() * 100
      const top = Math.random() * 10 // Start from top 10% of the container
      const animationDelay = Math.random() * 0.5
      const size = Math.random() * 8 + 5
      const duration = 1.5 + Math.random() * 2
      const rotation = Math.random() * 360
      const horizontalMovement = (Math.random() - 0.5) * 40 // Random horizontal movement

      newConfetti.push(
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            zIndex: 10,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
            transform: `rotate(${rotation}deg)`,
          }}
          initial={{ opacity: 1, y: 0, x: 0 }}
          animate={{
            opacity: 0,
            y: `${100 + Math.random() * 150}px`,
            x: `${horizontalMovement}px`,
            rotate: rotation + 360,
          }}
          transition={{
            duration: duration,
            delay: animationDelay,
            ease: "easeOut",
          }}
        />,
      )
    }

    setConfettiElements(newConfetti)
    setShowConfetti(true)
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-cloud-white">
      <div
        className="flex-1 flex flex-col items-center justify-center overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: "auto" }}
      >
        {/* 배경 이미지 추가 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/onboarding-background.png"
            alt="Travel Background"
            fill
            className="object-cover blur-sm"
            priority
          />
          <div className="absolute inset-0 bg-brand-navy bg-opacity-40"></div>
        </div>

        {/* Reduced size for the stamp demo modal */}
        <motion.div
          className="w-full max-w-xs mx-auto px-4 flex-1 flex flex-col justify-center z-10 overflow-visible"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          {/* 체크인 모달 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden relative scale-85">
            {/* 컨페티 효과 */}
            {showConfetti && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">{confettiElements}</div>
            )}

            {/* 모달 헤더 */}
            <div className="p-4 text-center relative">
              <motion.h2
                className="text-xl font-bold mb-2 text-brand-navy"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {texts[language].title}
              </motion.h2>

              <motion.div
                className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-3 border-2 border-brand-sand"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <Image
                  src="/images/gyeongbokgung.jpeg"
                  alt="Gyeongbokgung Palace"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.p
                className="text-sm text-brand-gray mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {texts[language].subtitle}
              </motion.p>
            </div>

            {/* Stamp image - reduced size */}
            <div className="relative h-36 mb-4 flex items-center justify-center bg-brand-sand">
              <motion.div
                className="w-24 h-24 rounded-full overflow-hidden border-4 border-brand-coral animate-pulse-glow"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: showStampEffect ? [0.8, 1.2, 1] : 0.8,
                  opacity: showStampEffect ? 1 : 0,
                }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <Image
                  src="/images/gyeongbokgung.jpeg"
                  alt="Gyeongbokgung Palace Stamp"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  style={{ filter: "contrast(1.2) brightness(0.8)" }}
                />
                <div className="absolute inset-0 bg-brand-coral opacity-30" style={{ mixBlendMode: "color" }}></div>
              </motion.div>

              <motion.div
                className="absolute bottom-2 text-brand-gray text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: showStampEffect ? 1 : 0 }}
                transition={{ delay: 0.6 }}
              >
                {texts[language].date}
              </motion.div>
            </div>

            {/* 보상 섹션 - 더 작고 간결하게 */}
            <motion.div
              className="bg-brand-sand p-3 mx-3 rounded-lg mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="font-bold mb-2 text-center text-sm text-brand-navy">{texts[language].rewards}</h3>
              <div className="flex justify-around">
                <div className="text-center">
                  <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-1">
                    <FaStamp className="text-[#1E88E5] text-sm" />
                  </div>
                  <p className="text-xs font-medium">{texts[language].stamp}</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-1">
                    <FaCalendarDay className="text-[#1E88E5] text-sm" />
                  </div>
                  <p className="text-xs font-medium">{texts[language].streak}</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-1">
                    <FaBolt className="text-[#1E88E5] text-sm" />
                  </div>
                  <p className="text-xs font-medium">{texts[language].xp}</p>
                </div>
              </div>
            </motion.div>

            {/* 버튼 섹션 */}
            <motion.div
              className="flex space-x-2 p-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button className="flex-1 py-2 text-sm bg-brand-sand text-[#1E88E5] rounded-lg font-bold hover:bg-opacity-90 transition-colors">
                {texts[language].close}
              </button>
              <button className="flex-1 py-2 text-sm bg-brand-coral text-[#1E88E5] rounded-lg font-bold hover:bg-opacity-90 transition-colors">
                {texts[language].share}
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* 스와이프 안내 - 데모 완료 후에만 표시 */}
        {demoComplete && (
          <motion.div
            className="mb-6 z-10 flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center text-[#1E88E5] text-sm" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
              <motion.span
                className="inline-block"
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              >
                ↓ {texts[language].swipeText} ↓
              </motion.span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation - Updated to match current app */}
      <div className="h-16 bg-white border-t border-light-sand flex items-center justify-around px-4 w-full">
        <div className="flex flex-col items-center">
          <FaPassport className="text-stone-gray" />
          <span className="text-xs text-stone-gray mt-1">{currentLanguage === "en" ? "Passport" : "여권"}</span>
        </div>

        <div className="flex flex-col items-center">
          <FaMapMarkerAlt className="text-brand-blue" />
          <span className="text-xs text-brand-blue mt-1">{currentLanguage === "en" ? "Check-in" : "체크인"}</span>
        </div>

        <div className="flex flex-col items-center">
          <BiTimeFive className="text-stone-gray" />
          <span className="text-xs text-stone-gray mt-1">{currentLanguage === "en" ? "Timeline" : "타임라인"}</span>
        </div>

        <div className="flex flex-col items-center">
          <FaBook className="text-stone-gray" />
          <span className="text-xs text-stone-gray mt-1">{currentLanguage === "en" ? "Exploration" : "탐험노트"}</span>
        </div>

        <div className="flex flex-col items-center">
          <FaUser className="text-stone-gray" />
          <span className="text-xs text-stone-gray mt-1">{currentLanguage === "en" ? "Profile" : "프로필"}</span>
        </div>
      </div>
    </div>
  )
}
