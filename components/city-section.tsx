"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { FaArrowLeft, FaStamp, FaTasks, FaBook, FaLock } from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import AddNoteModal from "./modals/add-note-modal"
import StampDetailsModal from "./modals/stamp-details-modal"

interface CitySectionProps {
  cityId: string
  currentLanguage: string
  onBack: () => void
}

const CitySection = ({ cityId, currentLanguage, onBack }: CitySectionProps) => {
  const [activeTab, setActiveTab] = useState("stamps")
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [showStampDetailsModal, setShowStampDetailsModal] = useState(false)
  const [selectedStampId, setSelectedStampId] = useState("")

  // City-specific data
  const getCityData = (cityId: string) => {
    // Default city data
    let data = {
      name: "Seoul",
      koreanName: "서울",
      coverImage: "/images/seoul-passport-cover.png",
      backgroundPattern: "url('/patterns/passport-pattern.svg')",
      backgroundColor: "#f8f3e2",
      watermark: "/images/seoul-watermark.png",
      color: "#00A9E0",
      stamps: 24,
      totalStamps: 35,
      lastVisited: "2 days ago",
      koreanLastVisited: "2일 전",
    }

    // City-specific data
    switch (cityId) {
      case "seoul":
        // Seoul data is already the default
        break
      case "busan":
        data = {
          name: "Busan",
          koreanName: "부산",
          coverImage: "/images/busan-passport-cover.png",
          backgroundPattern: "url('/patterns/dot-pattern.svg')",
          backgroundColor: "#f4f2e8",
          watermark: "/images/busan-watermark.png",
          color: "#0B7285",
          stamps: 8,
          totalStamps: 20,
          lastVisited: "1 month ago",
          koreanLastVisited: "1개월 전",
        }
        break
      case "bangkok":
        data = {
          name: "Bangkok",
          koreanName: "방콕",
          coverImage: "/images/bangkok-passport-cover.png",
          backgroundPattern: "url('/patterns/map-pattern.svg')",
          backgroundColor: "#f2f8e8",
          watermark: "/images/bangkok-watermark.png",
          color: "#00897B",
          stamps: 12,
          totalStamps: 28,
          lastVisited: "2 weeks ago",
          koreanLastVisited: "2주 전",
        }
        break
      case "jeju":
        data = {
          name: "Jeju Island",
          koreanName: "제주도",
          coverImage: "/images/cover_jeju.png",
          backgroundPattern: "url('/patterns/dot-pattern.svg')",
          backgroundColor: "#e8f8f2",
          watermark: "/images/jeju-watermark.png",
          color: "#43A047",
          stamps: 0,
          totalStamps: 18,
          lastVisited: "Never visited",
          koreanLastVisited: "방문한 적 없음",
        }
        break
      // Keep other cases for additional cities
      default:
        console.warn(`City data for ${cityId} not found, using default`)
    }

    return data
  }

  const getStamps = (cityId: string) => {
    switch (cityId) {
      case "seoul":
        return [
          { id: "gyeongbokgung", name: "Gyeongbokgung Palace", visited: true },
          { id: "namsantower", name: "Namsan Tower", visited: true },
          { id: "hongdae", name: "Hongdae Street", visited: true },
          { id: "bukchon", name: "Bukchon Hanok Village", visited: false },
          // ... other Seoul stamps
        ]
      case "busan":
        return [
          { id: "haeundae", name: "Haeundae Beach", visited: true },
          { id: "gamcheon", name: "Gamcheon Culture Village", visited: true },
          { id: "jagalchi", name: "Jagalchi Market", visited: false },
          { id: "taejongdae", name: "Taejongdae Resort Park", visited: false },
          // ... other Busan stamps
        ]
      case "bangkok":
        return [
          { id: "grandpalace", name: "Grand Palace", visited: true },
          { id: "watarun", name: "Wat Arun", visited: true },
          { id: "chatuchak", name: "Chatuchak Weekend Market", visited: true },
          { id: "khaosanroad", name: "Khao San Road", visited: false },
          // ... other Bangkok stamps
        ]
      case "jeju":
        return [
          { id: "hallasan", name: "Hallasan Mountain", visited: false },
          { id: "seongsan", name: "Seongsan Ilchulbong", visited: false },
          { id: "manjanggul", name: "Manjanggul Cave", visited: false },
          { id: "udo", name: "Udo Island", visited: false },
          // ... other Jeju stamps
        ]
      default:
        return []
    }
  }

  const cityData = {
    seoul: {
      name: currentLanguage === "en" ? "Seoul" : "서울",
      country: currentLanguage === "en" ? "South Korea" : "대한민국",
      image: "/images/cover_seoul.png", // 새 이미지로 교체
      stamps: [
        {
          id: "gyeongbokgung",
          name: currentLanguage === "en" ? "Gyeongbokgung Palace" : "경복궁",
          image: "/images/gyeongbokgung.png",
          date: "May 15, 2023",
          unlocked: true,
        },
        {
          id: "bukchon",
          name: currentLanguage === "en" ? "Bukchon Hanok Village" : "북촌 한옥마을",
          image: "/images/bukchon.png",
          date: "May 16, 2023",
          unlocked: true,
        },
        {
          id: "hongdae",
          name: currentLanguage === "en" ? "Hongdae Street" : "홍대 거리",
          image: "/images/hongdae.png",
          date: "May 18, 2023",
          unlocked: true,
        },
        {
          id: "gwangjang",
          name: currentLanguage === "en" ? "Gwangjang Market" : "광장시장",
          image: "/images/gwangjang.png",
          date: "May 19, 2023",
          unlocked: true,
        },
        {
          id: "nseoul",
          name: currentLanguage === "en" ? "N Seoul Tower" : "N 서울타워",
          image: "/images/n-seoultower.png",
          date: "May 20, 2023",
          unlocked: true,
        },
        {
          id: "starbucks",
          name: currentLanguage === "en" ? "Starbucks Myeongdong" : "스타벅스 명동점",
          image: "/images/starbucks.png",
          date: "May 21, 2023",
          unlocked: true,
        },
        {
          id: "namsan",
          name: currentLanguage === "en" ? "Namsan Park" : "남산공원",
          image: "/images/namsanpark.png",
          date: "",
          unlocked: false,
        },
        {
          id: "dongdaemun",
          name: currentLanguage === "en" ? "Dongdaemun Market" : "동대문시장",
          image: "/images/dongdaemun.png",
          date: "",
          unlocked: false,
        },
      ],
      quests: [
        {
          id: "seoul-food",
          title: currentLanguage === "en" ? "Seoul Street Food Tour" : "서울 길거리 음식 투어",
          progress: "5/8",
          progressPercent: 62.5,
        },
        {
          id: "seoul-historical",
          title: currentLanguage === "en" ? "Seoul Historical Sites" : "서울 역사 유적지",
          progress: "2/6",
          progressPercent: 33.3,
        },
      ],
      notes: [
        {
          date: "2023-05-15",
          location: currentLanguage === "en" ? "Gyeongbokgung Palace" : "경복궁",
          note:
            currentLanguage === "en"
              ? "Visited the largest of the Five Grand Palaces. The changing of the guard ceremony was fascinating!"
              : "5대 궁궐 중 가장 큰 궁궐을 방문했습니다. 수문장 교대식이 정말 흥미로웠어요!",
        },
        {
          date: "2023-05-18",
          location: currentLanguage === "en" ? "Hongdae Street" : "홍대 거리",
          note:
            currentLanguage === "en"
              ? "So many young people and street performers! Found a great coffee shop with amazing latte art."
              : "많은 젊은이들과 거리 공연자들! 멋진 라떼 아트가 있는 훌륭한 카페를 찾았어요.",
        },
      ],
    },
    bangkok: {
      name: currentLanguage === "en" ? "Bangkok" : "방콕",
      country: currentLanguage === "en" ? "Thailand" : "태국",
      image: "/images/cover_bangkok.png", // 새 이미지로 교체
      stamps: [
        {
          id: "watarun",
          name: currentLanguage === "en" ? "Wat Arun" : "왓 아룬",
          image: "/images/watarun.png",
          date: "Apr 18, 2025",
          unlocked: true,
        },
        {
          id: "khaosan",
          name: currentLanguage === "en" ? "Khao San Road" : "카오산 로드",
          image: "/images/khaosan.png",
          date: "Apr 20, 2025",
          unlocked: true,
        },
        {
          id: "grandpalace",
          name: currentLanguage === "en" ? "Grand Palace" : "왕궁",
          image: "/images/watphrakew.png",
          date: "",
          unlocked: false,
        },
        {
          id: "chatuchak",
          name: currentLanguage === "en" ? "Chatuchak Market" : "짜뚜짝 시장",
          image: "/images/jjatujak.png",
          date: "",
          unlocked: false,
        },
      ],
      quests: [
        {
          id: "bangkok-temples",
          title: currentLanguage === "en" ? "Bangkok Temple Tour" : "방콕 사원 투어",
          progress: "2/5",
          progressPercent: 40,
        },
      ],
      notes: [
        {
          date: "2025-04-18",
          location: currentLanguage === "en" ? "Wat Arun" : "왓 아룬",
          note:
            currentLanguage === "en"
              ? "The Temple of Dawn is even more beautiful in person! Climbed the steep steps for an amazing view."
              : "새벽 사원은 실제로 보면 더 아름답습니다! 가파른 계단을 올라 멋진 전망을 감상했어요.",
        },
      ],
    },
    busan: {
      name: currentLanguage === "en" ? "Busan" : "부산",
      country: currentLanguage === "en" ? "South Korea" : "대한민국",
      image: "/images/cover_busan.png", // 새 이미지로 교체
      stamps: [
        {
          id: "haeundae",
          name: currentLanguage === "en" ? "Haeundae Beach" : "해운대 해변",
          image: "/images/haeundae.png",
          date: "Sep 28, 2023",
          unlocked: true,
        },
        {
          id: "gamcheon",
          name: currentLanguage === "en" ? "Gamcheon Culture Village" : "감천문화마을",
          image: "/images/gamcheon.png",
          date: "Sep 29, 2023",
          unlocked: true,
        },
        {
          id: "jagalchi",
          name: currentLanguage === "en" ? "Jagalchi Market" : "자갈치시장",
          image: "/images/jagalchi.png",
          date: "Sep 30, 2023",
          unlocked: true,
        },
      ],
      quests: [
        {
          id: "busan-taste",
          title: currentLanguage === "en" ? "Busan Taste & Style" : "부산 맛과 멋 탐방",
          progress: "3/7",
          progressPercent: 42.9,
        },
      ],
      notes: [
        {
          date: "2023-09-28",
          location: currentLanguage === "en" ? "Haeundae Beach" : "해운대 해변",
          note:
            currentLanguage === "en"
              ? "Beautiful beach with soft sand and clear water. The seafood restaurants nearby are amazing!"
              : "부드러운 모래와 맑은 물이 있는 아름다운 해변. 근처의 해산물 식당들이 정말 훌륭해요!",
        },
      ],
    },
    newyork: {
      name: currentLanguage === "en" ? "New York" : "뉴욕",
      country: currentLanguage === "en" ? "United States" : "미국",
      image: "/images/cover_newyork.png", // 새 이미지로 교체
      stamps: [
        {
          id: "timessquare",
          name: currentLanguage === "en" ? "Times Square" : "타임스 스퀘어",
          image: "/images/timessquare.png",
          date: "Nov 5, 2022",
          unlocked: true,
        },
        {
          id: "centralpark",
          name: currentLanguage === "en" ? "Central Park" : "센트럴 파크",
          image: "/images/centralpark.png",
          date: "Nov 6, 2022",
          unlocked: true,
        },
        {
          id: "statueofliberty",
          name: currentLanguage === "en" ? "Statue of Liberty" : "자유의 여신상",
          image: "/images/liberty.png",
          date: "Nov 7, 2022",
          unlocked: true,
        },
      ],
      quests: [
        {
          id: "newyork-landmarks",
          title: currentLanguage === "en" ? "NYC Iconic Landmarks" : "뉴욕 상징적 랜드마크",
          progress: "3/7",
          progressPercent: 42.9,
        },
        {
          id: "newyork-food",
          title: currentLanguage === "en" ? "New York Food Tour" : "뉴욕 음식 투어",
          progress: "1/7",
          progressPercent: 14.3,
        },
      ],
      notes: [
        {
          date: "2022-11-05",
          location: currentLanguage === "en" ? "Times Square" : "타임스 스퀘어",
          note:
            currentLanguage === "en"
              ? "So bright and busy even at night! The billboards are enormous and the energy is incredible."
              : "밤에도 너무 밝고 분주합니다! 광고판이 엄청나게 크고 에너지가 놀랍습니다.",
        },
      ],
    },
    jeju: {
      name: currentLanguage === "en" ? "Jeju Island" : "제주도",
      country: currentLanguage === "en" ? "South Korea" : "대한민국",
      image: "/images/cover_jeju.png", // 새 이미지로 교체
      stamps: [
        {
          id: "hallasan",
          name: currentLanguage === "en" ? "Hallasan Mountain" : "한라산",
          image: "/images/hallasan.png",
          date: "Jul 15, 2023",
          unlocked: true,
        },
        {
          id: "seongsan",
          name: currentLanguage === "en" ? "Seongsan Ilchulbong" : "성산일출봉",
          image: "/images/seongsan.png",
          date: "Jul 16, 2023",
          unlocked: true,
        },
        {
          id: "manjanggul",
          name: currentLanguage === "en" ? "Manjanggul Cave" : "만장굴",
          image: "/images/manjanggul.png",
          date: "",
          unlocked: false,
        },
      ],
      quests: [
        {
          id: "jeju-nature",
          title: currentLanguage === "en" ? "Jeju Natural Wonders" : "제주 자연의 경이로움",
          progress: "2/5",
          progressPercent: 40,
        },
        {
          id: "jeju-culture",
          title: currentLanguage === "en" ? "Jeju Cultural Experience" : "제주 문화 체험",
          progress: "0/5",
          progressPercent: 0,
        },
      ],
      notes: [
        {
          date: "2023-07-15",
          location: currentLanguage === "en" ? "Hallasan Mountain" : "한라산",
          note:
            currentLanguage === "en"
              ? "The hike was challenging but the view from the top was absolutely worth it. Could see the entire island!"
              : "등산은 힘들었지만 정상에서의 전망은 정말 가치가 있��습니다. �� 전체를 볼 수 있었어요!",
        },
      ],
    },
  }

  const city = cityData[cityId as keyof typeof cityData]
  if (!city) return null

  const handleTabChange = (tab: string) => {
    triggerHapticFeedback(hapticPatterns.light)
    setActiveTab(tab)
  }

  const handleBack = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    onBack()
  }

  const handleStampClick = (stampId: string) => {
    triggerHapticFeedback(hapticPatterns.medium)
    setSelectedStampId(stampId)
    setShowStampDetailsModal(true)
  }

  const handleQuestClick = (questId: string) => {
    triggerHapticFeedback(hapticPatterns.medium)
    // Navigate to the quest details page
    window.location.href = `/quest-details/${cityId}/${questId}`
  }

  const renderStampsTab = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">{currentLanguage === "en" ? "My Stamps" : "내 스탬프"}</h3>
        {city.stamps && city.stamps.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {city.stamps.map((stamp) => (
              <div
                key={stamp.id}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => (stamp.unlocked ? handleStampClick(stamp.id) : null)}
              >
                <div className={`w-20 h-20 rounded-full overflow-hidden mb-2 ${!stamp.unlocked ? "relative" : ""}`}>
                  <Image
                    src={stamp.image || "/placeholder.svg"}
                    alt={stamp.name}
                    width={80}
                    height={80}
                    className={`w-full h-full object-cover ${!stamp.unlocked ? "opacity-50" : ""}`}
                  />
                  {!stamp.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <FaLock className="text-white text-xl" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-center text-deep-navy">{stamp.name}</p>
                {stamp.unlocked && <p className="text-xs text-stone-gray text-center">{stamp.date}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-light-sand p-6 rounded-lg text-center">
            <FaStamp className="text-stone-gray text-4xl mx-auto mb-3" />
            <h4 className="font-bold mb-2 text-deep-navy">
              {currentLanguage === "en" ? "No Stamps Yet" : "아직 스탬프가 없습니다"}
            </h4>
            <p className="text-sm text-stone-gray mb-4">
              {currentLanguage === "en"
                ? "You haven't collected any stamps in this city yet. Start exploring to collect stamps!"
                : "아직 이 도시에서 수집한 스탬프가 없습니다. 탐험을 시작하여 스탬프를 수집하세요!"}
            </p>
            <button className="px-4 py-2 bg-brand-blue text-brand-blue rounded-lg text-sm">
              {currentLanguage === "en" ? "Explore Nearby" : "주변 탐색"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-light-sand p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold text-deep-navy">
            {currentLanguage === "en" ? "Collection Progress" : "컬렉션 진행도"}
          </h4>
          <span className="text-sm font-medium text-deep-navy">
            {city.stamps ? city.stamps.filter((s) => s.unlocked).length : 0}/{city.stamps ? city.stamps.length : 0}
          </span>
        </div>
        <div className="progress-bar mb-4">
          <div
            className="progress-fill bg-brand-coral"
            style={{
              width:
                city.stamps && city.stamps.length > 0
                  ? `${(city.stamps.filter((s) => s.unlocked).length / city.stamps.length) * 100}%`
                  : "0%",
            }}
          ></div>
        </div>
        <p className="text-sm text-stone-gray">
          {currentLanguage === "en"
            ? `Collect all ${city.stamps ? city.stamps.length : 0} stamps to complete your ${city.name} collection!`
            : `${city.name} 컬렉션을 완성하려면 모든 ${city.stamps ? city.stamps.length : 0}개의 스탬프를 수집하세요!`}
        </p>
      </div>
    </div>
  )

  const renderQuestsTab = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-deep-navy">
          {currentLanguage === "en" ? "City Quests" : "도시 퀘스트"}
        </h3>
        {city.quests && city.quests.length > 0 ? (
          <div className="space-y-4">
            {city.quests.map((quest) => (
              <div
                key={quest.id}
                className="bg-white p-4 rounded-lg border border-light-sand cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleQuestClick(quest.id)}
              >
                <h4 className="font-bold mb-2 text-deep-navy">{quest.title}</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-stone-gray">{currentLanguage === "en" ? "Progress" : "진행도"}</span>
                  <span className="text-sm font-medium text-deep-navy">{quest.progress}</span>
                </div>
                <div className="progress-bar mb-3">
                  <div className="progress-fill bg-brand-blue" style={{ width: `${quest.progressPercent}%` }}></div>
                </div>
                <button className="w-full py-2 bg-brand-blue text-cloud-white rounded-lg text-sm">
                  {currentLanguage === "en" ? "View Details" : "상세 보기"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-light-sand p-6 rounded-lg text-center">
            <FaTasks className="text-stone-gray text-4xl mx-auto mb-3" />
            <h4 className="font-bold mb-2 text-deep-navy">
              {currentLanguage === "en" ? "No Quests Available" : "사용 가능한 퀘스트가 없습니다"}
            </h4>
            <p className="text-sm text-stone-gray mb-4">
              {currentLanguage === "en"
                ? "There are no quests available for this city yet. Check back later!"
                : "아직 이 도시에 사용 가능한 퀘스트가 없습니다. 나중에 다시 확인하세요!"}
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const renderNotesTab = () => (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-deep-navy">
            {currentLanguage === "en" ? "Travel Notes" : "여행 노트"}
          </h3>
          <button
            className="px-3 py-1 bg-brand-blue text-cloud-white rounded-lg text-sm"
            onClick={() => {
              triggerHapticFeedback(hapticPatterns.medium)
              setShowAddNoteModal(true)
            }}
          >
            {currentLanguage === "en" ? "Add Note" : "노트 추가"}
          </button>
        </div>
        {city.notes && city.notes.length > 0 ? (
          <div className="space-y-4">
            {city.notes.map((note, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-light-sand">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-deep-navy">{note.location}</h4>
                  <span className="text-xs text-stone-gray">{note.date}</span>
                </div>
                <p className="text-sm mb-3 text-deep-navy">{note.note}</p>
                <div className="flex justify-end">
                  <button className="text-brand-blue text-sm">{currentLanguage === "en" ? "Edit" : "편집"}</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-light-sand p-6 rounded-lg text-center">
            <FaBook className="text-stone-gray text-4xl mx-auto mb-3" />
            <h4 className="font-bold mb-2 text-deep-navy">
              {currentLanguage === "en" ? "No Travel Notes" : "여행 노트가 없습니다"}
            </h4>
            <p className="text-sm text-stone-gray mb-4">
              {currentLanguage === "en"
                ? "You haven't added any travel notes for this city yet. Add your first note!"
                : "아직 이 도시에 대한 여행 노트를 추가하지 않았습니다. 첫 번째 노트를 추가하세요!"}
            </p>
            <button
              className="px-4 py-2 bg-brand-blue text-cloud-white rounded-lg text-sm"
              onClick={() => {
                triggerHapticFeedback(hapticPatterns.medium)
                setShowAddNoteModal(true)
              }}
            >
              {currentLanguage === "en" ? "Add First Note" : "첫 노트 추가"}
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="city-section">
      {/* Header with city info */}
      <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
        <Image src={city.image || "/placeholder.svg"} alt={city.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        <div className="absolute top-4 left-4">
          <button
            className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-blue"
            onClick={handleBack}
          >
            <FaArrowLeft />
          </button>
        </div>

        {/* 도시 섹션에서도 도시 이름 색상을 cloud-white로 변경 */}
        <div className="absolute bottom-0 left-0 p-6 text-cloud-white">
          <h2 className="text-3xl font-bold">{city.name}</h2>
          <p>{city.country}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-light-sand mb-6">
        <button
          className={`flex items-center px-4 py-3 relative ${activeTab === "stamps" ? "text-brand-coral" : "text-stone-gray"}`}
          onClick={() => handleTabChange("stamps")}
        >
          <FaStamp className="mr-2" />
          <span>{currentLanguage === "en" ? "Stamps" : "스탬프"}</span>
          {activeTab === "stamps" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-coral"
              layoutId="activeTabIndicator"
            />
          )}
        </button>
        <button
          className={`flex items-center px-4 py-3 relative ${activeTab === "quests" ? "text-brand-coral" : "text-stone-gray"}`}
          onClick={() => handleTabChange("quests")}
        >
          <FaTasks className="mr-2" />
          <span>{currentLanguage === "en" ? "Quests" : "퀘스트"}</span>
          {activeTab === "quests" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-coral"
              layoutId="activeTabIndicator"
            />
          )}
        </button>
        <button
          className={`flex items-center px-4 py-3 relative ${activeTab === "notes" ? "text-brand-coral" : "text-stone-gray"}`}
          onClick={() => handleTabChange("notes")}
        >
          <FaBook className="mr-2" />
          <span>{currentLanguage === "en" ? "Notes" : "노트"}</span>
          {activeTab === "notes" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-coral"
              layoutId="activeTabIndicator"
            />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "stamps" && renderStampsTab()}
        {activeTab === "quests" && renderQuestsTab()}
        {activeTab === "notes" && renderNotesTab()}
      </div>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
        currentLanguage={currentLanguage}
        cityName={city.name}
      />
      <StampDetailsModal
        isOpen={showStampDetailsModal}
        onClose={() => setShowStampDetailsModal(false)}
        currentLanguage={currentLanguage}
        stampId={selectedStampId}
      />
    </div>
  )
}

export default CitySection
