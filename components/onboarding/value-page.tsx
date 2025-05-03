"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface ValuePageProps {
  language: "en" | "ko"
  onStart: () => void
}

export default function ValuePage({ language, onStart }: ValuePageProps) {
  const router = useRouter()

  const texts = {
    en: {
      title: "Where Your Story Comes Alive.",
      description: "Your Passport, Your City, Your Story",
      button: "Create My Passport",
    },
    ko: {
      title: "당신의 이야기가 살아 숨 쉬는 곳.",
      description: "당신의 여권, 당신의 도시, 당신의 이야기",
      button: "내 여권 만들기",
    },
  }

  // 직접 메인 페이지로 이동하는 함수 추가
  const handleStartExploring = (e: React.MouseEvent) => {
    // 이벤트 전파 중지
    e.stopPropagation()

    // 디버깅 로그 추가
    console.log("Create My Passport button clicked")

    // 건너뛰기 선�� 저장
    localStorage.setItem("skipOnboarding", "true")

    // 언어 설정 저장
    localStorage.setItem("language", language)

    // 메인 페이지로 이동
    router.push("/")

    // 부모 컴포넌트의 onStart 함수도 호출
    onStart()
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-between overflow-hidden">
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

      <motion.div
        className="flex flex-col items-center text-center px-6 z-10 mt-16 flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2
          className="text-xl sm:text-2xl font-bold text-brand-cloud mb-2 drop-shadow-lg"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
        >
          {texts[language].title}
        </h2>
        <p className="text-brand-cloud text-sm mb-4" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
          {texts[language].description}
        </p>
      </motion.div>

      {/* Centered content */}
      <motion.div
        className="flex flex-col items-center justify-center z-10 flex-1 max-h-[40vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
      >
        <div className="bg-white/30 backdrop-blur-md p-4 rounded-xl text-center max-w-xs">
          <h3 className="text-lg font-bold text-brand-cloud mb-2" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
            {language === "en" ? "Your journey awaits!" : "당신의 여정이 기다리고 있습니다!"}
          </h3>
          <p className="text-brand-cloud text-sm" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
            {language === "en"
              ? "Collect stamps, earn badges, and create memories"
              : "스탬프를 수집하고, 배지를 획득하고, 추억을 만드세요"}
          </p>
        </div>
      </motion.div>

      {/* Button section - moved higher */}
      <motion.div
        className="flex flex-col items-center text-center px-6 z-10 mb-24 flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          className="px-6 py-3 bg-brand-coral text-brand-cloud rounded-full font-bold text-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
          whileTap={{ scale: 0.95 }}
          onClick={(e) => handleStartExploring(e)}
          disabled={false}
          style={{ pointerEvents: "auto", zIndex: 50 }}
        >
          {texts[language].button}
        </motion.button>
      </motion.div>
    </div>
  )
}
