"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { FaPassport, FaStamp, FaPalette } from "react-icons/fa"

interface FeatureCarouselProps {
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  currentLanguage: string
  translations: {
    en: any
    kr: any
  }
}

export default function FeatureCarousel({
  onNext,
  onBack,
  onSkip,
  currentLanguage,
  translations,
}: FeatureCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isStamping, setIsStamping] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // 언어에 따른 텍스트 가져오기
  const t = translations[currentLanguage].features

  // 스탬프 애니메이션 함수
  const playStampAnimation = () => {
    setIsStamping(true)
    setTimeout(() => {
      setIsStamping(false)
    }, 500)
  }

  // Fixed Korean text for first feature
  const getFeatureDescription = (index: number) => {
    if (currentLanguage === "kr" && index === 0) {
      return "소중한 순간들을 수집하고, 공간을 꾸미며,<br />경험이 시간을 초월하는 이야기로<br />피어나는 것을 지켜보세요."
    }

    return currentLanguage === "en"
      ? t.feature1.description
      : index === 0
        ? t.feature1.description
        : index === 1
          ? t.feature2.description
          : t.feature3.description
  }

  const features = [
    {
      title:
        currentLanguage === "en" ? "Craft Your One-of-a-Kind Passport." : "세상에 단 하나뿐인<br />여권을 만드세요.",
      description: getFeatureDescription(0),
      icon: <FaPassport className="text-5xl text-brand-blue" />,
    },
    {
      title:
        currentLanguage === "en"
          ? "Stamp your memories with a satisfying 'thunk!'"
          : "만족스러운 '쿵!' 소리와 함께<br />추억을 스탬프로 남기세요",
      description:
        currentLanguage === "en"
          ? "Check in at nearby locations to earn unique stamps with delightful animations"
          : "장소에 체크인하여 멋진 애니메이션과 함께<br />독특한 스탬프를 획득하세요",
      icon: (
        <motion.div
          animate={isStamping ? { scale: [1, 0.8, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <FaStamp className="text-5xl text-sunset-coral" onClick={playStampAnimation} />
        </motion.div>
      ),
      hasAnimation: true,
    },
    {
      title:
        currentLanguage === "en"
          ? "Customize your space with themes & stickers"
          : "테마와 스티커로 나만의 공간을<br />꾸며보세요",
      description:
        currentLanguage === "en"
          ? "Make your passport truly yours with personalized designs and decorations"
          : "개인화된 디자인과 장식으로<br />여권을 나만의 것으로 만드세요",
      icon: <FaPalette className="text-5xl text-sunshine-yellow" />,
    },
  ]

  const handleNext = () => {
    if (activeSlide < features.length - 1) {
      setActiveSlide(activeSlide + 1)
    } else {
      onNext()
    }
  }

  const handlePrev = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1)
    } else {
      onBack()
    }
  }

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      handleNext()
    }

    if (touchEnd - touchStart > 100) {
      // Swipe right
      handlePrev()
    }
  }

  // 두 번째 슬라이드가 활성화될 때 스탬프 애니메이션 재생
  useEffect(() => {
    if (activeSlide === 1) {
      const timer = setTimeout(() => {
        playStampAnimation()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [activeSlide])

  return (
    <div
      className="h-full w-full bg-cloud-white flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Skip button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={onSkip}
          className="px-4 py-2 text-sunset-coral font-medium hover:bg-sunset-coral/10 rounded-full transition-colors"
        >
          {currentLanguage === "en" ? "Skip" : "건너뛰기"}
        </button>
      </div>

      {/* Carousel */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div ref={carouselRef} className="w-full h-full relative">
          <div
            className="absolute inset-0 flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {features.map((feature, index) => (
              <div key={index} className="min-w-full h-full flex flex-col items-center justify-center px-8">
                <motion.div
                  className={`mb-8 p-6 rounded-full bg-light-sand flex items-center justify-center ${
                    feature.hasAnimation ? "cursor-pointer" : ""
                  }`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={feature.hasAnimation ? playStampAnimation : undefined}
                >
                  {feature.icon}
                </motion.div>
                <motion.h2
                  className="text-2xl font-bold text-deep-navy text-center mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  dangerouslySetInnerHTML={{ __html: feature.title }}
                ></motion.h2>
                <motion.p
                  className="text-stone-gray text-center max-w-md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  dangerouslySetInnerHTML={{ __html: feature.description }}
                ></motion.p>
                {feature.hasAnimation && (
                  <motion.p
                    className="mt-2 text-sunset-coral text-sm cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={playStampAnimation}
                  >
                    {currentLanguage === "en" ? "Tap to try it!" : "탭해서 체험해보세요!"}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center items-center pb-4">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-2 h-2 rounded-full mx-1 transition-all ${
              activeSlide === index ? "bg-sunset-coral w-4" : "bg-stone-gray"
            }`}
          />
        ))}
      </div>

      {/* Continue button */}
      <div className="pb-8 px-6">
        <button
          onClick={handleNext}
          className="w-full py-3 bg-sunset-coral text-white rounded-lg font-medium shadow-sm hover:bg-sunset-coral/90 transition-colors"
        >
          {activeSlide < features.length - 1
            ? currentLanguage === "en"
              ? "Continue"
              : "계속하기"
            : currentLanguage === "en"
              ? "Get Started"
              : "시작하기"}
        </button>
      </div>
    </div>
  )
}
