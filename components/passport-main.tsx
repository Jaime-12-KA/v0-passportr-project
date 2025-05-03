"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { FaPassport, FaChevronRight, FaChevronLeft, FaMapMarkedAlt, FaGlobeAsia, FaPlus } from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import CollectionQuest from "./collection-quest"

interface PassportMainProps {
  currentLanguage: string
  onCitySelect: (cityId: string) => void
  onOpenModal?: (modalId: string) => void
}

const PassportMain = ({ currentLanguage, onCitySelect, onOpenModal }: PassportMainProps) => {
  const [activeCity, setActiveCity] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isInitialRender, setIsInitialRender] = useState(true)

  // 첫 렌더링 후 초기 렌더링 상태 업데이트
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false)
    }
  }, [isInitialRender])

  // 저장된 테마 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem("passportTheme")
    if (savedTheme) {
      // 여기서 테마를 적용하는 로직 추가
      // 예: setCurrentTheme(savedTheme) 또는 다른 상태 업데이트
    }
  }, [])

  // 도시 데이터 - 요청하신 대로 도시 목록 변경 (서울, 부산, 방콕, 뉴욕, 제주도) - London 제거
  const cities = [
    {
      id: "seoul",
      name: currentLanguage === "en" ? "Seoul" : "서울",
      country: currentLanguage === "en" ? "South Korea" : "대한민국",
      image: "/images/cover_seoul.png", // 수정된 경로
      stamps: 24,
      totalStamps: 35,
      lastVisited: currentLanguage === "en" ? "2 days ago" : "2일 전",
    },
    {
      id: "busan",
      name: currentLanguage === "en" ? "Busan" : "부산",
      country: currentLanguage === "en" ? "South Korea" : "대한민국",
      image: "/images/cover_busan.png", // 수정된 경로
      stamps: 8,
      totalStamps: 20,
      lastVisited: currentLanguage === "en" ? "1 month ago" : "1개월 전",
    },
    {
      id: "bangkok",
      name: currentLanguage === "en" ? "Bangkok" : "방콕",
      country: currentLanguage === "en" ? "Thailand" : "태국",
      image: "/images/cover_bangkok.png", // 수정된 경로
      stamps: 12,
      totalStamps: 28,
      lastVisited: currentLanguage === "en" ? "2 weeks ago" : "2주 전",
    },
    {
      id: "newyork",
      name: currentLanguage === "en" ? "New York" : "뉴욕",
      country: currentLanguage === "en" ? "United States" : "미국",
      image: "/images/cover_newyork.png", // 수정된 경로
      stamps: 3,
      totalStamps: 25,
      lastVisited: currentLanguage === "en" ? "6 months ago" : "6개월 전",
    },
    {
      id: "jeju",
      name: currentLanguage === "en" ? "Jeju Island" : "제주도",
      country: currentLanguage === "en" ? "South Korea" : "대한민국",
      image: "/images/cover_jeju.png", // 수정된 경로
      stamps: 0,
      totalStamps: 18,
      lastVisited: currentLanguage === "en" ? "Never visited" : "방문한 적 없음",
    },
  ]

  // Collection quests data
  const collectionQuests = [
    {
      title: currentLanguage === "en" ? "Seoul Street Food Tour" : "서울 길거리 음식 투어",
      progress: "5/8",
      progressPercent: 63,
      stamps: 5,
      totalStamps: 8,
      color: "sunset-coral",
      icon: "utensils",
      xp: 400,
    },
    {
      title: currentLanguage === "en" ? "Seoul Historical Sites" : "서울 역사 유적지",
      progress: "2/6",
      progressPercent: 33,
      stamps: 2,
      totalStamps: 6,
      color: "sky-blue",
      icon: "landmark",
      xp: 300,
    },
    {
      title: currentLanguage === "en" ? "Bangkok Taste & Style" : "방콕 맛과 멋",
      progress: "3/7",
      progressPercent: 43,
      stamps: 3,
      totalStamps: 7,
      color: "sunshine-yellow",
      icon: "map-marker",
      xp: 350,
    },
  ]

  const handleCitySelect = (index: number) => {
    triggerHapticFeedback(hapticPatterns.medium)
    setActiveCity(index)
    onCitySelect(cities[index].id)
  }

  const scrollLeft = () => {
    if (sliderRef.current && activeCity > 0) {
      triggerHapticFeedback(hapticPatterns.light)
      setActiveCity(activeCity - 1)
    }
  }

  const scrollRight = () => {
    if (sliderRef.current && activeCity < cities.length) {
      triggerHapticFeedback(hapticPatterns.light)
      setActiveCity(activeCity + 1)
    }
  }

  const handleAddNewPassport = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    if (onOpenModal) {
      onOpenModal("newPassportModal")
    }
  }

  const handleAddNewCollection = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    if (onOpenModal) {
      onOpenModal("newCollectionModal")
    }
  }

  return (
    <div className="passport-main">
      {/* User Identity Section */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-light-sand">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-brand-blue">
            <Image
              src="/images/new-cover-classic.png"
              alt="Passportr main cover"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              style={{ filter: "saturate(1.4) brightness(1.2)" }}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Jaime Sung</h2>
            <div className="flex items-center text-sm text-stone-gray">
              <FaPassport className="mr-1" />
              <span>ID: PTR-2023-JS</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center text-cloud-white font-bold text-xl">
              12
            </div>
            <span className="text-xs mt-1">{currentLanguage === "en" ? "Explorer Level" : "탐험가 레벨"}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-light-sand">
          <div className="flex justify-between text-sm mb-2">
            <span>{currentLanguage === "en" ? "Global Progress" : "전체 진행도"}</span>
            <span className="font-medium">
              {cities.reduce((acc, city) => acc + city.stamps, 0)}/
              {cities.reduce((acc, city) => acc + city.totalStamps, 0)} {currentLanguage === "en" ? "Stamps" : "스탬프"}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill bg-brand-blue"
              style={{
                width: `${(cities.reduce((acc, city) => acc + city.stamps, 0) / cities.reduce((acc, city) => acc + city.totalStamps, 0)) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* City Cards Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold serif-font">{currentLanguage === "en" ? "My Passport" : "내 여권"}</h3>
          <div className="flex space-x-2">
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeCity === 0
                  ? "bg-light-sand text-stone-gray cursor-not-allowed"
                  : "bg-brand-blue text-cloud-white hover:bg-brand-blue/90"
              }`}
              onClick={scrollLeft}
              disabled={activeCity === 0}
            >
              <FaChevronLeft />
            </button>
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeCity === cities.length
                  ? "bg-light-sand text-stone-gray cursor-not-allowed"
                  : "bg-brand-blue text-cloud-white hover:bg-brand-blue/90"
              }`}
              onClick={scrollRight}
              disabled={activeCity === cities.length}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeCity * 100}%)` }}
          >
            {cities.map((city, index) => (
              <div key={city.id} className="w-full flex-shrink-0 px-1">
                <motion.div
                  className="city-card bg-white rounded-xl overflow-hidden shadow-sm border border-light-sand cursor-pointer"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                  onClick={() => handleCitySelect(index)}
                  animate={{
                    scale: activeCity === index ? 1 : 0.95,
                    opacity: activeCity === index ? 1 : 0.7,
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

            {/* Add New Passport Card */}
            <div className="w-full flex-shrink-0 px-1">
              <motion.div
                className="city-card bg-white rounded-xl overflow-hidden shadow-sm border border-light-sand cursor-pointer h-full flex flex-col"
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                onClick={handleAddNewPassport}
                animate={{
                  scale: activeCity === cities.length ? 1 : 0.95,
                  opacity: activeCity === cities.length ? 1 : 0.7,
                }}
              >
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="w-20 h-20 rounded-full bg-light-sand flex items-center justify-center mb-4">
                    <FaPlus className="text-3xl text-[#1E88E5]" />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">
                    {currentLanguage === "en" ? "Add New Passport" : "새 여권 추가"}
                  </h3>
                  <p className="text-stone-gray text-center text-sm">
                    {currentLanguage === "en"
                      ? "Explore a new city and collect stamps"
                      : "새로운 도시를 탐험하고 스탬프를 수집하세요"}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          {cities.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${activeCity === index ? "bg-brand-blue" : "bg-light-sand"}`}
              onClick={() => handleCitySelect(index)}
            />
          ))}
          <button
            className={`w-2 h-2 rounded-full mx-1 ${activeCity === cities.length ? "bg-brand-blue" : "bg-light-sand"}`}
            onClick={() => {
              triggerHapticFeedback(hapticPatterns.light)
              setActiveCity(cities.length)
            }}
          />
        </div>
      </div>

      {/* Collection Quests Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold serif-font">
            {currentLanguage === "en" ? "Collection Quests" : "컬렉션 퀘스트"}
          </h3>
          <button
            className="px-3 py-1 bg-light-sand text-deep-navy rounded-lg flex items-center hover:bg-stone-gray hover:text-white transition-colors text-sm"
            onClick={handleAddNewCollection}
          >
            <FaPlus className="mr-1" />
            <span>{currentLanguage === "en" ? "New Collection" : "새 컬렉션"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collectionQuests.map((quest, index) => (
            <CollectionQuest
              key={index}
              title={quest.title}
              progress={quest.progress}
              progressPercent={quest.progressPercent}
              stamps={quest.stamps}
              totalStamps={quest.totalStamps}
              color={quest.color}
              currentLanguage={currentLanguage}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-light-sand rounded-xl p-6">
        <h3 className="text-xl font-bold serif-font mb-4">
          {currentLanguage === "en" ? "Recent Activity" : "최근 활동"}
        </h3>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-brand-coral rounded-full flex items-center justify-center text-[#1E88E5] mr-3 flex-shrink-0">
                <FaMapMarkedAlt />
              </div>
              <div>
                <p className="font-medium text-deep-navy">
                  {currentLanguage === "en"
                    ? "You checked in at Starbucks Myeongdong"
                    : "명동 스타벅스에서 체크인했습니다"}
                </p>
                <p className="text-sm text-stone-gray">{currentLanguage === "en" ? "1 day ago" : "1일 전"}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-[#1E88E5] mr-3 flex-shrink-0">
                <FaPassport />
              </div>
              <div>
                <p className="font-medium text-deep-navy">
                  {currentLanguage === "en"
                    ? "You earned the 'Seoul Explorer' badge"
                    : "'서울 탐험가' 배지를 획득했습니다"}
                </p>
                <p className="text-sm text-stone-gray">{currentLanguage === "en" ? "3 days ago" : "3일 전"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PassportMain
