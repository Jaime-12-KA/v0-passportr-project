"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { FaPassport, FaMapMarkedAlt, FaGlobe, FaPlus, FaGlobeAsia, FaImage } from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import CitySection from "./city-section"
import VisaPage from "./visa-page"
import { FlipHorizontal2, Stamp } from "lucide-react"
import NewPassportModal from "@/components/modals/new-passport-modal"
import { useSwipeable } from "react-swipeable"
import NewAlbumModal from "@/components/modals/new-album-modal"
import AlbumDetailView from "./album-detail-view"
import "./passport-flip.css"
import { useRouter } from "next/navigation"

interface PassportTabProps {
  currentLanguage: string
  onOpenModal?: (modalId: string) => void
}

const PassportTabRedesign = ({ currentLanguage, onOpenModal }: PassportTabProps) => {
  const router = useRouter()
  const [isPassportOpen, setIsPassportOpen] = useState(false)
  const [activeCityIndex, setActiveCityIndex] = useState(0)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [isInitialRender, setIsInitialRender] = useState(true)
  const [sliderRef] = useState(useRef<HTMLDivElement>(null))
  const [viewingIdentity, setViewingIdentity] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [viewingVisaPage, setViewingVisaPage] = useState(false)
  const [showNewPassportModal, setShowNewPassportModal] = useState(false)
  const [activeCity, setActiveCity] = useState(0)
  const [activePassports, setActivePassports] = useState(["seoul", "busan", "jeju", "bangkok"])
  const [showNewAlbumModal, setShowNewAlbumModal] = useState(false)

  const getAlbumName = (id: string, lang: string) => {
    switch (id) {
      case "album1":
        return lang === "en" ? "Seoul Cafe Hopping '25" : "서울 카페 유랑"
      case "album2":
        return lang === "en" ? "My Favorite Independent Bookstores" : "내가 사랑한 독립서점들"
      case "album3":
        return lang === "en" ? "2025 Europe Trip" : "2025년 유럽 여행"
      default:
        return lang === "en" ? "New Album" : "새 앨범"
    }
  }

  const [albums, setAlbums] = useState([
    {
      id: "album1",
      name: getAlbumName("album1", currentLanguage),
      coverImage: "/images/cafegongmyung.png",
      itemCount: 8,
    },
    {
      id: "album2",
      name: getAlbumName("album2", currentLanguage),
      coverImage: "/images/goyoseosa.jpg",
      itemCount: 12,
    },
    {
      id: "album3",
      name: getAlbumName("album3", currentLanguage),
      coverImage: "/images/guellpark.jpg",
      itemCount: 5,
    },
  ])

  // currentLanguage가 변경될 때 앨범 이름도 업데이트하도록 useEffect 추가
  useEffect(() => {
    setAlbums((prevAlbums) =>
      prevAlbums.map((album) => ({
        ...album,
        name: getAlbumName(album.id, currentLanguage),
      })),
    )
  }, [currentLanguage])

  const [selectedAlbum, setSelectedAlbum] = useState<{
    id: string
    name: string
    coverImage: string
    itemCount: number
  } | null>(null)

  // First render handling
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false)
    }
  }, [isInitialRender])

  // Saved theme loading
  useEffect(() => {
    const savedTheme = localStorage.getItem("passportTheme")
    if (savedTheme) {
      // Apply theme logic here if needed
    }
  }, [])

  // City data
  const cities = [
    {
      id: "seoul",
      name: currentLanguage === "en" ? "Seoul" : "서울",
      country: currentLanguage === "en" ? "South Korea" : "대한민국",
      image: "/images/cover_seoul.png",
      stamps: 24,
      totalStamps: 35,
      lastVisited: currentLanguage === "en" ? "2 days ago" : "2일 전",
    },
    {
      id: "busan",
      name: currentLanguage === "en" ? "Busan" : "부산",
      country: currentLanguage === "en" ? "South Korea" : "대한민국",
      image: "/images/cover_busan.png",
      stamps: 8,
      totalStamps: 20,
      lastVisited: currentLanguage === "en" ? "1 month ago" : "1개월 전",
    },
    {
      id: "bangkok",
      name: currentLanguage === "en" ? "Bangkok" : "방콕",
      country: currentLanguage === "en" ? "Thailand" : "태국",
      image: "/images/cover_bangkok.png",
      stamps: 12,
      totalStamps: 28,
      lastVisited: currentLanguage === "en" ? "2 weeks ago" : "2주 전",
    },
    {
      id: "newyork",
      name: currentLanguage === "en" ? "New York" : "뉴욕",
      country: currentLanguage === "en" ? "United States" : "미국",
      image: "/images/cover_newyork.png",
      stamps: 3,
      totalStamps: 25,
      lastVisited: currentLanguage === "en" ? "6 months ago" : "6개월 전",
    },
    {
      id: "jeju",
      name: currentLanguage === "en" ? "Jeju Island" : "제주도",
      country: currentLanguage === "en" ? "South Korea" : "대한민국",
      image: "/images/cover_jeju.png",
      stamps: 0,
      totalStamps: 18,
      lastVisited: currentLanguage === "en" ? "3 months ago" : "3개월 전",
    },
  ]

  const handleCitySelect = (cityId: string) => {
    triggerHapticFeedback(hapticPatterns.medium)
    setSelectedCity(cityId)
  }

  const handleBackToPassport = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setSelectedCity(null)
  }

  const scrollLeft = () => {
    if (sliderRef.current && activeCityIndex > 0) {
      triggerHapticFeedback(hapticPatterns.light)
      setActiveCityIndex(activeCityIndex - 1)
    }
  }

  const scrollRight = () => {
    if (sliderRef.current && activeCityIndex < cities.length - 1) {
      triggerHapticFeedback(hapticPatterns.light)
      setActiveCityIndex(activeCityIndex + 1)
    }
  }

  const handleAddNewPassport = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setShowNewPassportModal(true)
  }

  const handleAddAlbum = (albumName: string, coverImage: string) => {
    const newAlbum = {
      id: `album${albums.length + 1}`,
      name: albumName,
      coverImage: coverImage,
      itemCount: 0,
    }
    setAlbums([...albums, newAlbum])
  }

  const handleOpenNewAlbumModal = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setShowNewAlbumModal(true)
  }

  const getCurrentDate = () => {
    const date = new Date()
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()
  }

  const getExpiryDate = () => {
    const date = new Date()
    date.setFullYear(date.getFullYear() + 10)
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()
  }

  // Fix the toggle identity page function to properly show the welcome page
  const handleToggleIdentityPage = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setIsFlipped(!isFlipped)

    // 애니메이션이 완료된 후 viewingIdentity 상태를 업데이트합니다
    setTimeout(() => {
      if (isFlipped) {
        // 플립이 되어 있는 상태에서 다시 플립하면 viewingIdentity를 false로 설정
        setViewingIdentity(false)
      } else {
        // 플립이 안 되어 있는 상태에서 플립하면 viewingIdentity를 true로 설정
        setViewingIdentity(true)
      }
    }, 300) // 애니메이션 지속 시간의 절반
  }

  const handleToggleVisaPage = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setViewingVisaPage(!viewingVisaPage)

    // If we were viewing the identity page, reset it
    if (viewingIdentity) {
      setViewingIdentity(false)
      setIsFlipped(false)
    }
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeCityIndex < cities.length - 1) {
        triggerHapticFeedback(hapticPatterns.light)
        setActiveCityIndex(activeCityIndex + 1)
      }
    },
    onSwipedRight: () => {
      if (activeCityIndex > 0) {
        triggerHapticFeedback(hapticPatterns.light)
        setActiveCityIndex(activeCityIndex - 1)
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
    delta: 10,
    swipeDuration: 500,
    touchEventOptions: { passive: false },
  })

  const renderIdentityPage = () => {
    const cityTheme = {
      pageColor: "#f8f3e2",
      fontFamily: "Arial",
      pattern: "",
    }

    return (
      <div
        className="identity-page"
        style={{
          backgroundColor: cityTheme.pageColor,
          fontFamily: cityTheme.fontFamily,
          backgroundImage: cityTheme.pattern,
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
        }}
      >
        {/* Passport header */}
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div>
            <h3 className="text-sm font-bold text-deep-navy">PASSPORT / 여권</h3>
          </div>
          <div>
            <h3 className="text-sm font-bold text-deep-navy">PASSPORTR</h3>
          </div>
        </div>

        {/* Main content with photo on left, details on right (mobile-friendly) */}
        <div className="flex flex-row gap-4 relative z-10">
          {/* Left Side - Photo */}
          <div className="w-1/3 sm:w-1/4">
            <div className="w-full aspect-[3/4] overflow-hidden bg-white p-1 border border-gray-300 mb-2">
              <Image
                src="/images/jaime-sung-resized.png"
                alt="User Avatar"
                width={120}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-brand-yellow text-deep-navy text-xs font-bold px-2 py-1 rounded text-center">
              EXPLORER
            </div>
          </div>

          {/* Right Side - Passport Details */}
          <div className="w-2/3 sm:w-3/4 space-y-2 text-sm">
            <div>
              <p className="text-xs text-brand-blue font-medium">SURNAME / 성</p>
              <p className="font-bold text-deep-navy">SUNG</p>
            </div>

            <div>
              <p className="text-xs text-brand-blue font-medium">GIVEN NAME / 이름</p>
              <p className="font-bold text-deep-navy">JAIME</p>
            </div>

            <div>
              <p className="text-xs text-brand-blue font-medium">PASSPORT NO. / 여권 번호</p>
              <p className="font-bold text-deep-navy">PTR-2023-JS</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-brand-blue font-medium">DATE OF ISSUE / 발급일</p>
                <p className="font-bold text-deep-navy text-sm">{getCurrentDate()}</p>
              </div>

              <div>
                <p className="text-xs text-brand-blue font-medium">DATE OF EXPIRY / 만료일</p>
                <p className="font-bold text-deep-navy text-sm">{getExpiryDate()}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-brand-blue font-medium">NATIONALITY / 국적</p>
              <p className="font-bold text-deep-navy">GLOBAL EXPLORER</p>
            </div>
          </div>
        </div>

        {/* Machine Readable Zone */}
        <div className="mt-6 pt-4 border-t border-gray-300 font-mono text-xs tracking-wider text-deep-navy opacity-70">
          P&lt;PTREXPLORER&lt;&lt;JAIME&lt;&lt;SUNG&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          <br />
          PTR2023JS1234567890&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
        </div>
      </div>
    )
  }

  const renderWelcomePage = () => {
    return (
      <div className="welcome-page bg-[#f8f3e2] p-5 h-full rounded-xl relative overflow-hidden">
        {/* Background pattern - subtle security pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="securityPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="#000" />
              <path d="M0,10 L20,10 M10,0 L10,20" stroke="#000" strokeWidth="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#securityPattern)" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Korean Text First */}
          <div className="mb-6 text-sm text-deep-navy">
            <p className="mb-4">
              Passportr는 이 여권의 주인이자 자신만의 세상의 탐험가인 당신을 끝없는 모험으로 초대합니다. 주저 없이
              소중한 순간들을 수집하고, 진정한 경험으로 이 페이지들을 채우며, 당신만의 고유하고 생생한 여정의 이야기를
              엮어 나가십시오. 이 여권이 당신의 가장 믿음직한 동반자이자 가장 아름다운 기록 보관소가 되기를 바랍니다.
            </p>
            <p className="font-medium italic">당신의 이야기가 기다립니다.</p>
          </div>

          {/* Divider with small emblem */}
          <div className="flex items-center justify-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="mx-4 text-brand-blue">
              <FaGlobe size={16} />
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* English Text */}
          <div className="text-sm text-deep-navy">
            <p className="mb-4">
              Passportr hereby invites the bearer, the designated explorer of their own world, to venture forth with
              curiosity and wonder. May you collect moments without hesitation, fill these pages with genuine
              experiences, and weave the unique and vibrant narrative of your personal journey. Let this passport be
              your trusted companion and your beautiful archive.
            </p>
            <p className="font-medium italic">Your story awaits.</p>
          </div>

          {/* Official Signature and Stamp at bottom */}
          <div className="mt-8 pt-4 border-t border-gray-300 flex justify-between items-center">
            <div className="font-bold text-brand-blue">PASSPORTR</div>
            <div className="w-24 h-24 relative">
              <Image
                src="/images/official-passportr-seal.png"
                alt="Official Passportr Seal"
                width={96}
                height={96}
                className="w-full h-full object-contain transform rotate-6"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleAddPassport = () => {
    // Logic to add a new passport
    console.log("Adding a new passport")
  }

  const handleTogglePassport = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setIsPassportOpen(!isPassportOpen)

    // Reset identity view when closing passport
    if (isPassportOpen) {
      setViewingIdentity(false)
      setIsFlipped(false)
      setViewingVisaPage(false)
    }
  }

  const handleAlbumSelect = (album: { id: string; name: string; coverImage: string; itemCount: number }) => {
    triggerHapticFeedback(hapticPatterns.medium)
    setSelectedAlbum(album)
  }

  const handleBackFromAlbum = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setSelectedAlbum(null)
  }

  if (selectedCity) {
    return <CitySection cityId={selectedCity} currentLanguage={currentLanguage} onBack={handleBackToPassport} />
  }

  if (selectedAlbum) {
    return (
      <AlbumDetailView
        albumId={selectedAlbum.id}
        albumName={selectedAlbum.name}
        coverImage={selectedAlbum.coverImage}
        itemCount={selectedAlbum.itemCount}
        onBack={handleBackFromAlbum}
        currentLanguage={currentLanguage}
      />
    )
  }

  return (
    <div id="passport" className="tab-content active">
      <AnimatePresence mode="wait">
        {!isPassportOpen ? (
          // Passport Cover (Closed State)
          <motion.div
            key="passport-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="passport-cover-container"
          >
            <div className="relative w-full max-w-md mx-auto mb-6">
              {/* Passport Cover */}
              <div
                className="passport-cover relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
                onClick={handleTogglePassport}
                style={{ aspectRatio: "3/4" }}
              >
                {/* Cover Image */}
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <img
                    src="/images/new-cover-classic.png" // Updated to classic blue
                    alt="Passportr main cover"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      opacity: 1.0,
                      filter: "saturate(1.2) brightness(1.1)",
                    }}
                  />
                </div>

                {/* User Name */}
                <div className="absolute bottom-10 left-0 right-0 text-center">
                  <h2 className="text-xl font-bold text-cloud-white drop-shadow-lg">Jaime Sung</h2>
                </div>

                {/* Tap to open hint */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-sm text-cloud-white opacity-80">
                    {currentLanguage === "en" ? "Tap to open" : "탭하여 열기"}
                  </p>
                </div>
              </div>

              {/* Passport Edge Effect */}
              <div className="absolute -bottom-2 left-1 right-1 h-4 bg-brand-navy rounded-b-xl shadow-lg"></div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="passport-open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="passport-open-container"
          >
            {/* Passport Header with Close Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold serif-font">{currentLanguage === "en" ? "My Passport" : "내 여권"}</h2>
              <div className="flex space-x-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-light-sand flex items-center justify-center"
                  onClick={handleToggleIdentityPage}
                  aria-label={currentLanguage === "en" ? "Flip Passport" : "여권 뒤집기"}
                >
                  <FlipHorizontal2 className="text-deep-navy" size={20} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-light-sand flex items-center justify-center"
                  onClick={handleToggleVisaPage}
                  aria-label={currentLanguage === "en" ? "View Visa Page" : "비자 페이지 보기"}
                >
                  <Stamp className="text-deep-navy" size={20} />
                </motion.button>
                <button
                  className="w-10 h-10 rounded-full bg-light-sand flex items-center justify-center"
                  onClick={handleTogglePassport}
                >
                  <FaPassport className="text-deep-navy" />
                </button>
              </div>
            </div>

            {/* Conditionally render either Identity Page or City Navigation */}
            {viewingIdentity ? (
              <div className="passport-identity-container h-[500px] mb-6">
                <div className={`passport-flip-container ${isFlipped ? "flipped" : ""}`}>
                  <div className="passport-flipper">
                    <div className="passport-front">{renderIdentityPage()}</div>
                    <div className="passport-back">{renderWelcomePage()}</div>
                  </div>
                </div>
              </div>
            ) : viewingVisaPage ? (
              <VisaPage currentLanguage={currentLanguage} onBack={handleToggleVisaPage} />
            ) : (
              <>
                {/* Identity Page - Redesigned to look like a real passport */}
                <div className="bg-[#f8f3e2] rounded-xl p-5 shadow-sm mb-6 border border-light-sand relative overflow-hidden">
                  {/* Background pattern - subtle map contour lines */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <pattern id="contourPattern" width="300" height="300" patternUnits="userSpaceOnUse">
                        <path
                          d="M0,100 C50,50 150,50 200,100 S350,150 400,100"
                          fill="none"
                          stroke="#000"
                          strokeWidth="0.5"
                        />
                        <path d="M0,200 C50,150 150,150 200,200 S350,250 400,200" fill="none" strokeWidth="0.5" />
                        <path d="M100,0 C50,50 50,150 100,200 S150,350 100,400" fill="none" strokeWidth="0.5" />
                        <path d="M200,0 C150,50 150,150 200,200 S250,350 200,400" fill="none" strokeWidth="0.5" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#contourPattern)" />
                    </svg>
                  </div>

                  {/* Skyline silhouette at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10 pointer-events-none">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 800 100"
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0,100 L0,70 L20,70 L20,60 L40,60 L40,80 L60,80 L60,40 L80,40 L80,60 L100,60 L100,50 L120,50 L120,40 L140,40 L140,30 L160,30 L160,50 L180,50 L180,60 L200,60 L200,40 L220,40 L220,50 L240,50 L240,30 L260,30 L260,40 L280,40 L280,20 L300,20 L300,40 L320,40 L320,30 L340,30 L340,50 L360,50 L360,60 L380,60 L380,50 L400,50 L400,30 L420,30 L420,40 L440,40 L440,20 L460,20 L460,50 L480,50 L480,60 L500,60 L500,40 L520,40 L520,50 L540,50 L540,30 L560,30 L560,40 L580,40 L580,20 L600,20 L600,40 L620,40 L620,50 L640,50 L640,60 L660,60 L660,70 L680,70 L680,50 L700,50 L700,60 L720,60 L720,70 L740,70 L740,60 L760,60 L760,70 L780,70 L780,60 L800,60 L800,100 Z"
                        fill="#000"
                      />
                    </svg>
                  </div>

                  {/* Passport header */}
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <div>
                      <h3 className="text-sm font-bold text-deep-navy">PASSPORT / 여권</h3>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-deep-navy">PASSPORTR</h3>
                    </div>
                  </div>

                  {/* Main content with photo on left, details on right (mobile-friendly) */}
                  <div className="flex flex-row gap-4 relative z-10">
                    {/* Left Side - Photo */}
                    <div className="w-1/3 sm:w-1/4">
                      <div className="w-full aspect-[3/4] overflow-hidden bg-white p-1 border border-gray-300 mb-2">
                        <Image
                          src="/images/jaime-sung-resized.png"
                          alt="User Avatar"
                          width={120}
                          height={160}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="bg-brand-yellow text-deep-navy text-xs font-bold px-2 py-1 rounded text-center">
                        EXPLORER
                      </div>
                    </div>

                    {/* Right Side - Passport Details */}
                    <div className="w-2/3 sm:w-3/4 space-y-2 text-sm">
                      <div>
                        <p className="text-xs text-brand-blue font-medium">SURNAME / 성</p>
                        <p className="font-bold text-deep-navy">SUNG</p>
                      </div>

                      <div>
                        <p className="text-xs text-brand-blue font-medium">GIVEN NAME / 이름</p>
                        <p className="font-bold text-deep-navy">JAIME</p>
                      </div>

                      <div>
                        <p className="text-xs text-brand-blue font-medium">PASSPORT NO. / 여권 번호</p>
                        <p className="font-bold text-deep-navy">PTR-2023-JS</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-brand-blue font-medium">DATE OF ISSUE / 발급일</p>
                          <p className="font-bold text-deep-navy text-sm">{getCurrentDate()}</p>
                        </div>

                        <div>
                          <p className="text-xs text-brand-blue font-medium">DATE OF EXPIRY / 만료일</p>
                          <p className="font-bold text-deep-navy text-sm">{getExpiryDate()}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-brand-blue font-medium">NATIONALITY / 국적</p>
                        <p className="font-bold text-deep-navy">GLOBAL EXPLORER</p>
                      </div>
                    </div>
                  </div>

                  {/* Machine Readable Zone */}
                  <div className="mt-6 pt-4 border-t border-gray-300 font-mono text-xs tracking-wider text-deep-navy opacity-70">
                    P&lt;PTREXPLORER&lt;&lt;JAIME&lt;&lt;SUNG&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                    <br />
                    PTR2023JS1234567890&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  </div>
                </div>

                {/* City Navigation Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold serif-font">
                      {currentLanguage === "en" ? "My Cities" : "내 도시"}
                    </h3>
                    <button
                      className="px-3 py-1 bg-light-sand text-deep-navy rounded-lg flex items-center hover:bg-stone-gray hover:text-white transition-colors text-sm"
                      onClick={handleAddNewPassport}
                    >
                      <FaPlus className="mr-1" />
                      <span>{currentLanguage === "en" ? "Add New City" : "새로운 도시 추가"}</span>
                    </button>
                  </div>

                  <div className="relative overflow-hidden" {...swipeHandlers}>
                    <div
                      ref={sliderRef}
                      className="flex transition-transform duration-300 ease-out"
                      style={{ transform: `translateX(-${activeCityIndex * 100}%)` }}
                    >
                      {cities.map((city, index) => (
                        <div key={city.id} className="w-full flex-shrink-0 px-1">
                          <motion.div
                            className="city-card bg-white rounded-xl overflow-hidden shadow-sm border border-light-sand cursor-pointer"
                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                            onClick={() => handleCitySelect(city.id)}
                            animate={{
                              scale: activeCityIndex === index ? 1 : 0.95,
                              opacity: activeCityIndex === index ? 1 : 0.7,
                            }}
                          >
                            <div className="relative h-48">
                              <Image
                                src={city.image || "/placeholder.svg"}
                                alt={city.name}
                                fill
                                className="object-cover"
                                priority={index === 0} // 첫 번째 이미지는 우선 로드
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                              {/* 메인 화면의 도시 카드에서도 도시 이름 색상을 cloud-white로 변경 */}
                              <div className="absolute bottom-0 left-0 p-4 text-cloud-white">
                                <h3 className="text-2xl font-bold">{city.name}</h3>
                                <p>{city.country}</p>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center">
                                  <FaMapMarkedAlt className="text-brand-coral mr-2" />
                                  <span className="font-medium">
                                    {city.stamps}/{city.totalStamps} {currentLanguage === "en" ? "Stamps" : "스탬프"}
                                  </span>
                                </div>
                                <div className="text-sm text-stone-gray">{city.lastVisited}</div>
                              </div>
                              <div className="progress-bar mb-3">
                                <div
                                  className="progress-fill bg-brand-coral"
                                  style={{ width: `${(city.stamps / city.totalStamps) * 100}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center text-sm text-stone-gray">
                                  <FaGlobeAsia className="mr-1" />
                                  <span>
                                    {currentLanguage === "en" ? "Last visited" : "마지막 방문"}: {city.lastVisited}
                                  </span>
                                </div>
                                <div className="text-[#1E88E5] font-medium text-sm">
                                  {currentLanguage === "en" ? "View Details" : "상세 보기"} →
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    {cities.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full mx-1 ${activeCityIndex === index ? "bg-brand-blue" : "bg-light-sand"}`}
                        onClick={() => {
                          triggerHapticFeedback(hapticPatterns.light)
                          setActiveCityIndex(index)
                        }}
                      />
                    ))}
                  </div>
                </div>
                {/* My Albums Section */}
                <div className="mb-6 mt-8 pt-6 border-t border-light-sand">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold serif-font">
                      {currentLanguage === "en" ? "My Albums" : "내 앨범"}
                    </h3>
                    <button
                      className="px-3 py-1 bg-light-sand text-deep-navy rounded-lg flex items-center hover:bg-stone-gray hover:text-white transition-colors text-sm"
                      onClick={handleOpenNewAlbumModal}
                    >
                      <FaPlus className="mr-1" />
                      <span>{currentLanguage === "en" ? "New Album" : "새 앨범"}</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto pb-4 -mx-4 px-4">
                    <div className="flex space-x-4">
                      {albums.map((album) => (
                        <div key={album.id} className="flex-shrink-0 w-40">
                          <motion.div
                            className="bg-white rounded-xl overflow-hidden shadow-sm border border-light-sand cursor-pointer"
                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                            onClick={() => handleAlbumSelect(album)}
                          >
                            <div className="relative h-32">
                              <Image
                                src={album.coverImage || "/placeholder.svg"}
                                alt={album.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-sm line-clamp-2 h-10">{album.name}</h4>
                              <div className="flex items-center text-xs text-stone-gray mt-1">
                                <FaImage className="mr-1" />
                                <span>
                                  {album.itemCount} {currentLanguage === "en" ? "items" : "항목"}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      ))}

                      <div className="flex-shrink-0 w-40">
                        <motion.div
                          className="h-full bg-light-sand rounded-xl border border-dashed border-stone-gray cursor-pointer flex flex-col items-center justify-center p-4"
                          whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)" }}
                          onClick={handleOpenNewAlbumModal}
                        >
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2">
                            <FaPlus className="text-brand-blue" />
                          </div>
                          <p className="text-center text-sm font-medium">
                            {currentLanguage === "en" ? "Create New Album" : "새 앨범 만들기"}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <NewPassportModal
        isOpen={showNewPassportModal}
        onClose={() => setShowNewPassportModal(false)}
        currentLanguage={currentLanguage}
        activePassports={activePassports}
        onAddPassport={handleAddPassport}
      />
      <NewAlbumModal
        isOpen={showNewAlbumModal}
        onClose={() => setShowNewAlbumModal(false)}
        currentLanguage={currentLanguage}
        onAddAlbum={handleAddAlbum}
      />
    </div>
  )
}

export default PassportTabRedesign
