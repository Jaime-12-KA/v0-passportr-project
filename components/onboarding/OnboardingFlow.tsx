"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import SplashScreen from "./SplashScreen"
import FeatureCarousel from "./FeatureCarousel"
import AccountCreation from "./AccountCreation"
import ProfileSetup from "./ProfileSetup"
import PermissionsRequest from "./PermissionsRequest"
import CheckInTutorial from "./CheckInTutorial"
import EnterHomeScreen from "./EnterHomeScreen"
import { isLoggedIn } from "@/utils/auth-utils"

// 언어 데이터 정의
export const translations = {
  en: {
    splash: {
      title: "Where Your Story Comes Alive.",
      description: "Record your moments.<br />Collect your stamps.<br />Design your world.",
      button: "Begin My Journey",
    },
    features: {
      title: "Collect stamps from your travels",
      description: "Check in at locations to earn unique stamps for your digital passport",
      skip: "Skip",
      feature1: {
        title: "Craft Your One-of-a-Kind Passport.",
        description: "Collect moments, decorate your space, and watch your experiences become a timeless narrative.",
      },
      feature2: {
        title: "Stamp your memories with a satisfying 'thunk!'",
        description: "Check in at nearby locations to earn unique stamps with delightful animations",
      },
      feature3: {
        title: "Customize your space with themes & stickers",
        description: "Make your passport truly yours with personalized designs and decorations",
      },
    },
    account: {
      title: "Create your account",
      email: "Email",
      emailPlaceholder: "your@email.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      signUp: "Sign Up",
      signIn: "Log In",
      orContinueWith: "Or continue with",
      continueWith: "Continue with",
      dontHaveAccount: "Don't have an account? Sign up",
      alreadyHaveAccount: "Already have an account? Log in",
      allow: "허용",
      skip: "나중에 하기",
      useTestAccount: "테스트 계정 사용",
      skipDemo: "MVP 데모를 위해 건너뛰기 →",
    },
    profile: {
      title: "Set up your profile",
      addPhoto: "Add a profile photo",
      nickname: "Nickname",
      nicknamePlaceholder: "How should we call you?",
      chooseTheme: "Choose your passport theme",
      preview: "Live preview",
      previewName: "'s passport",
      continue: "Continue",
    },
    permissions: {
      title: "Enable permissions",
      locationTitle: "Enable location services",
      locationDesc: "Auto-record your city check-ins and<br />discover nearby places to explore",
      notificationsTitle: "Stay in the loop",
      notificationsDesc:
        "Get notified when you earn a new stamp or collect a collection<br />완성했을 때 알림을 받으세요",
      enable: "Allow",
      skip: "Maybe later",
      continue: "계속하기",
    },
    tutorial: {
      title: "How to check in",
      letsCheckIn: "Let's check in!",
      tapCheckIn: "Tap the check-in button below to collect your first stamp",
      collectingStamp: "스탬프 수집 중...",
      congratulations: "축하합니다!",
      firstStampCollected: "You've collected your first stamp. Check in at more locations to grow your collection!",
      firstCheckIn: "First Check-in",
      continueToPassportr: "Continue to Passportr",
    },
    home: {
      title: "You're all set!",
      welcome: "Welcome to Passportr",
      journeyBegins: "Your journey begins now",
      subtitle: "Your passport is ready for adventure", // Corrected English text
      continue: "Start Exploring",
      explore: "탐색",
      passport: "여권",
      timeline: "타임라인",
      profile: "Profile",
      tapToView: "Tap here to view your passport",
    },
  },
  kr: {
    splash: {
      title: "당신의 이야기가\n살아 숨 쉬는 곳.",
      description: "순간을 기록하세요. 스탬프를 모으세요.<br />당신의 세계를 디자인하세요.",
      button: "나의 여정 시작하기",
    },
    features: {
      title: "여행에서 스탬프를 수집하세요",
      description: "장소에 체크인하여 디지털 여권에 독특한 스탬프를 획득하세요",
      skip: "건너뛰기",
      feature1: {
        title: "세상에 단 하나뿐인<br />여권을 만드세요.",
        description:
          "소중한 순간들을 수집하고, 공간을 꾸미며,<br />경험이 시간을 초월하는 이야기로<br />피어나는 것을 지켜보세요.",
      },
      feature2: {
        title: "만족스러운 '쿵!' 소리와 함께<br />추억을 스탬프로 남기세요",
        description: "장소에 체크인하여 멋진 애니메이션과 함께<br />독특한 스탬프를 획득하세요",
      },
      feature3: {
        title: "테마와 스티커로 나만의 공간을<br />꾸며보세요",
        description: "개인화된 디자인과 장식으로<br />여권을 나만의 것으로 만드세요",
      },
    },
    account: {
      title: "계정 만들기",
      email: "이메일",
      emailPlaceholder: "your@email.com",
      password: "비밀번호",
      passwordPlaceholder: "••••••••",
      signUp: "회원가입",
      signIn: "로그인",
      orContinueWith: "또는 다음으로 계속",
      continueWith: "다음으로 계속:",
      dontHaveAccount: "계정이 없으신가요? 회원가입",
      alreadyHaveAccount: "이미 계정이 있으신가요? 로그인",
      allow: "허용",
      skip: "나중에 하기",
      useTestAccount: "테스트 계정 사용",
      skipDemo: "MVP 데모를 위해 건너뛰기 →",
    },
    profile: {
      title: "프로필 설정",
      addPhoto: "프로필 사진 추가",
      nickname: "닉네임",
      nicknamePlaceholder: "어떻게 불러드릴까요?",
      chooseTheme: "여권 테마 선택",
      preview: "미리보기",
      previewName: "님의 여권",
      continue: "계속하기",
    },
    permissions: {
      title: "권한 설정",
      locationTitle: "위치 서비스 활성화",
      locationDesc: "자동으로 도시 체크인을 기록하고<br />주변의 탐험할 장소를 발견하세요",
      notificationsTitle: "최신 정보 받기",
      notificationsDesc: "새로운 스탬프를 획득하거나 컬렉션을<br />완성했을 때 알림을 받으세요",
      enable: "허용",
      skip: "나중에 하기",
      continue: "계속하기",
    },
    tutorial: {
      title: "체크인 방법",
      letsCheckIn: "체크인해 보세요!",
      tapCheckIn: "아래의 체크인 버튼을 탭하여<br />첫 번째 스탬프를 수집하세요",
      collectingStamp: "스탬프 수집 중...",
      congratulations: "축하합니다!",
      firstStampCollected: "첫 번째 스탬프를 수집했습니다. 더 많은 장소에서<br />체크인하여 컬렉션을 늘려보세요!",
      firstCheckIn: "첫 번째 체크인",
      continueToPassportr: "Passportr로 계속하기",
    },
    home: {
      title: "모든 준비가 완료되었습니다!",
      welcome: "Passportr에 오신 것을 환영합니다",
      journeyBegins: "이제 여정이 시작됩니다",
      subtitle: "모험을 위한 여권이 준비되었습니다", // Corrected Korean translation
      continue: "탐험 시작하기",
      explore: "탐색",
      passport: "여권",
      timeline: "타임라인",
      profile: "프로필",
      tapToView: "여권을 보려면 여기를 탭하세요",
    },
  },
}

