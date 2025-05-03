"use client"

import type React from "react"

import { type FC, useState, useEffect } from "react"
import {
  FaMapMarkerAlt,
  FaFilter,
  FaSearch,
  FaCoffee,
  FaUtensils,
  FaToriiGate,
  FaMusic,
  FaHome,
  FaCrown,
  FaExpand,
  FaTimes,
} from "react-icons/fa"
import StampModal from "./modals/stamp-modal"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

// Add distanceUnit prop to the component interface
interface CheckInTabProps {
  currentLanguage: string
  onImageClick: (imageUrl: string) => void
  distanceUnit?: string
}

interface Place {
  id: string
  name: {
    en: string
    kr: string
  }
  category: {
    en: string
    kr: string
  }
  description: {
    en: string
    kr: string
  }
  distance: string
  image: string
  stampColor: string
  stampIcon: string
}

// Update the component to use the distanceUnit prop
const CheckInTab: FC<CheckInTabProps> = ({ currentLanguage, onImageClick, distanceUnit = "km" }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [stampModalOpen, setStampModalOpen] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "fa-map-marker-alt":
        return <FaMapMarkerAlt className="text-white" />
      case "fa-torii-gate":
        return <FaToriiGate className="text-white" />
      case "fa-music":
        return <FaMusic className="text-white" />
      case "fa-house":
        return <FaHome className="text-white" />
      case "fa-utensils":
        return <FaUtensils className="text-white" />
      case "fa-coffee":
        return <FaCoffee className="text-white" />
      case "fa-crown":
        return <FaCrown className="text-white" />
      default:
        return <FaMapMarkerAlt className="text-white" />
    }
  }

  // Function to format distance based on unit preference
  const formatDistance = (kmDistance: string) => {
    if (distanceUnit === "mi") {
      // Convert km to miles (1 km ≈ 0.621371 miles)
      const km = Number.parseFloat(kmDistance.replace("km", ""))
      const miles = (km * 0.621371).toFixed(1)
      return `${miles}mi`
    }
    return kmDistance
  }

  // Update the places array to use the formatDistance function
  const places: Place[] = [
    {
      id: "place1",
      name: {
        en: "N Seoul Tower",
        kr: "N 서울타워",
      },
      category: {
        en: "Landmark",
        kr: "랜드마크",
      },
      description: {
        en: "Iconic communication tower offering panoramic views of Seoul",
        kr: "서울의 파노라마 전망을 제공하는 상징적인 통신탑",
      },
      distance: formatDistance("1.2km"),
      image: "/images/Check-in-N-tower.jpg",
      stampColor: "sky-blue",
      stampIcon: "fa-map-marker-alt",
    },
    {
      id: "place2",
      name: {
        en: "Gyeongbokgung Palace",
        kr: "경복궁",
      },
      category: {
        en: "Historical",
        kr: "역사",
      },
      description: {
        en: "The largest of the Five Grand Palaces built during the Joseon Dynasty",
        kr: "조선 시대에 지어진 5대 궁궐 중 가장 큰 궁궐",
      },
      distance: formatDistance("3.5km"),
      image: "/images/Check-in-Gyeongbokgung.jpg",
      stampColor: "deep-navy",
      stampIcon: "fa-crown",
    },
    {
      id: "place3",
      name: {
        en: "Hongdae Street",
        kr: "홍대 거리",
      },
      category: {
        en: "Entertainment",
        kr: "엔터테인먼트",
      },
      description: {
        en: "Vibrant area known for its urban arts and indie music culture",
        kr: "도시 예술과 인디 음악 문화로 유명한 활기찬 지역",
      },
      distance: formatDistance("4.8km"),
      image: "/images/Checkin_Hongdae Street.jpg",
      stampColor: "sunset-coral",
      stampIcon: "fa-music",
    },
    {
      id: "place4",
      name: {
        en: "Bukchon Hanok Village",
        kr: "북촌 한옥마을",
      },
      category: {
        en: "Cultural",
        kr: "문화",
      },
      description: {
        en: "Traditional Korean village with hundreds of hanok houses",
        kr: "수백 채의 한옥이 있는 전통 한국 마을",
      },
      distance: formatDistance("2.7km"),
      image: "/images/Checkin_Hanok Town.png",
      stampColor: "sunshine-yellow",
      stampIcon: "fa-house",
    },
    {
      id: "place5",
      name: {
        en: "Gwangjang Market",
        kr: "광장시장",
      },
      category: {
        en: "Food",
        kr: "음식",
      },
      description: {
        en: "Famous traditional market known for its street food and textiles",
        kr: "길거리 음식과 직물로 유명한 전통 시장",
      },
      distance: formatDistance("5.3km"),
      image: "/images/Checkin_Gwangjang Market.jpg",
      stampColor: "sunset-coral",
      stampIcon: "fa-utensils",
    },
    {
      id: "place6",
      name: {
        en: "Starbucks Myeongdong",
        kr: "스타벅스 명동점",
      },
      category: {
        en: "Cafe",
        kr: "카페",
      },
      description: {
        en: "Popular coffee shop with a view of Seoul Tower",
        kr: "서울타워가 보이는 인기 있는 커피숍",
      },
      distance: formatDistance("0.8km"),
      image: "/images/Checkin_Starbucks.png",
      stampColor: "sky-blue",
      stampIcon: "fa-coffee",
    },
  ]

  // Get all unique categories for filter
  const categories = ["all", ...new Set(places.map((place) => place.category[currentLanguage === "en" ? "en" : "kr"]))]

  // Fixed filter functionality
  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name[currentLanguage === "en" ? "en" : "kr"].toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description[currentLanguage === "en" ? "en" : "kr"].toLowerCase().includes(searchQuery.toLowerCase())

    if (activeCategory === "all") return matchesSearch
    return place.category[currentLanguage === "en" ? "en" : "kr"] === activeCategory && matchesSearch
  })

  const handleCheckIn = (place: Place, event: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger haptic feedback when user checks in - use strong pattern for better feedback
    triggerHapticFeedback(hapticPatterns.strong)

    // Get the button's position relative to the viewport
    const buttonRect = event.currentTarget.getBoundingClientRect()

    // Calculate position for the modal
    // We'll position it near the button but slightly offset to ensure visibility
    const position = {
      top: buttonRect.top + window.scrollY - 20, // Position slightly above the button
      left: buttonRect.left + buttonRect.width / 2 + window.scrollX, // Center horizontally with the button
    }

    setSelectedPlace(place)
    setStampModalOpen(true)

    // Pass the button position to the modal
    setModalPosition(position)
  }

  // 이미지 클릭 핸들러 수정
  const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
    e.preventDefault()
    e.stopPropagation()

    // Trigger haptic feedback on image click
    triggerHapticFeedback(hapticPatterns.light)

    onImageClick(imageUrl)
  }

  const handleCategoryChange = (category: string) => {
    // Trigger haptic feedback on category change
    triggerHapticFeedback(hapticPatterns.light)
    setActiveCategory(category)
  }

  return (
    <div className="tab-container">
      <div id="check-in" className={`tab-content ${isVisible ? "active" : ""}`}>
        <StampModal
          isOpen={stampModalOpen}
          onClose={() => {
            setStampModalOpen(false)
            setModalPosition(null) // Reset position when closing
          }}
          place={selectedPlace}
          currentLanguage={currentLanguage}
          position={modalPosition}
        />

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8 gap-3 sm:gap-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold serif-font">
              {currentLanguage === "en" ? "Check-in Nearby" : "주변 체크인"}
            </h2>
            <p className="text-stone-gray text-sm sm:text-base">
              {currentLanguage === "en"
                ? "Discover and check in at famous places to collect stamps"
                : "유명한 장소를 발견하고 체크인하여 스탬프를 수집하세요"}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-2 sm:px-4 sm:py-2 bg-sky-blue text-cloud-white rounded-lg btn-effect text-sm sm:text-base"
              onClick={() => {
                triggerHapticFeedback(hapticPatterns.medium)
                handleShowNotification(
                  currentLanguage === "en" ? "Finding nearby locations..." : "주변 위치 찾는 중...",
                )
              }}
            >
              <FaMapMarkerAlt className="inline mr-1" />
              <span>{currentLanguage === "en" ? "Near Me" : "내 주변"}</span>
            </button>
            <button
              className="px-3 py-2 sm:px-4 sm:py-2 bg-light-sand text-deep-navy rounded-lg btn-effect text-sm sm:text-base"
              onClick={() => {
                triggerHapticFeedback(hapticPatterns.light)
                setShowFilterModal(!showFilterModal)
              }}
            >
              <FaFilter className="inline mr-1" />
              <span>{currentLanguage === "en" ? "Filter" : "필터"}</span>
            </button>
          </div>
        </div>

        <div className="flex mb-4 sm:mb-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder={currentLanguage === "en" ? "Search places..." : "장소 검색..."}
              className="w-full px-4 py-2 sm:py-3 rounded-lg border border-light-sand focus:outline-none focus:border-sky-blue transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 hover-effect"
              onClick={() => triggerHapticFeedback(hapticPatterns.light)}
            >
              <FaSearch className="text-stone-gray" />
            </button>
          </div>
        </div>

        {/* Updated horizontal filter categories */}
        <div className="filter-categories mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-category mr-2 ${
                activeCategory === category
                  ? "active bg-brand-blue text-white"
                  : "bg-light-sand text-deep-navy hover:bg-light-sand/80"
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category === "all" ? (currentLanguage === "en" ? "All" : "전체") : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-cloud-white rounded-lg overflow-hidden border border-light-sand hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row p-3 sm:p-4">
                {/* 랜드마크 리스트의 이미지 부분 수정 */}
                <div className="w-full sm:w-20 h-40 sm:h-20 rounded-lg overflow-hidden mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 relative group">
                  <img
                    src={place.image || "/placeholder.svg"}
                    alt={place.name[currentLanguage === "en" ? "en" : "kr"]}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={(e) => handleImageClick(e, place.image)}
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200 cursor-pointer"
                    onClick={(e) => handleImageClick(e, place.image)}
                  >
                    <FaExpand className="text-white opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-200" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{place.name[currentLanguage === "en" ? "en" : "kr"]}</h3>
                    <span className="text-sm bg-light-sand px-2 py-1 rounded-full">{place.distance}</span>
                  </div>
                  <p className="text-stone-gray text-sm mb-2">
                    {place.category[currentLanguage === "en" ? "en" : "kr"]}
                  </p>
                  <p className="text-sm mb-3">{place.description[currentLanguage === "en" ? "en" : "kr"]}</p>
                </div>
              </div>
              <div className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 bg-light-sand bg-opacity-30 border-t border-light-sand">
                <div className="flex items-center">
                  <div
                    className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-${place.stampColor} flex items-center justify-center mr-2 shadow-sm`}
                    style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                  >
                    {getIconComponent(place.stampIcon)}
                  </div>
                  <span className="text-xs sm:text-sm font-medium whitespace-nowrap text-deep-navy">
                    {currentLanguage === "en" ? "Unique Stamp Available" : "고유 스탬프 사용 가능"}
                  </span>
                </div>
                <button
                  className="px-2 py-1 sm:px-4 sm:py-2 bg-sunset-coral text-cloud-white rounded-lg btn-effect text-xs sm:text-sm whitespace-nowrap"
                  onClick={(e) => handleCheckIn(place, e)}
                >
                  {currentLanguage === "en" ? "Check In" : "체크인"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recently Checked In */}
        <div className="bg-light-sand rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold serif-font mb-4">
            {currentLanguage === "en" ? "Recently Checked In" : "최근 체크인"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-cloud-white p-3 sm:p-4 rounded-lg">
              <div className="flex items-center mb-3">
                {/* 최근 체크인 섹션의 이미지 클릭 핸들러도 수정 */}
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 cursor-pointer"
                  onClick={(e) => handleImageClick(e, "/images/Checkin_Starbucks.png")}
                >
                  <img
                    src="/images/Checkin_Starbucks.png"
                    alt="Starbucks Myeongdong"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    {currentLanguage === "en" ? "Starbucks Myeongdong" : "스타벅스 명동점"}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-gray">{currentLanguage === "en" ? "Today" : "오늘"}</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-stone-gray">{currentLanguage === "en" ? "Earned" : "획득"}</span>
                <span className="font-medium">+50 XP</span>
              </div>
            </div>

            <div className="bg-cloud-white p-3 sm:p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 cursor-pointer"
                  onClick={(e) => handleImageClick(e, "/images/Checkin_Gwangjang Market.jpg")}
                >
                  <img
                    src="/images/Checkin_Gwangjang Market.jpg"
                    alt="Gwangjang Market"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    {currentLanguage === "en" ? "Gwangjang Market" : "광장시장"}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-gray">
                    {currentLanguage === "en" ? "Yesterday" : "어제"}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-stone-gray">{currentLanguage === "en" ? "Earned" : "획득"}</span>
                <span className="font-medium">+75 XP</span>
              </div>
            </div>

            <div className="bg-cloud-white p-3 sm:p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 cursor-pointer"
                  onClick={(e) => handleImageClick(e, "/images/Check-in-Gyeongbokgung.jpg")}
                >
                  <img
                    src="/images/Check-in-Gyeongbokgung.jpg"
                    alt="Gyeongbokgung Palace"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    {currentLanguage === "en" ? "Gyeongbokgung Palace" : "경복궁"}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-gray">
                    {currentLanguage === "en" ? "3 days ago" : "3일 전"}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-stone-gray">{currentLanguage === "en" ? "Earned" : "획득"}</span>
                <span className="font-medium">+100 XP</span>
              </div>
            </div>
          </div>
        </div>
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-cloud-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{currentLanguage === "en" ? "Filter Places" : "장소 필터링"}</h3>
                <button className="text-stone-gray hover:text-deep-navy" onClick={() => setShowFilterModal(false)}>
                  <FaTimes />
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">{currentLanguage === "en" ? "Categories" : "카테고리"}</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="radio"
                        id={category}
                        name="category"
                        checked={activeCategory === category}
                        onChange={() => {
                          handleCategoryChange(category)
                          // Don't close the modal yet to allow multiple selections
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={category}>
                        {category === "all" ? (currentLanguage === "en" ? "All" : "전체") : category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">{currentLanguage === "en" ? "Distance" : "거리"}</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="radio" id="nearby" name="distance" className="mr-2" />
                    <label htmlFor="nearby">
                      {currentLanguage === "en" ? "Nearby (< 1km)" : "가까운 거리 (< 1km)"}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="medium" name="distance" className="mr-2" />
                    <label htmlFor="medium">{currentLanguage === "en" ? "Medium (< 3km)" : "중간 거리 (< 3km)"}</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="far" name="distance" className="mr-2" />
                    <label htmlFor="far">{currentLanguage === "en" ? "Far (< 5km)" : "먼 거리 (< 5km)"}</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="any" name="distance" checked className="mr-2" />
                    <label htmlFor="any">{currentLanguage === "en" ? "Any distance" : "모든 거리"}</label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  className="flex-1 py-2 bg-light-sand text-deep-navy rounded-lg"
                  onClick={() => {
                    // Reset filters
                    setActiveCategory("all")
                    setShowFilterModal(false)
                  }}
                >
                  {currentLanguage === "en" ? "Reset" : "초기화"}
                </button>
                <button
                  className="flex-1 py-2 bg-sky-blue text-cloud-white rounded-lg"
                  onClick={() => {
                    // Apply filters and close modal
                    setShowFilterModal(false)
                    // Trigger haptic feedback
                    triggerHapticFeedback(hapticPatterns.medium)
                  }}
                >
                  {currentLanguage === "en" ? "Apply" : "적용"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to show notifications
const handleShowNotification = (text: string) => {
  // This is a placeholder - the actual implementation would be in the parent component
  console.log("Notification:", text)
}

export default CheckInTab
