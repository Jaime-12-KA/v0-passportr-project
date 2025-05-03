"use client"

import { useState, useEffect } from "react"
import SplashScreen from "./splash-screen"
import Header from "./header"
import Footer from "./footer"
import PassportTab from "./passport-tab"
import TimelineTab from "./timeline-tab"
import ChallengesTab from "./challenges-tab"
import ProfileTab from "./profile-tab"
import NewPassportModal from "./modals/new-passport-modal"
import NewCollectionModal from "./modals/new-collection-modal"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

const AppLayout = () => {
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState("passport")
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [showNewPassportModal, setShowNewPassportModal] = useState(false)
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false)
  const { initializeHaptics } = useHapticFeedback()

  useEffect(() => {
    initializeHaptics()

    // 뷰포트 높이 설정 함수
    const setAppHeight = () => {
      const doc = document.documentElement
      const appHeight = window.innerHeight
      doc.style.setProperty("--app-height", `${appHeight}px`)
    }

    // 초기 실행 및 이벤트 리스너 등록
    setAppHeight()
    window.addEventListener("resize", setAppHeight)
    window.addEventListener("orientationchange", setAppHeight)

    // Prevent body scrolling when splash screen is shown
    if (showSplash) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("resize", setAppHeight)
      window.removeEventListener("orientationchange", setAppHeight)
    }
  }, [initializeHaptics, showSplash])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)

    // Scroll to top when changing tabs
    window.scrollTo(0, 0)
  }

  const handleOpenModal = (modalId: string) => {
    if (modalId === "newPassportModal") {
      setShowNewPassportModal(true)
    } else if (modalId === "newCollectionModal") {
      setShowNewCollectionModal(true)
    }
  }

  return (
    <div
      className="app-container min-h-screen flex flex-col bg-cloud-white"
      style={{ height: "var(--app-height, 100vh)" }}
    >
      {showSplash ? (
        <SplashScreen
          onComplete={handleSplashComplete}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
      ) : (
        <>
          <Header activeTab={activeTab} onTabChange={handleTabChange} currentLanguage={currentLanguage} />
          <main className="flex-1 container mx-auto px-4 py-4 overflow-x-hidden overflow-y-auto">
            <div className="tab-container relative h-full">
              {activeTab === "passport" && (
                <PassportTab currentLanguage={currentLanguage} onOpenModal={handleOpenModal} />
              )}
              {activeTab === "timeline" && <TimelineTab currentLanguage={currentLanguage} />}
              {activeTab === "challenges" && (
                <ChallengesTab currentLanguage={currentLanguage} onOpenModal={handleOpenModal} />
              )}
              {activeTab === "profile" && <ProfileTab currentLanguage={currentLanguage} />}
            </div>
          </main>
          <Footer activeTab={activeTab} onTabChange={handleTabChange} currentLanguage={currentLanguage} />

          <NewPassportModal
            isOpen={showNewPassportModal}
            onClose={() => setShowNewPassportModal(false)}
            currentLanguage={currentLanguage}
          />

          <NewCollectionModal
            isOpen={showNewCollectionModal}
            onClose={() => setShowNewCollectionModal(false)}
            currentLanguage={currentLanguage}
          />
        </>
      )}
    </div>
  )
}

export default AppLayout