export default function OnboardingFlow() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en") // 언어 선택 상태 추가
  const [profileData, setProfileData] = useState({
    nickname: "",
    photoUrl: "",
    theme: "classic",
  })
  const [permissionsGranted, setPermissionsGranted] = useState({
    location: false,
    notifications: false,
  })
  const router = useRouter()

  // 언어 설정 유지 로직 강화
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage === "ko" ? "kr" : savedLanguage)
    }
  }, [])

  // Check if user is already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/")
    }
  }, [router])

  // handleSwitchLanguage 함수 개선
  const handleSwitchLanguage = (lang: string) => {
    console.log("언어 변경:", lang) // 디버깅용
    setCurrentLanguage(lang)
    // 언어 설정을 localStorage에 저장하여 페이지 전환 후에도 유지
    localStorage.setItem("language", lang === "kr" ? "ko" : "en")
  }

  const handleNext = () => {
    if (isAnimating) return

    setIsAnimating(true)

    // Add a small delay to ensure animations complete
    setTimeout(() => {
      setCurrentScreen((prev) => {
        // If we're at the last screen, redirect to home
        if (prev >= 6) {
          // Add a small delay before redirecting
          setTimeout(() => {
            router.push("/")
          }, 300)
          return prev
        }
        return prev + 1
      })
    }, 100)
  }

  const handleBack = () => {
    if (isAnimating || currentScreen === 0) return

    setIsAnimating(true)
    setCurrentScreen((prev) => prev - 1)
  }

  const handleSkip = () => {
    router.push("/")
  }

  const handleProfileUpdate = (data: Partial<typeof profileData>) => {
    setProfileData((prev) => ({ ...prev, ...data }))

    // 실제로 테마를 저장 (localStorage에 저장)
    if (data.theme) {
      localStorage.setItem("passportTheme", data.theme)
    }

    // 닉네임 저장
    if (data.nickname) {
      localStorage.setItem("userNickname", data.nickname)
    }
  }

  const handlePermissionUpdate = (permission: keyof typeof permissionsGranted, granted: boolean) => {
    setPermissionsGranted((prev) => ({ ...prev, [permission]: granted }))
  }

  // 언어 선택기 컴포넌트 - 화면에 따라 위치 조정
  const LanguageSelector = () => {
    // 첫 화면(스플래시)에서는 표시하지 않음 (SplashScreen에 직접 추가했으므로)
    if (currentScreen === 0) return null

    // 기능 소개 화면에서는 다른 위치에 표시 (건너뛰기 버튼과 겹치지 않게)
    const positionClass = currentScreen === 1 ? "top-16 right-4" : "top-4 right-4"

    return (
      <div className={`absolute ${positionClass} z-20 flex space-x-2`}>
        <button
          onClick={() => handleSwitchLanguage("en")}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentLanguage === "en" ? "bg-brand-blue text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => handleSwitchLanguage("kr")}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentLanguage === "kr" ? "bg-brand-blue text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          한국어
        </button>
      </div>
    )
  }

  // screens 배열에서 모든 컴포넌트에 currentLanguage와 translations props 전달하기
  const screens = [
    <SplashScreen
      key="splash"
      onNext={handleNext}
      currentLanguage={currentLanguage}
      translations={translations}
      onLanguageChange={handleSwitchLanguage}
    />,
    <FeatureCarousel
      key="features"
      onNext={handleNext}
      onBack={handleBack}
      onSkip={handleSkip}
      currentLanguage={currentLanguage}
      translations={translations}
    />,
    <AccountCreation
      key="account"
      onNext={handleNext}
      onBack={handleBack}
      currentLanguage={currentLanguage}
      translations={translations}
    />,
    <ProfileSetup
      key="profile"
      onNext={handleNext}
      onBack={handleBack}
      profileData={profileData}
      onProfileUpdate={handleProfileUpdate}
      currentLanguage={currentLanguage}
      translations={translations}
    />,
    <PermissionsRequest
      key="permissions"
      onNext={handleNext}
      onBack={handleBack}
      permissionsGranted={permissionsGranted}
      onPermissionUpdate={handlePermissionUpdate}
      currentLanguage={currentLanguage}
      translations={translations}
    />,
    <CheckInTutorial
      key="tutorial"
      onNext={handleNext}
      onBack={handleBack}
      currentLanguage={currentLanguage}
      translations={translations}
    />,
    <EnterHomeScreen
      key="home"
      onNext={handleNext}
      profileData={profileData}
      currentLanguage={currentLanguage}
      translations={translations}
    />,
  ]

  // Variants for page transitions
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  return (
    <div className="fixed inset-0 bg-cloud-white overflow-hidden" style={{ height: "var(--app-height)" }}>
      <LanguageSelector />
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => setIsAnimating(false)}>
        <motion.div
          key={currentScreen}
          custom={1}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="w-full h-full"
          style={{ height: "var(--app-height)" }}
        >
          {screens[currentScreen]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
