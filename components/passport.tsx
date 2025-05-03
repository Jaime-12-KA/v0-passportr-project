"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { FaMapMarkedAlt, FaGlobeAsia, FaPassport, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

interface PassportProps {
  city: string
  currentLanguage: string
  onClose: () => void
}

const Passport = ({ city, currentLanguage, onClose }: PassportProps) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [pageDirection, setPageDirection] = useState<"next" | "prev">("next")

  // 도시별 데이터
  const cityData = {
    seoul: {
      name: currentLanguage === "en" ? "Seoul" : "서울",
      country: currentLanguage === "en" ? "South Korea" : "대한민국",
      coverImage: "/images/passportr-cover3.png",
      stamps: [
        {
          id: "gyeongbokgung",
          name: currentLanguage === "en" ? "Gyeongbokgung Palace" : "경복궁",
          image: "/images/gyeongbokgung.jpeg",
          date: "2023-09-15",
          description:
            currentLanguage === "en"
              ? "The main royal palace of the Joseon dynasty, built in 1395."
              : "1395년에 지어진 조선 왕조의 주요 궁궐.",
        },
        {
          id: "hongdae",
          name: currentLanguage === "en" ? "Hongdae Street" : "홍대 거리",
          image: "/images/hongdae.jpeg",
          date: "2023-09-16",
          description:
            currentLanguage === "en"
              ? "A vibrant area known for its youthful and artistic atmosphere."
              : "젊고 예술적인 분위기로 유명한 활기찬 지역.",
        },
        {
          id: "gwangjang",
          name: currentLanguage === "en" ? "Gwangjang Market" : "광장시장",
          image: "/images/gwangjang.jpeg",
          date: "2023-09-17",
          description:
            currentLanguage === "en"
              ? "One of the oldest and largest traditional markets in Seoul."
              : "서울에서 가장 오래되고 큰 전통 시장 중 하나.",
        },
        {
          id: "bukchon",
          name: currentLanguage === "en" ? "Bukchon Hanok Village" : "북촌 한옥마을",
          image: "/images/bukchon.jpeg",
          date: "2023-09-18",
          description:
            currentLanguage === "en"
              ? "A traditional Korean village featuring hanok houses."
              : "한옥 주택이 있는 전통 한국 마을.",
        },
      ],
      watermark: "/images/seoul-watermark.png",
    },
    busan: {
      name: currentLanguage === "en" ? "Busan" : "부산",
      country: currentLanguage === "en" ? "South Korea" : "대한민국",
      coverImage: "/images/passportr-cover3.png",
      stamps: [
        {
          id: "haeundae",
          name: currentLanguage === "en" ? "Haeundae Beach" : "해운대 해변",
          image: "/images/Stamp-Haeundae Beach.jpg",
          date: "2023-08-10",
          description:
            currentLanguage === "en"
              ? "The most famous beach in Busan, known for its beautiful coastline."
              : "아름다운 해안선으로 유명한 부산의 가장 유명한 해변.",
        },
        {
          id: "gamcheon",
          name: currentLanguage === "en" ? "Gamcheon Culture Village" : "감천문화마을",
          image: "/images/Stamp_Gamcheon Culture Village.jpg",
          date: "2023-08-11",
          description:
            currentLanguage === "en"
              ? "A colorful village known as the 'Machu Picchu of Busan'."
              : "'부산의 마추픽추'로 알려진 다채로운 마을.",
        },
        {
          id: "jagalchi",
          name: currentLanguage === "en" ? "Jagalchi Market" : "자갈치시장",
          image: "/images/Stamp_Jagalchi Market.jpg",
          date: "2023-08-12",
          description:
            currentLanguage === "en"
              ? "Korea's largest seafood market, offering fresh catches daily."
              : "매일 신선한 해산물을 제공하는 한국 최대의 해산물 시장.",
        },
      ],
      watermark: "/images/busan-illustration.jpeg",
    },
    bangkok: {
      name: currentLanguage === "en" ? "Bangkok" : "방콕",
      country: currentLanguage === "en" ? "Thailand" : "태국",
      coverImage: "/images/passportr-cover3.png",
      stamps: [
        {
          id: "grand-palace",
          name: currentLanguage === "en" ? "Grand Palace" : "왕궁",
          image: "/images/grand-palace.jpg",
          date: "2023-07-05",
          description:
            currentLanguage === "en"
              ? "The former residence of the Kings of Siam and Thailand."
              : "시암과 태국 왕의 이전 거주지.",
        },
        {
          id: "chatuchak",
          name: currentLanguage === "en" ? "Chatuchak Weekend Market" : "짜뚜짝 주말 시장",
          image: "/images/chatuchak.jpg",
          date: "2023-07-06",
          description:
            currentLanguage === "en"
              ? "One of the world's largest weekend markets with over 15,000 stalls."
              : "15,000개 이상의 노점이 있는 세계 최대 주말 시장 중 하나.",
        },
        {
          id: "wat-arun",
          name: currentLanguage === "en" ? "Wat Arun" : "왓 아룬",
          image: "/images/wat-arun.jpg",
          date: "2023-07-07",
          description:
            currentLanguage === "en"
              ? "Temple of Dawn, a stunning riverside temple with a distinctive spire."
              : "독특한 첨탑이 있는 아름다운 강변 사원인 새벽 사원.",
        },
      ],
      watermark: "/images/bangkok-watermark.png",
    },
    newyork: {
      name: currentLanguage === "en" ? "New York" : "뉴욕",
      country: currentLanguage === "en" ? "United States" : "미국",
      coverImage: "/images/passportr-cover3.png",
      stamps: [
        {
          id: "times-square",
          name: currentLanguage === "en" ? "Times Square" : "타임스 스퀘어",
          image: "/images/newyork-times-square.png",
          date: "2023-06-20",
          description:
            currentLanguage === "en"
              ? "The bustling heart of Manhattan, famous for its bright lights and billboards."
              : "밝은 조명과 광고판으로 유명한 맨해튼의 번화한 중심지.",
        },
        {
          id: "central-park",
          name: currentLanguage === "en" ? "Central Park" : "센트럴 파크",
          image: "/images/newyork-central-park.png",
          date: "2023-06-21",
          description:
            currentLanguage === "en"
              ? "An urban oasis spanning 843 acres in the heart of Manhattan."
              : "맨해튼 중심부에 843에이커에 걸쳐 있는 도시 오아시스.",
        },
        {
          id: "statue-liberty",
          name: currentLanguage === "en" ? "Statue of Liberty" : "자유의 여신상",
          image: "/images/newyork-statue-liberty.png",
          date: "2023-06-22",
          description:
            currentLanguage === "en"
              ? "A symbol of freedom and democracy, gifted by France in 1886."
              : "1886년 프랑스가 선물한 자유와 민주주의의 상징.",
        },
      ],
      watermark: "/images/newyork-illustration.png",
    },
    jeju: {
      name: currentLanguage === "en" ? "Jeju Island" : "제주도",
      country: currentLanguage === "en" ? "South Korea" : "대한민국",
      coverImage: "/images/passportr-cover3.png",
      stamps: [],
      watermark: "/images/seoul-watermark.png", // 임시로 서울 워터마크 사용
    },
  }

  // 현재 도시 데이터 가져오기
  const currentCityData = cityData[city as keyof typeof cityData] || cityData.seoul

  // 페이지 데이터
  const pages = [
    {
      type: "cover",
      content: (
        <div className="passport-cover relative w-full h-full rounded-lg overflow-hidden">
          <Image
            src={currentCityData.coverImage || "/placeholder.svg"}
            alt={`${currentCityData.name} Passport Cover`}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      type: "info",
      content: (
        <div className="passport-info-page relative w-full h-full bg-white p-6 rounded-lg">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <Image
              src={currentCityData.watermark || "/placeholder.svg"}
              alt="Watermark"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <FaPassport className="text-3xl text-brand-blue mr-3" />
              <h2 className="text-2xl font-bold">{currentCityData.name}</h2>
            </div>
            <div className="mb-4">
              <p className="text-sm text-stone-gray mb-1">{currentLanguage === "en" ? "Country" : "국가"}</p>
              <p className="font-medium">{currentCityData.country}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-stone-gray mb-1">{currentLanguage === "en" ? "Passport ID" : "여권 ID"}</p>
              <p className="font-medium">PTR-{city.toUpperCase()}-2023</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-stone-gray mb-1">{currentLanguage === "en" ? "Issue Date" : "발행일"}</p>
              <p className="font-medium">2023-09-01</p>
            </div>
            <div>
              <p className="text-sm text-stone-gray mb-1">
                {currentLanguage === "en" ? "Stamps Collected" : "수집한 스탬프"}
              </p>
              <p className="font-medium">
                {currentCityData.stamps.length} / {currentCityData.stamps.length + 5}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-light-sand">
              <div className="flex justify-between text-sm mb-2">
                <span>{currentLanguage === "en" ? "Completion" : "완성도"}</span>
                <span>{Math.round((currentCityData.stamps.length / (currentCityData.stamps.length + 5)) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill bg-brand-blue"
                  style={{
                    width: `${(currentCityData.stamps.length / (currentCityData.stamps.length + 5)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="absolute bottom-6 right-6">
              <Image
                src="/images/official-passportr-seal.png"
                alt="Official Seal"
                width={80}
                height={80}
                className="opacity-70"
              />
            </div>
          </div>
        </div>
      ),
    },
    ...currentCityData.stamps.map((stamp) => ({
      type: "stamp",
      content: (
        <div className="passport-stamp-page relative w-full h-full bg-white p-6 rounded-lg">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <Image
              src={currentCityData.watermark || "/placeholder.svg"}
              alt="Watermark"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{stamp.name}</h3>
              <div className="text-sm text-stone-gray">{stamp.date}</div>
            </div>

            <div className="flex-1 flex items-center justify-center my-4">
              <div className="relative w-48 h-48">
                <Image
                  src={stamp.image || "/placeholder.svg"}
                  alt={stamp.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm">{stamp.description}</p>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-light-sand">
              <div className="flex items-center text-sm text-stone-gray">
                <FaMapMarkedAlt className="mr-1" />
                <span>
                  {currentLanguage === "en" ? "Visited on" : "방문일"}: {stamp.date}
                </span>
              </div>
              <div className="flex items-center text-sm text-brand-blue">
                <FaGlobeAsia className="mr-1" />
                <span>{currentCityData.name}</span>
              </div>
            </div>
          </div>
        </div>
      ),
    })),
    {
      type: "empty",
      content: (
        <div className="passport-empty-page relative w-full h-full bg-white p-6 rounded-lg">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <Image
              src={currentCityData.watermark || "/placeholder.svg"}
              alt="Watermark"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <div className="text-center">
              <FaMapMarkedAlt className="text-4xl text-light-sand mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {currentLanguage === "en" ? "More adventures await!" : "더 많은 모험이 기다리고 있습니다!"}
              </h3>
              <p className="text-stone-gray">
                {currentLanguage === "en"
                  ? "Check in at more locations to collect stamps"
                  : "더 많은 장소에서 체크인하여 스탬프를 수집하세요"}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      type: "back-cover",
      content: (
        <div className="passport-back-cover relative w-full h-full rounded-lg overflow-hidden">
          <Image
            src={currentCityData.coverImage || "/placeholder.svg"}
            alt={`${currentCityData.name} Passport Back Cover`}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
  ]

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      triggerHapticFeedback(hapticPatterns.light)
      setPageDirection("next")
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setIsFlipping(false)
      }, 300)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      triggerHapticFeedback(hapticPatterns.light)
      setPageDirection("prev")
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setIsFlipping(false)
      }, 300)
    }
  }

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextPage()
      } else if (e.key === "ArrowLeft") {
        prevPage()
      } else if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentPage, onClose])

  // 페이지 넘김 효과를 위한 애니메이션 변수
  const pageVariants = {
    enter: (direction: string) => ({
      x: direction === "next" ? 300 : -300,
      opacity: 0,
      rotateY: direction === "next" ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (direction: string) => ({
      x: direction === "next" ? -300 : 300,
      opacity: 0,
      rotateY: direction === "next" ? -45 : 45,
    }),
  }

  return (
    <div className="passport-viewer fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md">
        <button
          className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
          onClick={onClose}
          aria-label={currentLanguage === "en" ? "Close passport" : "여권 닫기"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="passport-container aspect-[3/4] bg-light-sand rounded-xl shadow-2xl overflow-hidden">
          <AnimatePresence initial={false} custom={pageDirection} mode="wait">
            <motion.div
              key={currentPage}
              custom={pageDirection}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
              className="w-full h-full"
            >
              {pages[currentPage].content}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-4">
          <button
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              currentPage === 0
                ? "bg-light-sand text-stone-gray cursor-not-allowed"
                : "bg-white text-deep-navy hover:bg-brand-blue hover:text-white"
            } transition-colors shadow-md`}
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            aria-label={currentLanguage === "en" ? "Previous page" : "이전 페이지"}
          >
            <FaChevronLeft />
          </button>

          <div className="text-white text-sm">
            {currentPage + 1} / {pages.length}
          </div>

          <button
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              currentPage === pages.length - 1
                ? "bg-light-sand text-stone-gray cursor-not-allowed"
                : "bg-white text-deep-navy hover:bg-brand-blue hover:text-white"
            } transition-colors shadow-md`}
            onClick={nextPage}
            disabled={currentPage === pages.length - 1 || isFlipping}
            aria-label={currentLanguage === "en" ? "Next page" : "다음 페이지"}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Passport
