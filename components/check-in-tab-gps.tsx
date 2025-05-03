"use client"

import type React from "react"
import { type FC, useState, useEffect, useRef } from "react"
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
  FaExclamationTriangle,
  FaStar,
  FaCompass,
} from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import { useRouter } from "next/navigation"

interface CheckInTabGPSProps {
  currentLanguage: string
  onImageClick: (imageUrl: string) => void
  distanceUnit?: string
  activePassports: string[]
  onOpenModal?: (modalId: string) => void
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
  checkIns: number
  recommendationScore: number
}

const CheckInTabGPS: FC<CheckInTabGPSProps> = ({
  currentLanguage,
  onImageClick,
  distanceUnit = "km",
  activePassports = ["seoul", "bangkok", "busan"],
  onOpenModal,
}) => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [currentCity, setCurrentCity] = useState<string | null>("seoul")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const formatDistance = (kmDistance: string) => {
    if (distanceUnit === "mi") {
      const km = Number.parseFloat(kmDistance.replace("km", ""))
      const miles = (km * 0.621371).toFixed(1)
      return `${miles}mi`
    }
    return kmDistance
  }

  const seoulPlaces = [
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
      checkIns: 125,
      recommendationScore: 4.5,
      stampImage: "/images/n-seoultower.png",
      localTip: {
        en: "Visit during sunset for the most beautiful view of Seoul. There's also a love lock area where couples attach padlocks as a symbol of their love.",
        kr: "일몰 시간에 방문하면 서울의 가장 아름다운 전경을 볼 수 있습니다. 연인들이 사랑의 상징으로 자물쇠를 다는 '사랑의 자물쇠' 구역도 있습니다.",
      },
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
      checkIns: 89,
      recommendationScore: 4.2,
      stampImage: "/images/gyeongbokgung.png",
      localTip: {
        en: "Try to catch the changing of the royal guard ceremony which happens multiple times daily. Wearing traditional Korean hanbok gives you free entry!",
        kr: "하루에 여러 번 진행되는 왕궁 수비대 교대식을 놓치지 마세요. 한복을 입으면 무료로 입장할 수 있습니다!",
      },
    },
    {
      id: "place3",
      name: {
        en: "Bukchon Hanok Village",
        kr: "북촌 한옥마을",
      },
      category: {
        en: "Cultural",
        kr: "문화",
      },
      description: {
        en: "A traditional Korean village with hundreds of hanok houses",
        kr: "수백 채의 한옥이 있는 전통 한국 마을",
      },
      distance: formatDistance("2.7km"),
      image: "/images/Checkin_Hanok Town.png",
      stampColor: "sunshine-yellow",
      stampIcon: "fa-home",
      checkIns: 67,
      recommendationScore: 4.0,
      stampImage: "/images/bukchon.png",
      localTip: {
        en: "This is a residential area, so please be quiet when visiting. The best views are from the top of the hill looking down at the traditional rooftops.",
        kr: "이곳은 주거 지역이므로 방문 시 조용히 해주세요. 언덕 위에서 내려다보는 전통 지붕의 전경이 가장 아름답습니다.",
      },
    },
    {
      id: "place4",
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
      checkIns: 112,
      recommendationScore: 4.3,
      stampImage: "/images/hongdae.png",
      localTip: {
        en: "Visit on weekends to see street performances by talented artists. The area is most lively after 7pm when all the shops and cafes are open.",
        kr: "주말에 방문하면 재능 있는 아티스트들의 거리 공연을 볼 수 있습니다. 모든 상점과 카페가 열리는 오후 7시 이후가 가장 활기찬 시간입니다.",
      },
    },
  ]

  const bangkokPlaces = [
    {
      id: "place1",
      name: {
        en: "Wat Arun",
        kr: "왓 아룬",
      },
      category: {
        en: "Temple",
        kr: "사원",
      },
      description: {
        en: "The Temple of Dawn is one of Bangkok's most famous landmarks",
        kr: "새벽 사원은 방콕의 가장 유명한 랜드마크 중 하나입니다",
      },
      distance: formatDistance("2.1km"),
      image: "/images/wat-arun.jpg",
      stampColor: "sunshine-yellow",
      stampIcon: "fa-torii-gate",
      checkIns: 78,
      recommendationScore: 4.7,
      stampImage: "/images/watarun.png",
      localTip: {
        en: "The best view of Wat Arun is actually from across the river at sunset. Take a ferry from Tha Tien pier for just 4 baht.",
        kr: "왓 아룬의 가장 아름다운 전경은 사실 일몰 때 강 건너편에서 볼 수 있습니다. 타 티엔 부두에서 페리를 타면 4바트밖에 들지 않습니다.",
      },
    },
    {
      id: "place2",
      name: {
        en: "Grand Palace",
        kr: "왕궁",
      },
      category: {
        en: "Historical",
        kr: "역사",
      },
      description: {
        en: "Former residence of the Kings of Siam and Thailand",
        kr: "시암과 태국 왕들의 이전 거주지",
      },
      distance: formatDistance("1.8km"),
      image: "/images/grand-palace.jpg",
      stampColor: "deep-navy",
      stampIcon: "fa-crown",
      checkIns: 112,
      recommendationScore: 4.3,
      stampImage: "/images/watphrakew.png",
      localTip: {
        en: "There's a strict dress code: no shorts, sleeveless shirts, or sandals. Arrive early in the morning to avoid crowds and the midday heat.",
        kr: "엄격한 복장 규정이 있습니다: 반바지, 소매 없는 셔츠, 샌들 착용 금지. 군중과 한낮의 더위를 피하려면 아침 일찍 도착하세요.",
      },
    },
  ]

  const busanPlaces = [
    {
      id: "place1",
      name: {
        en: "Haeundae Beach",
        kr: "해운대 해변",
      },
      category: {
        en: "Nature",
        kr: "자연",
      },
      description: {
        en: "Famous beach with beautiful coastline and vibrant atmosphere",
        kr: "아름다운 해안선과 활기찬 분위기의 유명한 해변",
      },
      distance: formatDistance("0.8km"),
      image: "/images/Stamp-Haeundae Beach.jpg",
      stampColor: "sky-blue",
      stampIcon: "fa-map-marker-alt",
      checkIns: 95,
      recommendationScore: 4.6,
      stampImage: "/images/haeundae.png",
      localTip: {
        en: "Visit during weekdays to avoid the crowds. The Haeundae Market nearby has amazing seafood restaurants where you can try fresh local specialties.",
        kr: "혼잡함을 피하려면 평일에 방문하세요. 근처의 해운대 시장에는 신선한 현지 특산물을 맛볼 수 있는 훌륭한 해산물 레스토랑이 있습니다.",
      },
    },
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        currentLanguage === "en"
          ? "Geolocation is not supported by your browser"
          : "브라우저에서 위치 정보를 지원하지 않습니다",
      )
      return
    }

    setIsLoadingLocation(true)
    triggerHapticFeedback(hapticPatterns.medium)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsLoadingLocation(false)

        determineCurrentCity(position.coords.latitude, position.coords.longitude)

        handleShowNotification(
          currentLanguage === "en" ? "Location updated successfully!" : "위치가 성공적으로 업데이트되었습니다!",
        )
      },
      (error) => {
        setIsLoadingLocation(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(currentLanguage === "en" ? "Location permission denied" : "위치 권한이 거부되었습니다")
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError(
              currentLanguage === "en" ? "Location information is unavailable" : "위치 정보를 사용할 수 없습니다",
            )
            break
          case error.TIMEOUT:
            setLocationError(
              currentLanguage === "en" ? "Location request timed out" : "위치 요청 시간이 초과되었습니다",
            )
            break
          default:
            setLocationError(currentLanguage === "en" ? "An unknown error occurred" : "알 수 없는 오류가 발생했습니다")
            break
        }

        handleShowNotification(currentLanguage === "en" ? "Could not get your location" : "위치를 가져올 수 없습니다")
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  const determineCurrentCity = (lat: number, lng: number) => {
    const cities = [
      { id: "seoul", lat: 37.5665, lng: 126.978 },
      { id: "bangkok", lat: 13.7563, lng: 100.5018 },
      { id: "busan", lat: 35.1796, lng: 129.0756 },
    ]

    const activeCities = cities.filter((city) => activePassports.includes(city.id))

    if (activeCities.length === 0) {
      setCurrentCity(null)
      return
    }

    let closestCity = activeCities[0]
    let minDistance = calculateDistance(lat, lng, closestCity.lat, closestCity.lng)

    for (let i = 1; i < activeCities.length; i++) {
      const distance = calculateDistance(lat, lng, activeCities[i].lat, activeCities[i].lng)
      if (distance < minDistance) {
        minDistance = distance
        closestCity = activeCities[i]
      }
    }

    setCurrentCity(closestCity.id)

    const cityNames: { [key: string]: string } = {
      seoul: currentLanguage === "en" ? "Seoul" : "서울",
      bangkok: currentLanguage === "en" ? "Bangkok" : "방콕",
      busan: currentLanguage === "en" ? "Busan" : "부산",
    }

    handleShowNotification(
      currentLanguage === "en"
        ? `You are now in ${cityNames[closestCity.id]}!`
        : `현재 ${cityNames[closestCity.id]}에 있습니다!`,
    )
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  const getCityPlaces = () => {
    switch (currentCity) {
      case "seoul":
        return seoulPlaces
      case "bangkok":
        return bangkokPlaces
      case "busan":
        return busanPlaces
      default:
        return seoulPlaces
    }
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "fa-map-marker-alt":
        return <FaMapMarkerAlt className="text-[#1E88E5]" />
      case "fa-torii-gate":
        return <FaToriiGate className="text-[#1E88E5]" />
      case "fa-music":
        return <FaMusic className="text-[#1E88E5]" />
      case "fa-house":
        return <FaHome className="text-[#1E88E5]" />
      case "fa-utensils":
        return <FaUtensils className="text-[#1E88E5]" />
      case "fa-coffee":
        return <FaCoffee className="text-[#1E88E5]" />
      case "fa-crown":
        return <FaCrown className="text-[#1E88E5]" />
      default:
        return <FaMapMarkerAlt className="text-[#1E88E5]" />
    }
  }

  const places = getCityPlaces()

  const categories = ["all", ...new Set(places.map((place) => place.category[currentLanguage === "en" ? "en" : "kr"]))]

  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name[currentLanguage === "en" ? "en" : "kr"].toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description[currentLanguage === "en" ? "en" : "kr"].toLowerCase().includes(searchQuery.toLowerCase())

    if (activeCategory === "all") return matchesSearch
    return place.category[currentLanguage === "en" ? "en" : "kr"] === activeCategory && matchesSearch
  })

  const handleCheckIn = (place: Place) => {
    triggerHapticFeedback(hapticPatterns.strong)

    // 스탬프 데이터 생성
    const newStamp = {
      id: `stamp-${place.id}`,
      name: place.name.en,
      nameKr: place.name.kr,
      image: place.image,
      stampImage: place.stampImage || place.image,
      rarity: Math.floor(Math.random() * 4) + 2, // 2-5 사이의 희귀도
      description: `Discovered the amazing ${place.name.en} and collected a unique stamp!`,
      descriptionKr: `향긋한 원두향이 가득한 ${place.name.kr}에서 고유 스탬프를 획득했습니다!`,
      location: `${place.name[currentLanguage === "en" ? "en" : "kr"]}, ${
        currentCity === "seoul" ? "Seoul" : currentCity === "bangkok" ? "Bangkok" : "Busan"
      }`,
      category: place.category[currentLanguage === "en" ? "en" : "kr"],
      stampColor: place.stampColor,
      stampIcon: place.stampIcon,
      localTip: place.localTip || {
        en: "This is a popular spot among locals. Try to visit during weekdays to avoid crowds.",
        kr: "현지인들 사이에서 인기 있는 장소입니다. 혼잡함을 피하려면 평일에 방문해 보세요.",
      },
    }

    // 로컬 스토리지에 스탬프 정보 저장
    const stampData = JSON.stringify(newStamp)
    localStorage.setItem("lastUnlockedStamp", stampData)

    // 체크인 성공 알림
    handleShowNotification(
      currentLanguage === "en" ? `Successfully checked in at ${place.name.en}!` : `${place.name.kr}에 체크인했습니다!`,
    )

    // 스탬프 획득 화면으로 이동
    router.push("/stamp-unlocked")
  }

  const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
    e.preventDefault()
    e.stopPropagation()

    triggerHapticFeedback(hapticPatterns.light)

    onImageClick(imageUrl)
  }

  const handleCategoryChange = (category: string) => {
    triggerHapticFeedback(hapticPatterns.light)
    setActiveCategory(category)
  }

  return (
    <div id="check-in" className={`tab-content ${isVisible ? "active" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8 gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold serif-font text-deep-navy">
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
            className={`px-3 py-2 sm:px-4 sm:py-2 bg-sky-blue text-cloud-white rounded-lg btn-effect text-sm sm:text-base ${
              isLoadingLocation ? "opacity-70" : ""
            }`}
            onClick={getUserLocation}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <>
                <span className="animate-spin inline-block mr-1">⟳</span>
                <span>{currentLanguage === "en" ? "Locating..." : "위치 찾는 중..."}</span>
              </>
            ) : (
              <>
                <FaCompass className="inline mr-1" />
                <span>{currentLanguage === "en" ? "Find Me" : "내 위치"}</span>
              </>
            )}
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

      {/* Filter Categories */}
      {showFilterModal && (
        <div className="bg-light-sand rounded-lg p-4 mb-4">
          <h3 className="font-medium mb-2">{currentLanguage === "en" ? "Filter Places" : "장소 필터링"}</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg text-sm ${
                  activeCategory === category ? "bg-sky-blue text-white" : "bg-cloud-white text-deep-navy"
                }`}
                onClick={() => {
                  handleCategoryChange(category)
                  setShowFilterModal(false)
                }}
              >
                {category === "all" ? (currentLanguage === "en" ? "All" : "전체") : category}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentCity && (
        <div className="mb-4 bg-light-sand p-3 rounded-lg flex items-center">
          <FaMapMarkerAlt className="text-sunset-coral mr-2" />
          <span className="font-medium text-deep-navy">
            {currentLanguage === "en" ? "Current city: " : "현재 도시: "}
            {currentCity === "seoul"
              ? currentLanguage === "en"
                ? "Seoul"
                : "서울"
              : currentCity === "bangkok"
                ? currentLanguage === "en"
                  ? "Bangkok"
                  : "방콕"
                : currentLanguage === "en"
                  ? "Busan"
                  : "부산"}
          </span>
        </div>
      )}

      {locationError && (
        <div className="mb-4 bg-red-100 p-3 rounded-lg flex items-center text-red-700">
          <FaExclamationTriangle className="mr-2" />
          <span>{locationError}</span>
        </div>
      )}

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="bg-cloud-white rounded-lg overflow-hidden border border-light-sand hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row p-3 sm:p-4">
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
                  <h3 className="font-bold text-lg text-deep-navy">
                    {place.name[currentLanguage === "en" ? "en" : "kr"]}
                  </h3>
                  <span className="text-sm bg-light-sand px-2 py-1 rounded-full text-deep-navy">{place.distance}</span>
                </div>
                <p className="text-stone-gray text-sm mb-2">{place.category[currentLanguage === "en" ? "en" : "kr"]}</p>
                <p className="text-sm mb-3 text-deep-navy">
                  {place.description[currentLanguage === "en" ? "en" : "kr"]}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-gray">
                    {currentLanguage === "en" ? "Check-ins" : "체크인"}: {place.checkIns}
                  </span>
                  <div className="flex items-center">
                    <FaStar className="text-sunshine-yellow mr-1" />
                    <span>{place.recommendationScore}</span>
                  </div>
                </div>
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
                onClick={() => handleCheckIn(place)}
                ref={buttonRef}
              >
                {currentLanguage === "en" ? "Check In" : "체크인"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-light-sand rounded-xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold serif-font mb-4 text-deep-navy">
          {currentLanguage === "en" ? "Recently Checked In" : "최근 체크인"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-cloud-white p-3 sm:p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 cursor-pointer shadow-sm"
                onClick={(e) => handleImageClick(e, "/images/Checkin_Starbucks.png")}
              >
                <img
                  src="/images/Checkin_Starbucks.png"
                  alt="Starbucks Myeongdong"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-deep-navy">
                  {currentLanguage === "en" ? "Starbucks Myeongdong" : "스타벅스 명동점"}
                </h4>
                <p className="text-xs sm:text-sm text-stone-gray">{currentLanguage === "en" ? "Today" : "오늘"}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-stone-gray">{currentLanguage === "en" ? "Earned" : "획득"}</span>
              <span className="font-medium text-deep-navy">+50 XP</span>
            </div>
          </div>

          <div className="bg-cloud-white p-3 sm:p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 cursor-pointer shadow-sm"
                onClick={(e) => handleImageClick(e, "/images/Checkin_Gwangjang Market.jpg")}
              >
                <img
                  src="/images/Checkin_Gwangjang Market.jpg"
                  alt="Gwangjang Market"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-deep-navy">
                  {currentLanguage === "en" ? "Gwangjang Market" : "광장시장"}
                </h4>
                <p className="text-xs sm:text-sm text-stone-gray">{currentLanguage === "en" ? "Yesterday" : "어제"}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-stone-gray">{currentLanguage === "en" ? "Earned" : "획득"}</span>
              <span className="font-medium text-deep-navy">+75 XP</span>
            </div>
          </div>

          <div className="bg-cloud-white p-3 sm:p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 cursor-pointer shadow-sm"
                onClick={(e) => handleImageClick(e, "/images/Check-in-Gyeongbokgung.jpg")}
              >
                <img
                  src="/images/Check-in-Gyeongbokgung.jpg"
                  alt="Gyeongbokgung Palace"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-deep-navy">
                  {currentLanguage === "en" ? "Gyeongbokgung Palace" : "경복궁"}
                </h4>
                <p className="text-xs sm:text-sm text-stone-gray">
                  {currentLanguage === "en" ? "3 days ago" : "3일 전"}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-stone-gray">{currentLanguage === "en" ? "Earned" : "획득"}</span>
              <span className="font-medium text-deep-navy">+100 XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to show notifications
const handleShowNotification = (text: string) => {
  console.log("Notification:", text)
}

export default CheckInTabGPS
