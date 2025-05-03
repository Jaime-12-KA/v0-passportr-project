"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import PassportTabRedesign from "@/components/passport-tab-redesign"
import AchievementsTab from "@/components/achievements-tab"
import ChallengesTab from "@/components/challenges-tab"
import ProfileTab from "@/components/profile-tab"
import Notification from "@/components/notification"
import LevelUpModal from "@/components/modals/level-up-modal"
import ChallengeCompletedModal from "@/components/modals/challenge-completed-modal"
import NewCollectionModal from "@/components/modals/new-collection-modal"
import ImageViewerModal from "@/components/modals/image-viewer-modal"
import NewPassportModal from "@/components/modals/new-passport-modal"
import { initHaptics, triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import CheckInTabGPS from "@/components/check-in-tab-gps"
import "@/components/passport-styles.css"
import SettingsModal from "@/components/modals/settings-modal"
import { isLoggedIn } from "@/utils/auth-utils"
// Add the import for TimelineTab
import TimelineTab from "@/components/timeline-tab"

export default function Home() {
  const router = useRouter()
  // Update the activeTab state to include "timeline" as a possible value
  const [activeTab, setActiveTab] = useState(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      // First check URL parameters
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get("tab")

      if (tabParam) {
        return tabParam
      }

      // Then check localStorage
      const savedTab = localStorage.getItem("activeTab")
      if (savedTab) {
        // Clear the saved tab after reading it
        localStorage.removeItem("activeTab")
        return savedTab
      }
    }

    // Default tab if nothing is specified
    return "passport"
  })
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationText, setNotificationText] = useState("")
  const [showLevelUpModal, setShowLevelUpModal] = useState(false)
  const [showChallengeCompletedModal, setShowChallengeCompletedModal] = useState(false)
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false)
  const [showNewPassportModal, setShowNewPassportModal] = useState(false)
  const [showImageViewer, setShowImageViewer] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState("")
  const [distanceUnit, setDistanceUnit] = useState("km")
  const [isLoading, setIsLoading] = useState(true)
  const hapticInitialized = useRef(false)
  const audioInitialized = useRef(false)
  const [activePassports, setActivePassports] = useState<string[]>(["seoul", "bangkok", "busan", "jeju", "newyork"])
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [badgeDisplayMode, setBadgeDisplayMode] = useState("grid")
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [appVersion, setAppVersion] = useState("v2.0.0") // 버전 정보 추가

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isLoggedIn()
      setIsAuthenticated(authenticated)

      // If not authenticated and not in onboarding, redirect to onboarding
      if (!authenticated && window.location.pathname !== "/onboarding") {
        router.push("/onboarding")
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Themes array
  const themes = [
    {
      id: "default",
      name: currentLanguage === "en" ? "Default" : "기본",
      color: "#00A9E0",
      secondaryColor: "#FF6B6B",
      accentColor: "#FFD60A",
    },
    {
      id: "sunset",
      name: currentLanguage === "en" ? "Sunset" : "일몰",
      color: "#FF6B6B",
      secondaryColor: "#1D1D1F",
      accentColor: "#FFD60A",
    },
    {
      id: "forest",
      name: currentLanguage === "en" ? "Forest" : "숲",
      color: "#2E7D32",
      secondaryColor: "#1D1D1F",
      accentColor: "#FFD60A",
    },
    {
      id: "highlight-gold",
      name: currentLanguage === "en" ? "Highlight Gold" : "하이라이트 골드",
      color: "#FFD60A",
      secondaryColor: "#1D1D1F",
      accentColor: "#2E7D32",
    },
  ]

  // Function to initialize haptics and audio
  const initializeHapticsAndAudio = () => {
    // Initialize haptic feedback if not already initialized
    if (!hapticInitialized.current) {
      const result = initHaptics()
      console.log("Haptic initialization result:", result)
      hapticInitialized.current = true
    }

    // Initialize audio if not already initialized
    if (!audioInitialized.current) {
      try {
        // Create a silent audio context to enable audio
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContext) {
          const audioContext = new AudioContext()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          // Set volume to 0 (silent)
          gainNode.gain.value = 0

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          // Play for a very short time
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.001)

          audioInitialized.current = true
          console.log("Audio initialized")
        }
      } catch (error) {
        console.warn("Audio initialization failed:", error)
      }
    }
  }

  // Add event listeners for user interaction to initialize haptics and audio
  useEffect(() => {
    const handleUserInteraction = () => {
      initializeHapticsAndAudio()
    }

    // Add event listeners to common user interactions
    document.addEventListener("click", handleUserInteraction, { once: true })
    document.addEventListener("touchstart", handleUserInteraction, { once: true })
    document.addEventListener("keydown", handleUserInteraction, { once: true })

    // Try to initialize immediately (might work in some browsers)
    initializeHapticsAndAudio()

    return () => {
      // Clean up event listeners
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
    }
  }, [])

  // Add a global event listener to fix any potential issues with pointer events
  useEffect(() => {
    // localStorage에서 언어 설정 불러오기
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      // We always use 'kr' internally for Korean, regardless of what's stored
      setCurrentLanguage(savedLanguage === "ko" || savedLanguage === "kr" ? "kr" : savedLanguage)
    } else {
      // Set default language and save it
      const defaultLang = "en"
      setCurrentLanguage(defaultLang)
      localStorage.setItem("language", defaultLang)
    }
    // Function to ensure all tabs are interactive
    const ensureInteractivity = () => {
      // Reset any potential pointer-event issues
      document.querySelectorAll(".tab-content").forEach((tab) => {
        ;(tab as HTMLElement).style.pointerEvents = "auto"
      })

      // Ensure navigation buttons are clickable
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        ;(btn as HTMLElement).style.pointerEvents = "auto"
        ;(btn as HTMLElement).style.cursor = "pointer"
      })

      // Remove any classes that might interfere with pointer events
      document.body.classList.remove("modal-open")
    }

    // Call immediately
    ensureInteractivity()

    // Set up an interval to periodically check and fix interactivity
    // This is a failsafe to ensure the UI remains responsive
    const interactivityInterval = setInterval(ensureInteractivity, 1000)

    // Clean up on unmount
    return () => {
      clearInterval(interactivityInterval)
    }
  }, [])

  // URL 파라미터로 탭 전환 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get("tab")

    if (tabParam && ["passport", "check-in", "timeline", "achievements", "challenges", "profile"].includes(tabParam)) {
      setActiveTab(tabParam)
      // URL에서 파라미터 제거 (히스토리에 남지 않게)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleSwitchLanguage = (lang: string) => {
    // Ensure lang is either "en" or "kr"
    const normalizedLang = lang === "ko" ? "kr" : lang

    // Trigger haptic feedback on language switch
    triggerHapticFeedback(hapticPatterns.light)

    // Set language in the application state
    setCurrentLanguage(normalizedLang)

    // Store language in localStorage (always use "ko" for Korean in storage)
    localStorage.setItem("language", normalizedLang === "kr" ? "ko" : normalizedLang)

    console.log(
      `Language switched to: ${normalizedLang} (stored as: ${normalizedLang === "kr" ? "ko" : normalizedLang})`,
    )
  }

  const handleShowNotification = (text: string) => {
    // Trigger haptic feedback on notification
    triggerHapticFeedback(hapticPatterns.medium)
    setNotificationText(text)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const handleOpenModal = (modalId: string) => {
    // Trigger haptic feedback when opening modals
    triggerHapticFeedback(hapticPatterns.medium)

    switch (modalId) {
      case "levelUpModal":
        setShowLevelUpModal(true)
        break
      case "challengeCompletedModal":
        setShowChallengeCompletedModal(true)
        break
      case "newCollectionModal":
        setShowNewCollectionModal(true)
        break
      case "newPassportModal":
        setShowNewPassportModal(true)
        break
      default:
        break
    }
  }

  const handleAddPassport = (passportId: string) => {
    if (!activePassports.includes(passportId)) {
      setActivePassports([...activePassports, passportId])
      handleShowNotification(
        currentLanguage === "en" ? `New passport for ${passportId} added!` : `${passportId} 여권이 추가되었습니다!`,
      )
    }
  }

  const handleImageClick = (imageUrl: string) => {
    // Trigger haptic feedback on image click
    triggerHapticFeedback(hapticPatterns.light)
    setCurrentImageUrl(imageUrl)
    setShowImageViewer(true)
  }

  // Add function to handle opening settings
  const handleOpenSettings = () => {
    setShowSettingsModal(true)
    triggerHapticFeedback(hapticPatterns.medium)
  }

  // Also enhance the tab switching logic to ensure clean transitions
  const handleTabChange = (tabName: string) => {
    // Trigger haptic feedback on tab change
    triggerHapticFeedback(hapticPatterns.light)
    console.log("Tab change requested to:", tabName)

    // First, ensure all modals are closed
    setShowLevelUpModal(false)
    setShowChallengeCompletedModal(false)
    setShowNewCollectionModal(false)
    setShowNewPassportModal(false)
    setShowImageViewer(false)
    setShowSettingsModal(false)

    // Reset any potential pointer-event issues
    document.querySelectorAll(".tab-content").forEach((tab) => {
      ;(tab as HTMLElement).style.pointerEvents = "auto"
    })

    // URL에서 tab 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get("tab")

    // URL에 tab 파라미터가 있으면 해당 탭으로 설정
    if (tabParam && ["passport", "check-in", "timeline", "achievements", "challenges", "profile"].includes(tabParam)) {
      setActiveTab(tabParam)
      // URL에서 파라미터 제거 (히스토리에 남지 않게)
      window.history.replaceState({}, document.title, window.location.pathname)
    } else {
      // 일반적인 탭 변경
      setTimeout(() => {
        setActiveTab(tabName)
      }, 10)
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-light-gray">
        <div className="w-16 h-16 border-4 border-azure-radiance border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div
      className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl overflow-x-hidden bg-light-gray"
      style={{ maxWidth: "100%", width: "100%", overflowX: "hidden" }}
      onClick={() => {
        // This ensures haptics are initialized on any click within the app
        if (!hapticInitialized.current) {
          initializeHapticsAndAudio()
        }
      }}
    >
      {/* Update the Header component to pass the onOpenSettings prop */}
      <Header
        currentLanguage={currentLanguage}
        onSwitchLanguage={handleSwitchLanguage}
        onShowNotification={handleShowNotification}
        onTabChange={handleTabChange}
        onOpenSettings={handleOpenSettings}
      />

      <Navigation activeTab={activeTab} onTabChange={handleTabChange} currentLanguage={currentLanguage} />

      {/* Tab Content - Only render the active tab */}
      <div className="tab-content-container w-full overflow-x-hidden pb-20">
        {activeTab === "passport" && (
          <PassportTabRedesign currentLanguage={currentLanguage} onOpenModal={handleOpenModal} />
        )}
        {activeTab === "check-in" && (
          <CheckInTabGPS
            currentLanguage={currentLanguage}
            onImageClick={handleImageClick}
            distanceUnit={distanceUnit}
            activePassports={activePassports}
          />
        )}
        {activeTab === "timeline" && <TimelineTab currentLanguage={currentLanguage} />}
        {activeTab === "achievements" && (
          <AchievementsTab currentLanguage={currentLanguage} onTabChange={handleTabChange} />
        )}
        {activeTab === "challenges" && (
          <ChallengesTab currentLanguage={currentLanguage} onOpenModal={handleOpenModal} />
        )}
        {activeTab === "profile" && (
          <ProfileTab
            currentLanguage={currentLanguage}
            onSwitchLanguage={handleSwitchLanguage}
            distanceUnit={distanceUnit}
            setDistanceUnit={setDistanceUnit}
          />
        )}
        {/* 
<StampGuideWidget currentLanguage={currentLanguage} />
<StampCollectionPreview currentLanguage={currentLanguage} />
*/}
      </div>

      {/* Version info */}
      <div className="fixed bottom-20 right-2 text-xs text-stone-gray opacity-50">{appVersion}</div>

      {/* Modals - Only show when explicitly triggered */}
      {showNotification && (
        <Notification show={showNotification} text={notificationText} onClose={() => setShowNotification(false)} />
      )}
      {showLevelUpModal && <LevelUpModal isOpen={showLevelUpModal} onClose={() => setShowLevelUpModal(false)} />}
      {showChallengeCompletedModal && (
        <ChallengeCompletedModal
          isOpen={showChallengeCompletedModal}
          onClose={() => setShowChallengeCompletedModal(false)}
          currentLanguage={currentLanguage}
        />
      )}
      {showNewCollectionModal && (
        <NewCollectionModal
          isOpen={showNewCollectionModal}
          onClose={() => setShowNewCollectionModal(false)}
          currentLanguage={currentLanguage}
        />
      )}
      {showNewPassportModal && (
        <NewPassportModal
          isOpen={showNewPassportModal}
          onClose={() => setShowNewPassportModal(false)}
          currentLanguage={currentLanguage}
          activePassports={activePassports}
          onAddPassport={handleAddPassport}
        />
      )}
      {showImageViewer && (
        <ImageViewerModal
          isOpen={showImageViewer}
          onClose={() => setShowImageViewer(false)}
          imageUrl={currentImageUrl}
        />
      )}
      {/* Add the SettingsModal component to the modals section */}
      {showSettingsModal && (
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          currentLanguage={currentLanguage}
          onSwitchLanguage={handleSwitchLanguage}
          distanceUnit={distanceUnit}
          setDistanceUnit={setDistanceUnit}
          selectedTheme={selectedTheme || "default"}
          setSelectedTheme={(theme) => {
            // Apply theme logic here if needed
            const themeObj = themes.find((t) => t.id === theme)
            if (themeObj) {
              document.documentElement.style.setProperty("--azure-radiance", themeObj.color)
              document.documentElement.style.setProperty("--sunset-coral", themeObj.secondaryColor)
              document.documentElement.style.setProperty("--highlight-gold", themeObj.accentColor)
              setSelectedTheme(theme)
              localStorage.setItem("selectedTheme", theme)
            }
          }}
          badgeDisplayMode={badgeDisplayMode}
          setBadgeDisplayMode={setBadgeDisplayMode}
        />
      )}
    </div>
  )
}
