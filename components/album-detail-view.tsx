"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, ImageIcon } from "lucide-react"
import { FaArrowLeft } from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import Image from "next/image"
import AddAlbumItemModal from "./modals/add-album-item-modal"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import StampDetailView from "./stamp-detail-view"

interface AlbumDetailViewProps {
  albumId: string
  albumName: string
  coverImage: string
  itemCount: number
  onBack: () => void
  currentLanguage: string
}

// Define the stamp data structure with multilingual support
interface StampItem {
  id: string
  title: {
    en: string
    ko: string
  }
  region?: {
    en: string
    ko: string
  }
  city?: {
    en: string
    ko: string
  }
  notes: {
    en: string
    ko: string
  }
  tags: {
    en: string[]
    ko: string[]
  }
  image: string
}

// AlbumDetailView 컴포넌트에서 앨범 이름을 언어에 따라 다르게 표시하도록 수정합니다.

// 앨범 이름을 언어에 따라 가져오는 함수 추가
const getLocalizedAlbumName = (id: string, name: string, lang: string): string => {
  // 기존 이름이 이미 현지화되어 있다면 그대로 사용
  if (
    (lang === "en" && name.includes("Europe") && !name.includes("유럽")) ||
    (lang === "ko" && name.includes("유럽"))
  ) {
    return name
  }

  // 앨범 ID에 따라 현지화된 이름 반환
  switch (id) {
    case "album1":
      return lang === "en" ? "Seoul Cafe Hopping '25" : "서울 카페 유랑"
    case "album2":
      return lang === "en" ? "My Favorite Independent Bookstores" : "내가 사랑한 독립서점들"
    case "album3":
      return lang === "en" ? "2025 Europe Trip" : "2025년 유럽 여행"
    default:
      return name // 기본값은 전달받은 이름 사용
  }
}

