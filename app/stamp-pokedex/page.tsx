"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { X, ArrowLeft } from "lucide-react"
import {
  FaArrowLeft,
  FaHeart,
  FaStar,
  FaShare,
  FaLandmark,
  FaHome,
  FaCity,
  FaStore,
  FaTree,
  FaBuilding,
  FaUmbrellaBeach,
} from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import Image from "next/image"

type StampPokedexPageProps = {}

interface TipType {
  avatar: string
  username: string
  text: string
  likes: number
}

interface StampType {
  id: string
  name: string
  image: string
  date: string
  location: string
  city: string
  category: string
  rarity: number
  type: string
  level: number
  collection: string
  collectionProgress: string
  flavorText: string
  tips: TipType[]
}

export default function StampPokedexPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedStamp, setSelectedStamp] = useState<StampType | null>(null)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [loading, setLoading] = useState(false)

  // Load language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage === "ko" ? "kr" : savedLanguage)
    }
  }, [])

  // Sample stamp data
  const stamps: StampType[] = [
    {
      id: "gyeongbokgung",
      name: currentLanguage === "en" ? "Gyeongbokgung Palace" : "경복궁",
      image: "/images/gyeongbokgung.png",
      date: "April 20, 2025",
      location: "Jongno-gu, Seoul",
      city: "seoul",
      category: "landmark",
      rarity: 1490,
      type: "historic",
      level: 3,
      collection: "Seoul Palaces",
      collectionProgress: "1/5",
      flavorText:
        currentLanguage === "en"
          ? "The grandest of Seoul's five royal palaces, Gyeongbokgung was built in 1395 and served as the main royal palace of the Joseon dynasty."
          : "서울의 5대 궁궐 중 가장 웅장한 경복궁은 1395년에 지어졌으며 조선 왕조의 주요 왕궁으로 사용되었습니다.",
      tips: [
        {
          avatar: "/images/Friends_Minji Kim.jpg",
          username: "Minji Kim",
          text: currentLanguage === "en" ? "The night view here is breathtaking!" : "여기 야경이 정말 멋져요!",
          likes: 18,
        },
        {
          avatar: "/images/Friends_Tom Park.jpg",
          username: "Tom Park",
          text:
            currentLanguage === "en"
              ? "Visit early morning to avoid crowds. The changing of the guard ceremony at 10am is a must-see!"
              : "사람들을 피하려면 이른 아침에 방문하세요. 오전 10시 수문장 교대식은 꼭 봐야 해요!",
          likes: 24,
        },
        {
          avatar: "/images/Friends_Sarah Lee.jpg",
          username: "Sarah Lee",
          text:
            currentLanguage === "en"
              ? "There's a great traditional tea house inside the palace grounds."
              : "궁 안에 훌륭한 전통 찻집이 있어요.",
          likes: 12,
        },
      ],
    },
    {
      id: "bukchon",
      name: currentLanguage === "en" ? "Bukchon Hanok Village" : "북촌 한옥마을",
      image: "/images/bukchon.png",
      date: "April 21, 2025",
      location: "Jongno-gu, Seoul",
      city: "seoul",
      category: "cultural",
      rarity: 1275,
      type: "village",
      level: 2,
      collection: "Traditional Seoul",
      collectionProgress: "1/4",
      flavorText:
        currentLanguage === "en"
          ? "A charming neighborhood filled with traditional Korean houses (hanoks) that date back to the Joseon Dynasty, offering a glimpse into Korea's architectural heritage."
          : "조선 시대로 거슬러 올라가는 전통 한옥들로 가득한 매력적인 동네로, 한국의 건축 유산을 엿볼 수 있는 곳입니다.",
      tips: [
        {
          avatar: "/images/Friends_James Choi.jpg",
          username: "James Choi",
          text:
            currentLanguage === "en"
              ? "The best views are from the top of the hill. Worth the climb!"
              : "언덕 꼭대기에서 가장 좋은 전망을 볼 수 있어요. 오르는 가치가 있어요!",
          likes: 15,
        },
        {
          avatar: "/images/Friends_Sarah Lee.jpg",
          username: "Sarah Lee",
          text:
            currentLanguage === "en"
              ? "Try to be quiet as people actually live in these hanoks."
              : "실제로 사람들이 한옥에 살고 있으니 조용히 해주세요.",
          likes: 32,
        },
      ],
    },
    {
      id: "hongdae",
      name: currentLanguage === "en" ? "Hongdae Street" : "홍대 거리",
      image: "/images/hongdae.png",
      date: "April 22, 2025",
      location: "Mapo-gu, Seoul",
      city: "seoul",
      category: "entertainment",
      rarity: 1105,
      type: "urban",
      level: 2,
      collection: "Urban Vibes",
      collectionProgress: "2/6",
      flavorText:
        currentLanguage === "en"
          ? "A vibrant district known for its youthful energy, street performances, trendy shops, and bustling nightlife near Hongik University."
          : "홍익대학교 근처에 위치한 젊은 에너지, 거리 공연, 트렌디한 상점, 활기찬 밤문화로 유명한 활기찬 지역입니다.",
      tips: [
        {
          avatar: "/images/Friends_Tom Park.jpg",
          username: "Tom Park",
          text:
            currentLanguage === "en"
              ? "The street performers come out after 7pm. Amazing talent!"
              : "길거리 공연자들은 오후 7시 이후에 나와요. 놀라운 재능이죠!",
          likes: 27,
        },
        {
          avatar: "/images/Friends_Minji Kim.jpg",
          username: "Minji Kim",
          text:
            currentLanguage === "en"
              ? "Check out the underground shopping area for unique fashion finds."
              : "독특한 패션 아이템을 찾으려면 지하 쇼핑 구역을 확인해보세요.",
          likes: 19,
        },
      ],
    },
    {
      id: "gwangjang",
      name: currentLanguage === "en" ? "Gwangjang Market" : "광장시장",
      image: "/images/gwangjang.png",
      date: "April 23, 2025",
      location: "Jongno-gu, Seoul",
      city: "seoul",
      category: "food",
      rarity: 1390,
      type: "market",
      level: 3,
      collection: "Seoul Food Tour",
      collectionProgress: "3/8",
      flavorText:
        currentLanguage === "en"
          ? "One of Seoul's oldest and largest traditional markets, famous for its street food stalls serving authentic Korean delicacies."
          : "서울에서 가장 오래되고 큰 전통 시장 중 하나로, 정통 한국 음식을 제공하는 길거리 음식 노점으로 유명합니다.",
      tips: [
        {
          avatar: "/images/Friends_James Choi.jpg",
          username: "James Choi",
          text:
            currentLanguage === "en"
              ? "The bindaetteok (mung bean pancake) is a must-try!"
              : "빈대떡은 꼭 먹어봐야 해요!",
          likes: 41,
        },
        {
          avatar: "/images/Friends_Sarah Lee.jpg",
          username: "Sarah Lee",
          text:
            currentLanguage === "en"
              ? "Go hungry and try a little from many different stalls."
              : "배고픈 상태로 가서 여러 가게에서 조금씩 맛보세요.",
          likes: 33,
        },
      ],
    },
    {
      id: "starbucks",
      name: currentLanguage === "en" ? "Starbucks Myeongdong" : "스타벅스 명동점",
      image: "/images/starbucks.png",
      date: "April 24, 2025",
      location: "Jung-gu, Seoul",
      city: "seoul",
      category: "cafe",
      rarity: 850,
      type: "cafe",
      level: 1,
      collection: "Seoul Cafes",
      collectionProgress: "1/10",
      flavorText:
        currentLanguage === "en"
          ? "A popular Starbucks location in the heart of Myeongdong shopping district, offering Korea-exclusive seasonal drinks and merchandise."
          : "명동 쇼핑 지구 중심부에 위치한 인기 있는 스타벅스로, 한국 전용 시즌 음료와 상품을 제공합니다.",
      tips: [
        {
          avatar: "/images/Friends_Minji Kim.jpg",
          username: "Minji Kim",
          text:
            currentLanguage === "en"
              ? "Try the Korea-exclusive drinks like the Jeju Tangerine Latte!"
              : "제주 귤 라떼 같은 한국 전용 음료를 시도해보세요!",
          likes: 22,
        },
        {
          avatar: "/images/Friends_Tom Park.jpg",
          username: "Tom Park",
          text:
            currentLanguage === "en"
              ? "The second floor has the best seats with a view of the busy street."
              : "2층에 번화가를 볼 수 있는 가장 좋은 자리가 있어요.",
          likes: 17,
        },
      ],
    },
    {
      id: "haeundae",
      name: currentLanguage === "en" ? "Haeundae Beach" : "해운대 해변",
      image: "/images/haeundae.png",
      date: "May 15, 2025",
      location: "Haeundae-gu, Busan",
      city: "busan",
      category: "nature",
      rarity: 1683,
      type: "beach",
      level: 4,
      collection: "Busan Beaches",
      collectionProgress: "1/3",
      flavorText:
        currentLanguage === "en"
          ? "Korea's most famous beach, stretching 1.5km along Busan's coastline, known for its fine sand, beautiful views, and vibrant atmosphere."
          : "부산 해안선을 따라 1.5km 길이로 뻗어 있는 한국에서 가장 유명한 해변으로, 고운 모래, 아름다운 전망, 활기찬 분위기로 유명합니다.",
      tips: [
        {
          avatar: "/images/Friends_James Choi.jpg",
          username: "James Choi",
          text:
            currentLanguage === "en"
              ? "Visit during sunset for the most beautiful views!"
              : "가장 아름다운 전망을 위해 일몰 시간에 방문하세요!",
          likes: 38,
        },
        {
          avatar: "/images/Friends_Sarah Lee.jpg",
          username: "Sarah Lee",
          text:
            currentLanguage === "en"
              ? "The seafood restaurants along the beach are amazing."
              : "해변을 따라 있는 해산물 식당들이 정말 훌륭해요.",
          likes: 29,
        },
      ],
    },
    {
      id: "gamcheon",
      name: currentLanguage === "en" ? "Gamcheon Culture Village" : "감천문화마을",
      image: "/images/gamcheon.png",
      date: "May 16, 2025",
      location: "Saha-gu, Busan",
      city: "busan",
      category: "cultural",
      rarity: 1512,
      type: "village",
      level: 3,
      collection: "Colorful Busan",
      collectionProgress: "1/4",
      flavorText:
        currentLanguage === "en"
          ? "Often called the 'Machu Picchu of Busan', this hillside community features colorful houses, narrow alleys, and artistic installations."
          : "종종 '부산의 ��추픽��'라고 불리는 이 언덕 위 마을은 다채로운 집들, 좁은 골목길, 예술적인 설치물이 특징입니다.",
      tips: [
        {
          avatar: "/images/Friends_Minji Kim.jpg",
          username: "Minji Kim",
          text:
            currentLanguage === "en"
              ? "Follow the stamp collection map for a fun way to explore the village!"
              : "마을을 탐험하는 재미있는 방법으로 스탬프 수집 지도를 따라가보세요!",
          likes: 31,
        },
        {
          avatar: "/images/Friends_Tom Park.jpg",
          username: "Tom Park",
          text:
            currentLanguage === "en"
              ? "Wear comfortable shoes - lots of steep stairs!"
              : "편안한 신발을 신으세요 - 가파른 계단이 많아요!",
          likes: 25,
        },
      ],
    },
    {
      id: "grandpalace",
      name: currentLanguage === "en" ? "Grand Palace" : "왕궁",
      image: "/images/watphrakew.png",
      date: "June 10, 2025",
      location: "Phra Nakhon, Bangkok",
      city: "bangkok",
      category: "landmark",
      rarity: 1875,
      type: "historic",
      level: 4,
      collection: "Bangkok Landmarks",
      collectionProgress: "1/5",
      flavorText:
        currentLanguage === "en"
          ? "The former residence of Thai kings, this magnificent complex showcases intricate architecture and sacred Buddhist temples."
          : "태국 왕들의 옛 거주지로, 이 웅장한 단지는 정교한 건축물과 신성한 불교 사원을 보여줍니다.",
      tips: [
        {
          avatar: "/images/Friends_James Choi.jpg",
          username: "James Choi",
          text:
            currentLanguage === "en"
              ? "Dress modestly - shoulders and knees must be covered to enter."
              : "단정한 복장을 갖추세요 - 입장하려면 어깨와 무릎이 가려져야 해요.",
          likes: 45,
        },
        {
          avatar: "/images/Friends_Sarah Lee.jpg",
          username: "Sarah Lee",
          text:
            currentLanguage === "en"
              ? "Go early to avoid both crowds and the midday heat."
              : "사람들과 한낮의 더위를 피하려면 일찍 가세요.",
          likes: 37,
        },
      ],
    },
    {
      id: "watarun",
      name: currentLanguage === "en" ? "Wat Arun" : "왓 아룬",
      image: "/images/watarun.png",
      date: "June 11, 2025",
      location: "Bangkok Yai, Bangkok",
      city: "bangkok",
      category: "landmark",
      rarity: 1762,
      type: "temple",
      level: 4,
      collection: "Bangkok Temples",
      collectionProgress: "2/7",
      flavorText:
        currentLanguage === "en"
          ? "Known as the Temple of Dawn, this stunning riverside temple is decorated with colorful porcelain and seashells that glitter in the sunlight."
          : "새벽 사원으로 알려진 이 아름다운 강변 사원은 햇빛에 반짝이는 다채로운 도자기와 조개껍질로 장식되어 있습니다.",
      tips: [
        {
          avatar: "/images/Friends_Minji Kim.jpg",
          username: "James Choi",
          text:
            currentLanguage === "en"
              ? "The view from across the river at sunset is spectacular!"
              : "일몰 때 강 건너편에서 보는 전망이 환상적이에요!",
          likes: 42,
        },
        {
          avatar: "/images/Friends_Sarah Lee.jpg",
          username: "Sarah Lee",
          text:
            currentLanguage === "en"
              ? "The steps to climb up are very steep - be careful!"
              : "올라가는 계단이 매우 가파르니 조심하세요!",
          likes: 33,
        },
      ],
    },
    {
      id: "timessquare",
      name: currentLanguage === "en" ? "Times Square" : "타임스 스퀘어",
      image: "/images/timessquare.png",
      date: "July 4, 2025",
      location: "Manhattan, New York",
      city: "newyork",
      category: "landmark",
      rarity: 1567,
      type: "urban",
      level: 3,
      collection: "NYC Icons",
      collectionProgress: "1/6",
      flavorText:
        currentLanguage === "en"
          ? "The dazzling heart of Manhattan, famous for its bright lights, Broadway theaters, and the iconic New Year's Eve ball drop celebration."
          : "맨해튼의 눈부신 중심지로, 밝은 조명, 브로드웨이 극장, 상징적인 새해 전야 볼 드롭 행사로 유명합니다.",
      tips: [
        {
          avatar: "/images/Friends_Minji Kim.jpg",
          username: "James Choi",
          text:
            currentLanguage === "en"
              ? "Visit at night for the full experience of all the lights!"
              : "모든 조명의 완전한 경험을 위해 밤에 방문하세요!",
          likes: 51,
        },
        {
          avatar: "/images/Friends_Sarah Lee.jpg",
          username: "Sarah Lee",
          text:
            currentLanguage === "en"
              ? "Be aware of your belongings - it's very crowded."
              : "소지품에 주의하세요 - 매우 붐빕니다.",
          likes: 39,
        },
      ],
    },
    {
      id: "centralpark",
      name: currentLanguage === "en" ? "Central Park" : "센트럴 파크",
      image: "/images/centralpark.png",
      date: "July 5, 2025",
      location: "Manhattan, New York",
      city: "newyork",
      category: "nature",
      rarity: 1428,
      type: "park",
      level: 3,
      collection: "NYC Green Spaces",
      collectionProgress: "1/3",
      flavorText:
        currentLanguage === "en"
          ? "An urban oasis in the heart of Manhattan, offering lush landscapes, recreational activities, and a peaceful retreat from the city's hustle."
          : "맨해튼 중심부에 위치한 도시 오아시스로, 울창한 풍경, 레크리에이션 활동, 도시의 번잡함에서 벗어난 평화로운 휴식처를 제공합니다.",
      tips: [
        {
          avatar: "/images/Friends_Tom Park.jpg",
          username: "James Choi",
          text:
            currentLanguage === "en"
              ? "Rent a rowboat on the lake for a romantic experience!"
              : "로맨틱한 경험을 위해 호수에서 노를 젓는 보트를 빌려보세요!",
          likes: 47,
        },
        {
          avatar: "/images/Friends_Sarah Lee.jpg",
          username: "Tom Park",
          text:
            currentLanguage === "en"
              ? "The park is huge - download a map or you might get lost."
              : "공원이 매우 넓으니 지도를 다운로드하세요, 그렇지 않으면 길을 잃을 수 있어요.",
          likes: 35,
        },
      ],
    },
  ]

  // Get type icon based on stamp type
  const getTypeIcon = (type: string) => {
    const typeIcons: { [key: string]: JSX.Element } = {
      historic: <FaLandmark className="mr-1" />,
      village: <FaHome className="mr-1" />,
      urban: <FaCity className="mr-1" />,
      market: <FaStore className="mr-1" />,
      cafe: <FaStore className="mr-1" />,
      beach: <FaUmbrellaBeach className="mr-1" />,
      temple: <FaBuilding className="mr-1" />,
      park: <FaTree className="mr-1" />,
    }
    return typeIcons[type] || <FaLandmark className="mr-1" />
  }

  // Get type color based on stamp type
  const getTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      historic: "#B8A038", // Ground/Normal brown
      village: "#A8B820", // Bug/Grass green
      urban: "#A890F0", // Psychic purple
      market: "#F08030", // Fire orange
      cafe: "#C03028", // Fighting/Fire red
      beach: "#6890F0", // Water blue
      temple: "#F85888", // Psychic/Fairy pink
      park: "#78C850", // Grass green
    }
    return typeColors[type] || "#68A090"
  }

  // Get rarity text and border color
  const getRarityInfo = (rarity: number) => {
    if (rarity >= 1800) {
      return {
        text: currentLanguage === "en" ? "LEGENDARY" : "전설적",
        border: "border-yellow-400",
        textColor: "text-yellow-600",
      }
    }
    if (rarity >= 1500) {
      return {
        text: currentLanguage === "en" ? "ULTRA RARE" : "초희귀",
        border: "border-purple-500",
        textColor: "text-purple-600",
      }
    }
    if (rarity >= 1200) {
      return {
        text: currentLanguage === "en" ? "RARE" : "희귀",
        border: "border-blue-500",
        textColor: "text-blue-600",
      }
    }
    if (rarity >= 900) {
      return {
        text: currentLanguage === "en" ? "UNCOMMON" : "일반적",
        border: "border-green-400",
        textColor: "text-green-600",
      }
    }
    return {
      text: currentLanguage === "en" ? "COMMON" : "흔함",
      border: "border-gray-300",
      textColor: "text-gray-600",
    }
  }

  // Get level stars
  const renderLevelStars = (level: number) => {
    const stars = []
    for (let i = 0; i < level; i++) {
      stars.push(<FaStar key={i} className="text-brand-yellow" />)
    }
    return stars
  }

  const handleFilterChange = (filter: string) => {
    triggerHapticFeedback(hapticPatterns.light)
    setActiveFilter(filter)
  }

  const handleStampSelect = (stamp: StampType) => {
    triggerHapticFeedback(hapticPatterns.medium)
    setLoading(true)
    // Simulate loading like Pokemon GO
    setTimeout(() => {
      setSelectedStamp(stamp)
      setLoading(false)
    }, 800)
  }

  const handleBackToPokedex = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setSelectedStamp(null)
  }

  const handleBackToProfile = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    router.push("/")
  }

  const filteredStamps =
    activeFilter === "all"
      ? stamps
      : stamps.filter((stamp) =>
          activeFilter === "city"
            ? stamp.city === "seoul" // Just for demo, filter to Seoul stamps
            : activeFilter === "recent"
              ? true // In a real app, would filter by date
              : stamp.category === activeFilter,
        )

  // Pokemon GO inspired animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const cardHoverVariants = {
    hover: {
      y: -8,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  }

  const translations = {
    stampCollection: currentLanguage === "en" ? "My Stamp Collection" : "내 스탬프 도감",
    all: currentLanguage === "en" ? "All" : "전체",
    byCity: currentLanguage === "en" ? "By City" : "도시별",
    recent: currentLanguage === "en" ? "Recent" : "최근",
    landmarks: currentLanguage === "en" ? "Landmarks" : "랜드마크",
    food: currentLanguage === "en" ? "Food" : "음식",
    cultural: currentLanguage === "en" ? "Cultural" : "문화",
    entertainment: currentLanguage === "en" ? "Entertainment" : "엔터테인먼트",
    nature: currentLanguage === "en" ? "Nature" : "자연",
    cafe: currentLanguage === "en" ? "Cafes" : "카페",
    stampDetails: currentLanguage === "en" ? "Stamp Details" : "스탬프 상세",
    dateAcquired: currentLanguage === "en" ? "Acquired on" : "획득 날짜",
    location: currentLanguage === "en" ? "Location" : "위치",
    localTips: currentLanguage === "en" ? "Local Tips" : "현지인 팁",
    seeMoreTips: currentLanguage === "en" ? "See More Tips" : "더 많은 팁 보기",
    myNotes: currentLanguage === "en" ? "My Notes" : "내 노트",
    addNote: currentLanguage === "en" ? "Add a personal note..." : "개인 노트 추가...",
    rarity: currentLanguage === "en" ? "Rarity" : "희귀도",
    level: currentLanguage === "en" ? "Level" : "레벨",
    type: currentLanguage === "en" ? "Type" : "타입",
    loading: currentLanguage === "en" ? "Loading..." : "로딩 중...",
    collection: currentLanguage === "en" ? "Collection" : "컬렉션",
    memoryPoints: currentLanguage === "en" ? "Memory Points" : "메모리 포인트",
    flavorText: currentLanguage === "en" ? "About this place" : "이 장소에 대하여",
    favorite: currentLanguage === "en" ? "Favorite" : "즐겨찾기",
    share: currentLanguage === "en" ? "Share" : "공유하기",
    historic: currentLanguage === "en" ? "HISTORIC" : "역사적",
    village: currentLanguage === "en" ? "VILLAGE" : "마을",
    urban: currentLanguage === "en" ? "URBAN" : "도시",
    market: currentLanguage === "en" ? "MARKET" : "시장",
    beach: currentLanguage === "en" ? "BEACH" : "해변",
    temple: currentLanguage === "en" ? "TEMPLE" : "사원",
    park: currentLanguage === "en" ? "PARK" : "공원",
  }

  return (
    <div className="container mx-auto px-0 py-0 max-w-6xl overflow-x-hidden bg-brand-sand">
      {loading ? (
        // Loading screen
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-20 h-20 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-brand-navy text-lg">{translations.loading}</p>
        </div>
      ) : selectedStamp ? (
        // Stamp Detail View
        <div className="stamp-detail-view">
          {/* Header */}
          <div className="sticky top-0 bg-brand-blue z-10 px-4 py-3 flex items-center justify-between border-b border-brand-coral">
            <button
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              onClick={handleBackToPokedex}
            >
              <FaArrowLeft className="text-brand-blue" />
            </button>
            <h2 className="text-lg font-bold flex-1 text-center text-white">{translations.stampDetails}</h2>
            <button
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              onClick={handleBackToProfile}
            >
              <X className="text-brand-blue" />
            </button>
          </div>

          {/* Card */}
          <div className="px-4 py-6 bg-brand-sand">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`bg-[#FFFBF5] rounded-xl overflow-hidden shadow-md ${getRarityInfo(selectedStamp.rarity).border} border-2`}
            >
              {/* Stamp Header */}
              <div className="relative h-12 bg-gradient-to-r from-brand-blue to-brand-blue/80 flex items-center justify-between px-4">
                <h3 className="text-white font-bold font-serif">{selectedStamp.name}</h3>
              </div>

              {/* Stamp Image */}
              <div
                className="relative w-full aspect-square"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,251,245,0.9) 0%, rgba(245,245,247,0.6) 100%)`,
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-3/4 h-3/4">
                    <Image
                      src={selectedStamp.image || "/placeholder.svg"}
                      alt={selectedStamp.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Stats */}
              <div className="p-4 bg-gradient-to-b from-[#FFFBF5] to-brand-sand/30">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/50 rounded p-2">
                    <div className="text-xs text-brand-gray">{translations.dateAcquired}</div>
                    <div className="font-medium text-brand-navy">{selectedStamp.date}</div>
                  </div>
                  <div className="bg-white/50 rounded p-2">
                    <div className="text-xs text-brand-gray">{translations.location}</div>
                    <div className="font-medium text-brand-navy">{selectedStamp.location}</div>
                  </div>
                </div>

                <div className="bg-white/50 rounded p-2 mb-4">
                  <div className="text-xs text-brand-gray">{translations.collection}</div>
                  <div className="font-medium text-brand-navy flex justify-between">
                    <span>{selectedStamp.collection}</span>
                    <span className="text-brand-blue">{selectedStamp.collectionProgress}</span>
                  </div>
                </div>

                {/* Flavor Text */}
                <div className="bg-white/50 rounded p-3 mb-2 italic text-sm text-brand-navy/80">
                  "{selectedStamp.flavorText}"
                </div>
              </div>
            </motion.div>
          </div>

          {/* Local Tips Section */}
          <div className="px-4 py-4 bg-brand-sand">
            <div className="bg-white rounded-xl p-4 mb-4">
              <h3 className="text-lg font-bold mb-3 text-brand-blue font-serif">✨ {translations.localTips}</h3>

              <div className="space-y-4">
                {selectedStamp.tips.slice(0, 2).map((tip, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    key={index}
                    className="rounded-lg border border-gray-200 p-3"
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                        <Image
                          src={tip.avatar || "/placeholder.svg"}
                          alt={tip.username}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-sm">{tip.username}</span>
                    </div>
                    <p className="text-sm mb-2">{tip.text}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <FaHeart className="text-brand-coral mr-1" />
                      <span>{tip.likes}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-3 py-2 text-sm text-brand-blue font-semibold text-center">
                {translations.seeMoreTips}
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-4 mb-8">
              <button className="flex-1 bg-brand-yellow py-3 rounded-full text-brand-navy font-bold">
                <div className="flex items-center justify-center">
                  <FaStar className="mr-2" />
                  <span>{translations.favorite}</span>
                </div>
              </button>
              <button className="flex-1 bg-brand-coral py-3 rounded-full text-white font-bold">
                <div className="flex items-center justify-center">
                  <FaShare className="mr-2" />
                  <span>{translations.share}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Stamp Pokedex View
        <div className="stamp-pokedex-view">
          {/* Header */}
          <div className="sticky top-0 bg-brand-blue z-10 px-4 py-3 flex items-center justify-between">
            <button
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              onClick={handleBackToProfile}
            >
              <ArrowLeft className="text-brand-blue" />
            </button>
            <h2 className="text-xl font-bold text-white flex items-center font-serif">
              <div className="w-6 h-6 bg-white rounded-full mr-2"></div>
              {translations.stampCollection}
            </h2>
            <div className="w-10 h-10"></div> {/* Empty div for layout balance */}
          </div>

          {/* Filter bar */}
          <div className="px-4 py-3 bg-brand-blue shadow-md">
            <div className="bg-white rounded-full overflow-x-auto scrollbar-hide">
              <div className="flex whitespace-nowrap p-1">
                <button
                  className={`px-4 py-2 rounded-full text-sm ${activeFilter === "all" ? "bg-brand-coral text-white font-bold" : "text-gray-700"}`}
                  onClick={() => handleFilterChange("all")}
                >
                  {translations.all}
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm ${activeFilter === "city" ? "bg-brand-coral text-white font-bold" : "text-gray-700"}`}
                  onClick={() => handleFilterChange("city")}
                >
                  {translations.byCity}
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm ${activeFilter === "recent" ? "bg-brand-coral text-white font-bold" : "text-gray-700"}`}
                  onClick={() => handleFilterChange("recent")}
                >
                  {translations.recent}
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm ${activeFilter === "landmark" ? "bg-brand-coral text-white font-bold" : "text-gray-700"}`}
                  onClick={() => handleFilterChange("landmark")}
                >
                  {translations.landmarks}
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm ${activeFilter === "food" ? "bg-brand-coral text-white font-bold" : "text-gray-700"}`}
                  onClick={() => handleFilterChange("food")}
                >
                  {translations.food}
                </button>
              </div>
            </div>
          </div>

          {/* Stamps Grid */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 bg-brand-sand">
            <div className="grid grid-cols-2 gap-4">
              {filteredStamps.map((stamp) => {
                const rarityInfo = getRarityInfo(stamp.rarity)
                return (
                  <motion.div
                    key={stamp.id}
                    variants={itemVariants}
                    whileHover="hover"
                    variants={cardHoverVariants}
                    onClick={() => handleStampSelect(stamp)}
                    className={`bg-[#FFFBF5] rounded-xl overflow-hidden shadow-md ${rarityInfo.border} border-2`}
                  >
                    {/* Type Bar */}
                    <div className="bg-gradient-to-r from-brand-blue to-brand-blue/80 px-3 py-1 flex items-center">
                      <div className="flex items-center text-white text-xs">
                        {getTypeIcon(stamp.type)}
                        <span className="font-bold">{translations[stamp.type] || stamp.type.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="relative pt-[100%] bg-gradient-to-b from-[#FFFBF5] to-brand-sand/30">
                      <Image
                        src={stamp.image || "/placeholder.svg"}
                        alt={stamp.name}
                        fill
                        className="object-cover p-2"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-2">
                      <h3 className="font-bold text-sm truncate text-brand-navy font-serif">{stamp.name}</h3>
                      <p className="text-xs text-brand-gray truncate">{stamp.location}</p>
                      <p className="text-xs text-brand-blue mt-1 truncate">
                        {translations.collection}: <span className="font-medium">{stamp.collection}</span>
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
