"use client"
import { motion } from "framer-motion"
import { FaPassport, FaMapMarkerAlt, FaBook, FaUser } from "react-icons/fa"
import { BiTimeFive } from "react-icons/bi"
import Image from "next/image"
import { useEffect } from "react"

interface EnterHomeScreenProps {
  onNext: () => void
  profileData: {
    nickname: string
    photoUrl: string
    theme: string
  }
  currentLanguage?: string
  translations?: any
}

export default function EnterHomeScreen({
  onNext,
  profileData,
  currentLanguage = "en",
  translations,
}: EnterHomeScreenProps) {
  // 언어에 따른 텍스트 가져오기
  const t =
    translations && translations[currentLanguage]
      ? translations[currentLanguage].home
      : {
          title: currentLanguage === "en" ? "Welcome to Passportr, " : "Passportr에 오신 것을 환영합니다, ",
          subtitle: currentLanguage === "en" ? "Your journey begins now" : "이제 여정이 시작됩니다",
          viewPassport: currentLanguage === "en" ? "Tap here to view your passport" : "여권을 보려면 여기를 탭하세요",
          startButton: currentLanguage === "en" ? "Start Exploring" : "탐험 시작하기",
        }

  // 여권 클릭 핸들러 추가
  const handlePassportClick = () => {
    // 여권 클릭 시 애니메이션 효과 추가
    const passportElement = document.getElementById("passport-image")
    if (passportElement) {
      passportElement.classList.add("animate-passport-flip")
      setTimeout(() => {
        passportElement.classList.remove("animate-passport-flip")
      }, 1500)
    }
  }

  // iOS Safari 뷰포트 높이 문제 해결을 위한 useEffect
  useEffect(() => {
    // body에 onboarding 클래스 추가
    document.body.classList.add("onboarding")

    // iOS Safari에서 vh 단위 문제 해결
    const fixIOSHeight = () => {
      // 실제 내부 뷰포트 높이 계산
      const vh = window.innerHeight
      document.documentElement.style.setProperty("--vh", `${vh}px`)
      document.documentElement.style.setProperty("--real-vh", `${vh}px`)

      // 컨테이너 요소 높이 직접 설정
      const container = document.getElementById("home-screen-container")
      if (container) {
        container.style.height = `${vh}px`
      }
    }

    // 초기 실행 및 리사이즈 이벤트에 연결
    fixIOSHeight()
    window.addEventListener("resize", fixIOSHeight)
    window.addEventListener("orientationchange", fixIOSHeight)

    // 클린업 함수
    return () => {
      document.body.classList.remove("onboarding")
      window.removeEventListener("resize", fixIOSHeight)
      window.removeEventListener("orientationchange", fixIOSHeight)
    }
  }, [])

  return (
    <div
      id="home-screen-container"
      className="fixed inset-0 bg-cloud-white flex flex-col"
      style={{
        height: "100%",
        maxHeight: "100%",
        overflow: "hidden",
      }}
    >
      {/* 헤더 영역 - flex-shrink-0 추가 */}
      <div className="flex justify-between items-center p-4 flex-shrink-0">
        <div>
          <Image src="/images/logo-new.png" alt="Passportr Logo" width={120} height={40} className="h-8 w-auto" />
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {profileData.photoUrl ? (
            <Image
              src={profileData.photoUrl || "/placeholder.svg"}
              alt="Profile"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-light-sand flex items-center justify-center">
              <FaUser className="text-stone-gray" />
            </div>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 영역 - justify-center 제거, 패딩 추가 */}
      <div className="flex-1 flex flex-col items-center pt-4 pb-4 px-6 overflow-y-auto">
        <motion.h2
          className="text-xl font-bold text-deep-navy mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {t.title} {profileData.nickname || "Explorer"}!
        </motion.h2>
        <motion.p
          className="text-stone-gray mb-4 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {t.subtitle}
        </motion.p>

        {/* mt-auto mb-auto 추가 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="relative mt-auto mb-auto"
        >
          {/* 여권 이미지 - max-w-full h-auto 추가, text-center 추가 */}
          <div
            id="passport-image"
            className="cursor-pointer transform transition-transform hover:scale-105 text-center"
            onClick={() => {
              handlePassportClick()
              setTimeout(() => onNext(), 800)
            }}
          >
            <Image
              src="/images/new-cover-classic.png"
              alt="Passport"
              width={500}
              height={667}
              layout="responsive" // 추가
              className="rounded-lg shadow-lg mb-2" // mx-auto 등 다른 클래스 필요시 추가
            />
            <p className="text-xs text-brand-blue">{t.viewPassport}</p>
          </div>
        </motion.div>
      </div>

      {/* 하단 네비게이션 - flex-shrink-0 추가 */}
      <div className="bg-white border-t border-light-sand flex items-center justify-around px-4 py-2 flex-shrink-0">
        <div className="flex flex-col items-center">
          <FaPassport className="text-brand-blue" />
          <span className="text-xs text-brand-blue mt-1">{currentLanguage === "en" ? "Passport" : "여권"}</span>
        </div>

        <div className="flex flex-col items-center">
          <FaMapMarkerAlt className="text-stone-gray" />
          <span className="text-xs text-stone-gray mt-1">{currentLanguage === "en" ? "Check-in" : "체크인"}</span>
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
