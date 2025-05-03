"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Search, Filter, MapPin, Star } from "lucide-react"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import Image from "next/image"
import { useRouter } from "next/navigation"
import StampUnlockedModal from "@/components/modals/stamp-unlocked-modal"

export default function StampCollectionPage() {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [activeFilter, setActiveFilter] = useState("all")
  const [showStampModal, setShowStampModal] = useState(false)
  const [selectedStamp, setSelectedStamp] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Load language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  // Sample stamp data
  const allStamps = [
    {
      id: "seongsu-cafe",
      name: "Seongsu Hidden Café",
      nameKr: "성수동 숨겨진 카페",
      image: "/images/seoul-cafe-hopping.png",
      rarity: 4,
      description: "A vintage roastery café with aromatic beans and a secret stamp!",
      descriptionKr: "향긋한 원두향이 가득한 빈티지 로스터리 카페의 비밀 스탬프!",
      location: "Seongsu-dong, Seoul",
      category: "cafe",
      collected: true,
    },
    {
      id: "namsan-tower",
      name: "N Seoul Tower",
      nameKr: "N 서울타워",
      image: "/images/seoul-landmark.png",
      rarity: 3,
      description: "The iconic tower offering panoramic views of Seoul!",
      descriptionKr: "서울의 파노라마 전망을 제공하는 상징적인 타워!",
      location: "Namsan Mountain, Seoul",
      category: "landmark",
      collected: true,
    },
    {
      id: "night-hike",
      name: "Night Hiking Explorer",
      nameKr: "야간 하이킹 탐험가",
      image: "/images/night-owl.png",
      rarity: 5,
      description: "For the brave souls who conquered the mountain under the stars!",
      descriptionKr: "별빛 아래 산을 정복한 용감한 영혼들을 위한 스탬프!",
      location: "Bukhansan, Seoul",
      category: "activity",
      collected: true,
    },
    {
      id: "street-food",
      name: "Street Food Master",
      nameKr: "길거리 음식 마스터",
      image: "/images/seoul-street-food.png",
      rarity: 3,
      description: "Tried all the delicious street foods in this vibrant market!",
      descriptionKr: "활기찬 시장에서 모든 맛있는 길거리 음식을 시도했습니다!",
      location: "Gwangjang Market, Seoul",
      category: "food",
      collected: true,
    },
    {
      id: "history-buff",
      name: "History Enthusiast",
      nameKr: "역사 애호가",
      image: "/images/seoul-history.png",
      rarity: 4,
      description: "Explored the rich historical sites and learned about Korean heritage!",
      descriptionKr: "풍부한 역사 유적지를 탐험하고 한국의 유산에 대해 배웠습니다!",
      location: "Gyeongbokgung Palace, Seoul",
      category: "culture",
      collected: true,
    },
    {
      id: "dullegil-hiker",
      name: "Dullegil Trail Hiker",
      nameKr: "둘레길 하이커",
      image: "/images/dullegil-master.png",
      rarity: 4,
      description: "Completed the scenic trail around the mountain!",
      descriptionKr: "산 주변의 아름다운 둘레길을 완주했습니다!",
      location: "Bukhansan Dullegil, Seoul",
      category: "activity",
      collected: true,
    },
    {
      id: "thai-food",
      name: "Thai Cuisine Explorer",
      nameKr: "태국 요리 탐험가",
      image: "/images/tasty-bangkok.png",
      rarity: 3,
      description: "Savored the authentic flavors of Thai cuisine!",
      descriptionKr: "태국 요리의 정통 맛을 음미했습니다!",
      location: "Bangkok, Thailand",
      category: "food",
      collected: true,
    },
    // Locked stamps
    {
      id: "locked1",
      name: "???",
      nameKr: "???",
      image: "/placeholder.svg",
      rarity: 0,
      description: "This stamp is still locked. Explore more to unlock it!",
      descriptionKr: "이 스탬프는 아직 잠겨 있습니다. 더 탐험하여 잠금을 해제하세요!",
      location: "Unknown",
      category: "unknown",
      collected: false,
    },
    {
      id: "locked2",
      name: "???",
      nameKr: "???",
      image: "/placeholder.svg",
      rarity: 0,
      description: "This stamp is still locked. Explore more to unlock it!",
      descriptionKr: "이 스탬프는 아직 잠겨 있습니다. 더 탐험하여 잠금을 해제하세요!",
      location: "Unknown",
      category: "unknown",
      collected: false,
    },
    {
      id: "locked3",
      name: "???",
      nameKr: "???",
      image: "/placeholder.svg",
      rarity: 0,
      description: "This stamp is still locked. Explore more to unlock it!",
      descriptionKr: "이 스탬프는 아직 잠겨 있습니다. 더 탐험하여 잠금을 해제하세요!",
      location: "Unknown",
      category: "unknown",
      collected: false,
    },
    {
      id: "locked4",
      name: "???",
      nameKr: "???",
      image: "/placeholder.svg",
      rarity: 0,
      description: "This stamp is still locked. Explore more to unlock it!",
      descriptionKr: "이 스탬프는 아직 잠겨 있습니다. 더 탐험하여 잠금을 해제하세요!",
      location: "Unknown",
      category: "unknown",
      collected: false,
    },
  ]

  // Filter stamps based on active filter and search query
  const filteredStamps = allStamps.filter((stamp) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "collected" && stamp.collected) ||
      (activeFilter === "locked" && !stamp.collected) ||
      stamp.category === activeFilter

    const matchesSearch =
      searchQuery === "" ||
      stamp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stamp.nameKr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stamp.location.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const handleBack = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    router.push("/")
  }

  const handleFilterChange = (filter: string) => {
    triggerHapticFeedback(hapticPatterns.light)
    setActiveFilter(filter)
  }

  const handleStampClick = (stamp: any) => {
    if (!stamp.collected) return

    triggerHapticFeedback(hapticPatterns.medium)
    setSelectedStamp(stamp)
    setShowStampModal(true)
  }

  const renderRarityStars = (rarity: number) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star key={i} className={`w-3 h-3 ${i < rarity ? "text-brand-yellow fill-brand-yellow" : "text-gray-300"}`} />,
      )
    }
    return stars
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold">{currentLanguage === "en" ? "Stamp Collection" : "스탬프 컬렉션"}</h1>
        <div className="w-10 h-10"></div> {/* Empty div for layout balance */}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder={currentLanguage === "en" ? "Search stamps..." : "스탬프 검색..."}
          className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        <button className="absolute right-3 top-2.5">
          <Filter className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-4 gap-2 scrollbar-hide">
        <button
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            activeFilter === "all" ? "bg-brand-coral text-white" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleFilterChange("all")}
        >
          {currentLanguage === "en" ? "All Stamps" : "모든 스탬프"}
        </button>
        <button
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            activeFilter === "collected" ? "bg-brand-coral text-white" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleFilterChange("collected")}
        >
          {currentLanguage === "en" ? "Collected" : "수집됨"}
        </button>
        <button
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            activeFilter === "locked" ? "bg-brand-coral text-white" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleFilterChange("locked")}
        >
          {currentLanguage === "en" ? "Locked" : "잠김"}
        </button>
        <button
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            activeFilter === "landmark" ? "bg-brand-coral text-white" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleFilterChange("landmark")}
        >
          {currentLanguage === "en" ? "Landmarks" : "랜드마크"}
        </button>
        <button
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            activeFilter === "food" ? "bg-brand-coral text-white" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleFilterChange("food")}
        >
          {currentLanguage === "en" ? "Food" : "음식"}
        </button>
        <button
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            activeFilter === "cafe" ? "bg-brand-coral text-white" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleFilterChange("cafe")}
        >
          {currentLanguage === "en" ? "Cafes" : "카페"}
        </button>
        <button
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            activeFilter === "activity" ? "bg-brand-coral text-white" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleFilterChange("activity")}
        >
          {currentLanguage === "en" ? "Activities" : "활동"}
        </button>
        <button
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            activeFilter === "culture" ? "bg-brand-coral text-white" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleFilterChange("culture")}
        >
          {currentLanguage === "en" ? "Culture" : "문화"}
        </button>
      </div>

      {/* Stamps Grid */}
      <div className="grid grid-cols-2 gap-3 mb-20">
        {filteredStamps.map((stamp) => (
          <motion.div
            key={stamp.id}
            className={`border rounded-lg p-3 ${
              stamp.collected ? "border-gray-200 cursor-pointer" : "border-dashed border-gray-300 bg-gray-50"
            }`}
            whileTap={stamp.collected ? { scale: 0.98 } : {}}
            onClick={() => handleStampClick(stamp)}
          >
            <div className="flex items-center mb-2">
              <div
                className={`w-12 h-12 rounded-full overflow-hidden ${
                  stamp.collected ? "border-2 border-brand-coral" : "border border-gray-300 bg-gray-100"
                } mr-2`}
              >
                {stamp.collected ? (
                  <Image
                    src={stamp.image || "/placeholder.svg"}
                    alt={stamp.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-sm line-clamp-1">
                  {currentLanguage === "en" ? stamp.name : stamp.nameKr}
                </h3>
                {stamp.collected && <div className="flex">{renderRarityStars(stamp.rarity)}</div>}
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="line-clamp-1">{stamp.location}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stamp Unlocked Modal */}
      <StampUnlockedModal
        isOpen={showStampModal}
        onClose={() => setShowStampModal(false)}
        stamp={selectedStamp}
        currentLanguage={currentLanguage}
      />
    </div>
  )
}
