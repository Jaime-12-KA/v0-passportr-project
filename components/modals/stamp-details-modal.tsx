"use client"
import { X, Clock, MapPin } from "lucide-react"
import { FaHeart } from "react-icons/fa"
import Image from "next/image"

interface StampDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  currentLanguage: string
  stampId: string
}

const StampDetailsModal = ({ isOpen, onClose, currentLanguage, stampId }: StampDetailsModalProps) => {
  // Sample stamp data - in a real app, this would be fetched based on stampId
  const stampData: Record<string, StampType> = {
    gyeongbokgung: {
      id: "gyeongbokgung",
      name: currentLanguage === "en" ? "Gyeongbokgung Palace" : "경복궁",
      image: "/images/gyeongbokgung.png",
      date: "April 20, 2025",
      location: "Jongno-gu, Seoul",
      city: "seoul",
      category: "landmark",
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
    bukchon: {
      id: "bukchon",
      name: currentLanguage === "en" ? "Bukchon Hanok Village" : "북촌 한옥마을",
      image: "/images/bukchon.png",
      date: "April 21, 2025",
      location: "Jongno-gu, Seoul",
      city: "seoul",
      category: "cultural",
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
    hongdae: {
      id: "hongdae",
      name: currentLanguage === "en" ? "Hongdae Street" : "홍대 거리",
      image: "/images/hongdae.png",
      date: "April 22, 2025",
      location: "Mapo-gu, Seoul",
      city: "seoul",
      category: "entertainment",
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
    gwangjang: {
      id: "gwangjang",
      name: currentLanguage === "en" ? "Gwangjang Market" : "광장시장",
      image: "/images/gwangjang.png",
      date: "April 23, 2025",
      location: "Jongno-gu, Seoul",
      city: "seoul",
      category: "food",
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
    starbucks: {
      id: "starbucks",
      name: currentLanguage === "en" ? "Starbucks Myeongdong" : "스타벅스 명동점",
      image: "/images/starbucks.png",
      date: "April 24, 2025",
      location: "Jung-gu, Seoul",
      city: "seoul",
      category: "cafe",
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
    haeundae: {
      id: "haeundae",
      name: currentLanguage === "en" ? "Haeundae Beach" : "해운대 해변",
      image: "/images/haeundae.png",
      date: "May 15, 2025",
      location: "Haeundae-gu, Busan",
      city: "busan",
      category: "nature",
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
  }

  const stamp = stampData[stampId] || stampData["gyeongbokgung"] // Default to Gyeongbokgung if stamp not found

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto" style={{ height: "var(--app-height, 100vh)" }}>
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center justify-between border-b border-light-sand">
        <h2 className="text-lg font-bold flex-1 text-center">
          {currentLanguage === "en" ? "Stamp Details" : "스탬프 상세"}
        </h2>
        <button className="w-10 h-10 rounded-full bg-light-sand flex items-center justify-center" onClick={onClose}>
          <X className="text-deep-navy" />
        </button>
      </div>

      {/* Stamp Artwork */}
      <div className="relative w-full h-64 overflow-hidden">
        <Image src={stamp.image || "/placeholder.svg"} alt={stamp.name} fill className="object-cover" />
      </div>

      {/* Stamp Info */}
      <div className="p-4 pb-16">
        <h1 className="text-2xl font-bold mb-4">{stamp.name}</h1>

        <div className="bg-light-sand rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-brand-coral mr-2" />
            <span className="text-sm">
              {currentLanguage === "en" ? "Date Acquired" : "획득 날짜"}: {stamp.date}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-brand-coral mr-2" />
            <span className="text-sm">
              {currentLanguage === "en" ? "Location" : "위치"}: {stamp.location}
            </span>
          </div>
        </div>

        {/* Local Tips Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3">✨ {currentLanguage === "en" ? "Local Tips" : "현지인 팁"}</h3>

          <div className="space-y-4">
            {stamp.tips.map((tip, index) => (
              <div key={index} className="bg-white rounded-lg border border-light-sand p-4 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={tip.avatar || "/placeholder.svg"}
                      alt={tip.username}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium">{tip.username}</span>
                </div>
                <p className="text-sm mb-3">{tip.text}</p>
                <div className="flex items-center text-sm text-stone-gray">
                  <FaHeart className="text-brand-coral mr-1" />
                  <span>{tip.likes}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-brand-blue text-center">
            {currentLanguage === "en" ? "See More Tips" : "더 많은 팁 보기"}
          </button>
        </div>

        {/* My Notes Section */}
        <div className="bg-light-sand bg-opacity-50 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">{currentLanguage === "en" ? "My Notes" : "내 노트"}</h3>
          <button className="w-full py-2 border border-dashed border-stone-gray rounded-lg text-sm text-stone-gray text-center">
            {currentLanguage === "en" ? "Add a personal note..." : "개인 노트 추가..."}
          </button>
        </div>
      </div>
    </div>
  )
}

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
  tips: TipType[]
}

export default StampDetailsModal