const AlbumDetailView = ({
  albumId,
  albumName,
  coverImage,
  itemCount,
  onBack,
  currentLanguage,
}: AlbumDetailViewProps) => {
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const router = useRouter()
  const [selectedStamp, setSelectedStamp] = useState<StampItem | null>(null)

  // Korean translations
  const translations = {
    myCollection: currentLanguage === "en" ? "My Collection" : "내 컬렉션",
    stamps: currentLanguage === "en" ? "stamps" : "스탬프",
    addNewStamp: currentLanguage === "en" ? "Add New Stamp" : "새 스탬프 추가",
    backToAlbum: currentLanguage === "en" ? "Back to Album" : "앨범으로 돌아가기",
    editCanvas: currentLanguage === "en" ? "Edit Canvas" : "캔버스 편집",
    addStamp: currentLanguage === "en" ? "Add Stamp" : "스탬프 추가",
  }

  // Sample collections data based on albumId with multilingual support
  const getCollectionData = (): StampItem[] => {
    switch (albumId) {
      case "album1": // Seoul Café Hopping
        return [
          {
            id: "fritz-coffee",
            title: {
              en: "Fritz Coffee Company",
              ko: "프릳츠 커피 컴퍼니",
            },
            region: {
              en: "Mapo",
              ko: "마포",
            },
            notes: {
              en: "Cozy atmosphere with excellent hand-drip coffee. Their 'Everything Good' motto really shows in their quality.",
              ko: "아늑한 분위기와 훌륭한 핸드드립 커피. '잘 되어 가시나'라는 모토가 품질에서 느껴져요.",
            },
            tags: {
              en: ["#specialty", "#roastery", "#cozy"],
              ko: ["#스페셜티", "#로스터리", "#아늑함"],
            },
            image: "/images/fritzcoffee.png",
          },
          {
            id: "onion-anguk",
            title: {
              en: "Onion Anguk",
              ko: "어니언 안국",
            },
            region: {
              en: "Jongno",
              ko: "종로",
            },
            notes: {
              en: "The harmony of hanok architecture and scones. Added 3 photos.",
              ko: "한옥 건축과 스콘의 조화. 사진 3장 추가했어요.",
            },
            tags: {
              en: ["#hanok", "#brunch", "#relax"],
              ko: ["#한옥", "#브런치", "#휴식"],
            },
            image: "/images/cafeonion.png",
          },
          {
            id: "cheongsudang",
            title: {
              en: "Cheongsudang",
              ko: "청수당",
            },
            region: {
              en: "Seongsu",
              ko: "성수",
            },
            notes: {
              en: "Beautiful traditional Korean dessert cafe with bamboo garden. Magical at night with lanterns.",
              ko: "대나무 정원이 있는 아름다운 전통 디저트 카페. 밤에 등불과 함께 마법 같은 분위기.",
            },
            tags: {
              en: ["#traditional", "#dessert", "#night"],
              ko: ["#전통", "#디저트", "#야경"],
            },
            image: "/images/cheongsudang.png",
          },
          {
            id: "cafe-gongmyung",
            title: {
              en: "Cafe Gongmyung",
              ko: "카페 공명",
            },
            region: {
              en: "Yongsan",
              ko: "용산",
            },
            notes: {
              en: "Stunning brick archway entrance. The circular passages create a unique spatial experience.",
              ko: "멋진 벽돌 아치형 입구. 원형 통로가 독특한 공간 경험을 만들어요.",
            },
            tags: {
              en: ["#architecture", "#instagrammable", "#modern"],
              ko: ["#건축", "#인스타감성", "#모던"],
            },
            image: "/images/cafegongmyung.png",
          },
          {
            id: "anthracite",
            title: {
              en: "Anthracite Coffee",
              ko: "앤트러사이트 커피",
            },
            region: {
              en: "Eulji-ro",
              ko: "을지로",
            },
            notes: {
              en: "Industrial vibes in a renovated factory. Their single-origin espresso was exceptional.",
              ko: "리모델링된 공장의 인더스트리얼 분위기. 싱글 오리진 에스프레소가 특별했어요.",
            },
            tags: {
              en: ["#industrial", "#specialty", "#singleorigin"],
              ko: ["#인더스트리얼", "#스페셜티", "#싱글오리진"],
            },
            image: "/images/anthracite.png",
          },
        ]
      case "album2": // My Favorite Independent Bookstores
        return [
          {
            id: "goyo-books",
            title: {
              en: "Goyo Books",
              ko: "고요서사",
            },
            region: {
              en: "Mangwon",
              ko: "망원",
            },
            notes: {
              en: "A peaceful place in an alley. Loved the feminist literature section.",
              ko: "골목에 있는 평화로운 곳. 페미니즘 문학 섹션이 좋았어요.",
            },
            tags: {
              en: ["#quiet", "#feminism", "#localbookstore"],
              ko: ["#조용함", "#페미니즘", "#동네서점"],
            },
            image: "/images/goyoseosa.jpg",
          },
          {
            id: "storage-book-film",
            title: {
              en: "Storage Book & Film",
              ko: "스토리지 북앤필름",
            },
            region: {
              en: "Haebangchon",
              ko: "해방촌",
            },
            notes: {
              en: "Books and film cameras in one. Attended a local author talk.",
              ko: "책과 필름 카메라가 한 곳에. 지역 작가 강연에 참석했어요.",
            },
            tags: {
              en: ["#film", "#event", "#culture"],
              ko: ["#필름", "#이벤트", "#문화"],
            },
            image: "/images/storagebook.png",
          },
          {
            id: "gaga77page",
            title: {
              en: "GAGA77PAGE",
              ko: "가가77페이지",
            },
            region: {
              en: "Seongsu",
              ko: "성수",
            },
            notes: {
              en: "Minimalist design bookstore with carefully curated art books. Found a rare photography collection.",
              ko: "미니멀한 디자인의 서점으로 엄선된 아트북이 있어요. 희귀한 사진집을 발견했어요.",
            },
            tags: {
              en: ["#artbooks", "#design", "#photography"],
              ko: ["#아트북", "#디자인", "#사진"],
            },
            image: "/images/gaga77.png",
          },
          {
            id: "wit-and-cynical",
            title: {
              en: "Wit and Cynical",
              ko: "위트앤시니컬",
            },
            region: {
              en: "Yeonnam",
              ko: "연남",
            },
            notes: {
              en: "Modern bookstore with focus on contemporary literature. Great coffee and reading space.",
              ko: "현대 문학에 중점을 둔 모던한 서점. 커피와 독서 공간이 훌륭해요.",
            },
            tags: {
              en: ["#contemporary", "#coffee", "#reading"],
              ko: ["#현대문학", "#커피", "#독서"],
            },
            image: "/images/witandcynical.png",
          },
          {
            id: "thanks-books",
            title: {
              en: "Thanks Books",
              ko: "땡스북스",
            },
            region: {
              en: "Hongdae",
              ko: "홍대",
            },
            notes: {
              en: "Artistic bookstore with regular drawing sessions. Loved the cat-themed book displays.",
              ko: "정기적인 드로잉 세션이 있는 예술적인 서점. 고양이 테마 책 전시가 좋았어요.",
            },
            tags: {
              en: ["#art", "#drawing", "#cats"],
              ko: ["#예술", "#드로잉", "#고양이"],
            },
            image: "/images/thanksbooks.png",
          },
        ]
      case "album3": // Europe 2025 Trip
        return [
          {
            id: "shakespeare-paris",
            title: {
              en: "Shakespeare & Company",
              ko: "셰익스피어 앤 컴퍼니",
            },
            city: {
              en: "Paris",
              ko: "파리",
            },
            notes: {
              en: "Iconic bookstore by the Seine. Bought a vintage poetry collection and got it stamped with their logo.",
              ko: "센 강변의 상징적인 서점. 빈티지 시집을 사서 그들의 로고 스탬프를 받았어요.",
            },
            tags: {
              en: ["#paris", "#bookstore", "#literary"],
              ko: ["#파리", "#서점", "#문학"],
            },
            image: "/images/shakespeare.png",
          },
          {
            id: "guell-park",
            title: {
              en: "Park Güell",
              ko: "구엘 공원",
            },
            city: {
              en: "Barcelona",
              ko: "바르셀로나",
            },
            notes: {
              en: "Gaudí's masterpiece with stunning mosaic work. The view of Barcelona from the top was breathtaking.",
              ko: "가우디의 걸작, 아름다운 모자이크 작품. 꼭대기에서 바라본 바르셀로나 전경이 숨막혔어요.",
            },
            tags: {
              en: ["#gaudi", "#architecture", "#mosaic"],
              ko: ["#가우디", "#건축", "#모자이크"],
            },
            image: "/images/guellpark.jpg",
          },
          {
            id: "trastevere-rome",
            title: {
              en: "Trastevere",
              ko: "트라스테베레",
            },
            city: {
              en: "Rome",
              ko: "로마",
            },
            notes: {
              en: "Charming neighborhood with ivy-covered cafes. Had the best pasta of my life at a tiny family restaurant.",
              ko: "담쟁이덩굴로 덮인 카페가 있는 매력적인 동네. 작은 가족 레스토랑에서 내 인생 최고의 파스타를 먹었어요.",
            },
            tags: {
              en: ["#rome", "#localfood", "#charming"],
              ko: ["#로마", "#현지음식", "#매력적"],
            },
            image: "/images/Trastevere.png",
          },
          {
            id: "charles-bridge",
            title: {
              en: "Charles Bridge",
              ko: "카를교",
            },
            city: {
              en: "Prague",
              ko: "프라하",
            },
            notes: {
              en: "Medieval bridge with stunning statues. Watched the sunrise here with almost no tourists around.",
              ko: "멋진 조각상이 있는 중세 다리. 관광객이 거의 없는 이른 아침에 일출을 감상했어요.",
            },
            tags: {
              en: ["#prague", "#historic", "#sunrise"],
              ko: ["#프라하", "#역사적", "#일출"],
            },
            image: "/images/charlesbridge.png",
          },
          {
            id: "berlin-donut",
            title: {
              en: "Sammy's Berliner Donuts",
              ko: "사미의 베를린 도넛",
            },
            city: {
              en: "Berlin",
              ko: "베를린",
            },
            notes: {
              en: "Trendy donut shop with creative flavors. The raspberry cheesecake donut was unforgettable.",
              ko: "창의적인 맛이 있는 트렌디한 도넛 가게. 라즈베리 치즈케이크 도넛이 잊을 수 없었어요.",
            },
            tags: {
              en: ["#berlin", "#dessert", "#foodie"],
              ko: ["#베를린", "#디저트", "#맛집"],
            },
            image: "/images/berlindonut.jpg",
          },
        ]
      default:
        return []
    }
  }

  const stamps = getCollectionData()

  const handleOpenAddItemModal = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setShowAddItemModal(true)
  }

  const handleGoToCanvas = () => {
    router.push("/album-canvas")
  }

  const handleStampClick = (stamp: StampItem) => {
    triggerHapticFeedback(hapticPatterns.medium)
    setSelectedStamp(stamp)
  }

  const handleBackFromStamp = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setSelectedStamp(null)
  }

  // 현지화된 앨범 이름 사용
  const localizedAlbumName = getLocalizedAlbumName(albumId, albumName, currentLanguage)

  // If a stamp is selected, show its detail view
  if (selectedStamp) {
    return (
      <StampDetailView
        id={selectedStamp.id}
        title={selectedStamp.title[currentLanguage === "en" ? "en" : "ko"]}
        region={selectedStamp.region ? selectedStamp.region[currentLanguage === "en" ? "en" : "ko"] : ""}
        city={selectedStamp.city ? selectedStamp.city[currentLanguage === "en" ? "en" : "ko"] : ""}
        notes={selectedStamp.notes[currentLanguage === "en" ? "en" : "ko"]}
        tags={selectedStamp.tags[currentLanguage === "en" ? "en" : "ko"]}
        image={selectedStamp.image}
        collectionName={localizedAlbumName}
        onBack={handleBackFromStamp}
        currentLanguage={currentLanguage}
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center justify-between border-b border-light-sand">
        <button
          className="w-8 h-8 rounded-full bg-light-sand flex items-center justify-center"
          onClick={onBack}
          aria-label={translations.backToAlbum}
        >
          <FaArrowLeft className="text-deep-navy" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">{localizedAlbumName}</h2>
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoToCanvas}
            className="mr-2"
            aria-label={translations.editCanvas}
          >
            <ImageIcon className="text-deep-navy" />
          </Button>
          <button
            className="w-8 h-8 rounded-full bg-light-sand flex items-center justify-center"
            onClick={handleOpenAddItemModal}
            aria-label={translations.addStamp}
          >
            <Plus className="text-deep-navy" />
          </button>
        </div>
      </div>

      {/* Album Cover */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image src={coverImage || "/placeholder.svg"} alt={albumName} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h1 className="text-2xl font-bold text-white">{localizedAlbumName}</h1>
          <p className="text-white">
            {stamps.length} {translations.stamps}
          </p>
        </div>
      </div>

      {/* Scrapbook Style Layout */}
      <div className="p-4">
        <div className="bg-light-sand/30 rounded-xl p-4 mb-4">
          <h3 className="text-lg font-bold mb-3">{translations.myCollection}</h3>

          {/* Stamps Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stamps.map((stamp) => (
              <motion.div
                key={stamp.id}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-light-sand transform rotate-[-1deg] hover:rotate-0 transition-transform"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStampClick(stamp)}
              >
                <div className="relative aspect-square">
                  <Image
                    src={stamp.image || "/placeholder.svg?height=300&width=300&query=travel+destination"}
                    alt={stamp.title[currentLanguage === "en" ? "en" : "ko"]}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-deep-navy">{stamp.title[currentLanguage === "en" ? "en" : "ko"]}</h4>
                  <p className="text-sm text-stone-gray">
                    {stamp.region
                      ? stamp.region[currentLanguage === "en" ? "en" : "ko"]
                      : stamp.city
                        ? stamp.city[currentLanguage === "en" ? "en" : "ko"]
                        : ""}
                  </p>

                  {/* Preview of tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {stamp.tags[currentLanguage === "en" ? "en" : "ko"].slice(0, 2).map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-0.5 bg-brand-blue/10 text-brand-blue rounded-full">
                        {tag}
                      </span>
                    ))}
                    {stamp.tags[currentLanguage === "en" ? "en" : "ko"].length > 2 && (
                      <span className="text-xs px-2 py-0.5 bg-light-sand text-stone-gray rounded-full">
                        +{stamp.tags[currentLanguage === "en" ? "en" : "ko"].length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add Item Button */}
            <motion.div
              className="aspect-square bg-light-sand rounded-lg border border-dashed border-stone-gray flex flex-col items-center justify-center cursor-pointer transform rotate-[1deg] hover:rotate-0 transition-transform"
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenAddItemModal}
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2">
                <ImageIcon className="text-brand-blue" />
              </div>
              <p className="text-center text-sm font-medium">{translations.addNewStamp}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <AddAlbumItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        currentLanguage={currentLanguage}
        albumName={albumName}
      />
    </div>
  )
}

export default AlbumDetailView
