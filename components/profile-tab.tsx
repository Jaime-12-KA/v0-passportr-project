"use client"

import { type FC, useState, useEffect } from "react"
import {
  MapPin,
  Coffee,
  Utensils,
  Camera,
  Landmark,
  ShoppingBag,
  Mountain,
  Building,
  Train,
  Bus,
  UserPlus,
  UserMinus,
  Users,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { logout } from "@/utils/auth-utils"

interface ProfileTabProps {
  userName?: string
  level?: number
  xp?: number
  nextLevelXp?: number
  totalVisits?: number
  streak?: number
  joinDate?: string
  stamps?: {
    id: string
    name: string
    image: string
    date: string
    type: string
    category?: string
  }[]
  currentLanguage: string
  onSwitchLanguage: (lang: string) => void
  distanceUnit: string
  setDistanceUnit: (unit: string) => void
}

interface Theme {
  id: string
  name: string
  color: string
  secondaryColor: string
  accentColor: string
  backgroundPattern?: string
}

// Add interface for user
interface User {
  id: number
  name: string
  image: string
  level: number
  isFollowing: boolean
}

const stampCardAnimations = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes shine {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }
  
  .stamp-card:hover .stamp-shine {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 200% 100%;
    animation: shine 1.5s infinite;
    pointer-events: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

const ProfileTab: FC<ProfileTabProps> = ({
  userName = "Jaime Sung",
  level = 12,
  xp = 2400,
  nextLevelXp = 3000,
  totalVisits = 42,
  streak = 7,
  joinDate = "May 10, 2023",
  stamps = [
    {
      id: "1",
      name: "Gyeongbokgung Palace",
      image: "/images/gyeongbokgung.png",
      date: "May 15, 2023",
      type: "landmark",
      category: "culture",
    },
    {
      id: "2",
      name: "Bukchon Hanok Village",
      image: "/images/bukchon.png",
      date: "May 16, 2023",
      type: "cultural",
      category: "culture",
    },
    {
      id: "3",
      name: "Hongdae Street",
      image: "/images/hongdae.png",
      date: "May 18, 2023",
      type: "entertainment",
      category: "shopping",
    },
    {
      id: "4",
      name: "Gwangjang Market",
      image: "/images/gwangjang.png",
      date: "May 19, 2023",
      type: "food",
      category: "food",
    },
    {
      id: "5",
      name: "Starbucks Insadong",
      image: "/images/starbucks.png",
      date: "May 20, 2023",
      type: "cafe",
      category: "food",
    },
  ],
  currentLanguage,
  onSwitchLanguage,
  distanceUnit,
  setDistanceUnit,
}) => {
  const [showPassport, setShowPassport] = useState(false)
  const [selectedCity, setSelectedCity] = useState("SEOUL")
  const [isVisible, setIsVisible] = useState(false)
  const [showProfileEditor, setShowProfileEditor] = useState(false)
  const [showBadgeDetails, setShowBadgeDetails] = useState<number | null>(null)
  const [showStampPokedexModal, setShowStampPokedexModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"following" | "followers" | "suggested">("following")

  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = () => {
    logout()
    router.push("/onboarding")
  }

  useEffect(() => {
    setIsVisible(true)

    // Add stamp card animations to document
    const styleElement = document.createElement("style")
    styleElement.textContent = stampCardAnimations
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  // Premium badges for display
  const badges = [
    {
      id: 3,
      name: currentLanguage === "en" ? "Cultural Enthusiast" : "문화 애호가",
      image: "/images/badge-culture.png",
      description:
        currentLanguage === "en" ? "Visited 15 cultural or historical sites" : "15개의 문화 또는 역사 유적지 방문",
      progress: "7/15",
      date: currentLanguage === "en" ? "In Progress" : "진행 중",
    },
    {
      id: 5,
      name: currentLanguage === "en" ? "Night Explorer" : "야행성 탐험가",
      image: "/images/badge-night.png",
      description: currentLanguage === "en" ? "Checked in at 5 locations after sunset" : "일몰 후 5개 장소에서 체크인",
      progress: "5/5",
      date: currentLanguage === "en" ? "Earned 2 weeks ago" : "2주일 전 획득",
    },
    {
      id: 1,
      name: currentLanguage === "en" ? "Seoul Explorer" : "서울 탐험가",
      image: "/images/badge-seoul-explorer.png",
      description: currentLanguage === "en" ? "Visited 25 different locations in Seoul" : "서울의 25개 다른 장소 방문",
      progress: "18/25",
      date: currentLanguage === "en" ? "In Progress" : "진행 중",
    },
    {
      id: 6,
      name: currentLanguage === "en" ? "Cafe Hopper" : "카페 도장깨기",
      image: "/images/badge-cafe-hopper.png",
      description:
        currentLanguage === "en"
          ? "Completed all weekly challenges for 4 consecutive weeks"
          : "4주 연속으로 모든 주간 도전 완료",
      progress: "4/4",
      date: currentLanguage === "en" ? "Earned 5 days ago" : "5일 전 획득",
    },
  ]

  // Friends data (now with isFollowing property)
  const [friends, setFriends] = useState<User[]>([
    {
      id: 1,
      name: "Min-ji Kim",
      image: "/images/Friends_Minji Kim.jpg",
      level: 15,
      isFollowing: true,
    },
    {
      id: 2,
      name: "Tom Park",
      image: "/images/Friends_Tom Park.jpg",
      level: 9,
      isFollowing: true,
    },
    {
      id: 3,
      name: "Sarah Lee",
      image: "/images/astronaut_sarah.png",
      level: 11,
      isFollowing: true,
    },
    {
      id: 4,
      name: "James Choi",
      image: "/images/alien_james.png",
      level: 14,
      isFollowing: true,
    },
  ])

  // Followers data
  const [followers, setFollowers] = useState<User[]>([
    {
      id: 5,
      name: "David Kim",
      image: "/images/jaime_avatar.png",
      level: 8,
      isFollowing: false,
    },
    {
      id: 6,
      name: "Jenny Park",
      image: "/images/Friends_Sarah Lee.jpg",
      level: 10,
      isFollowing: true,
    },
    {
      id: 2,
      name: "Tom Park",
      image: "/images/Friends_Tom Park.jpg",
      level: 9,
      isFollowing: true,
    },
    {
      id: 7,
      name: "Mike Johnson",
      image: "/images/Friends_James Choi.jpg",
      level: 7,
      isFollowing: false,
    },
    {
      id: 8,
      name: "Lisa Wong",
      image: "/images/Friends_Minji Kim.jpg",
      level: 12,
      isFollowing: false,
    },
    {
      id: 9,
      name: "Chris Lee",
      image: "/images/alien_james.png",
      level: 6,
      isFollowing: true,
    },
  ])

  // Suggested users to follow
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([
    {
      id: 10,
      name: "Emma Wilson",
      image: "/images/Friends_Sarah Lee.jpg",
      level: 13,
      isFollowing: false,
    },
    {
      id: 11,
      name: "Alex Chen",
      image: "/images/jaime_avatar.png",
      level: 9,
      isFollowing: false,
    },
    {
      id: 12,
      name: "Sophia Garcia",
      image: "/images/Friends_Minji Kim.jpg",
      level: 11,
      isFollowing: false,
    },
    {
      id: 13,
      name: "Daniel Kim",
      image: "/images/Friends_James Choi.jpg",
      level: 10,
      isFollowing: false,
    },
  ])

  // Following/Followers counts
  const followingCount = friends.length
  const followersCount = followers.length

  // Calculate XP progress percentage
  const xpProgress = (xp / nextLevelXp) * 100

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Handle follow/unfollow
  const handleFollowToggle = (userId: number, userType: "following" | "followers" | "suggested") => {
    if (userType === "following") {
      setFriends(
        friends.map((friend) => (friend.id === userId ? { ...friend, isFollowing: !friend.isFollowing } : friend)),
      )
    } else if (userType === "followers") {
      setFollowers(
        followers.map((follower) =>
          follower.id === userId ? { ...follower, isFollowing: !follower.isFollowing } : follower,
        ),
      )

      // If we're now following this user, add them to friends if they're not already there
      const follower = followers.find((f) => f.id === userId)
      if (follower && !follower.isFollowing) {
        if (!friends.some((f) => f.id === userId)) {
          setFriends([...friends, { ...follower, isFollowing: true }])
        }
      }
    } else if (userType === "suggested") {
      setSuggestedUsers(
        suggestedUsers.map((user) => (user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user)),
      )

      // If we're now following this user, add them to friends
      const suggestedUser = suggestedUsers.find((u) => u.id === userId)
      if (suggestedUser && !suggestedUser.isFollowing) {
        setFriends([...friends, { ...suggestedUser, isFollowing: true }])
      }
    }
  }

  const renderStamp = (stamp: {
    id: string
    name: string
    image: string
    date: string
    type: string
    category?: string | undefined
  }) => {
    // Determine icon based on stamp name or type
    const getStampIcon = () => {
      const name = stamp.name.toLowerCase()
      if (name.includes("coffee") || name.includes("cafe")) return <Coffee className="w-6 h-6" />
      if (name.includes("restaurant") || name.includes("food")) return <Utensils className="w-6 h-6" />
      if (name.includes("photo") || name.includes("view")) return <Camera className="w-6 h-6" />
      if (name.includes("mountain") || name.includes("hill")) return <Mountain className="w-6 h-6" />
      if (name.includes("building") || name.includes("tower")) return <Building className="w-6 h-6" />
      if (name.includes("palace") || name.includes("temple")) return <Landmark className="w-6 h-6" />
      if (name.includes("train") || name.includes("station")) return <Train className="w-6 h-6" />
      if (name.includes("bus") || name.includes("transport")) return <Bus className="w-6 h-6" />
      if (name.includes("market") || name.includes("shop")) return <ShoppingBag className="w-6 h-6" />
      return <MapPin className="w-6 h-6" /> // Default icon
    }

    // Determine background shape/color based on stamp category
    const getStampClass = () => {
      const category = stamp.category?.toLowerCase() || ""
      if (category.includes("food")) return "bg-orange-100 rounded-lg"
      if (category.includes("culture")) return "bg-purple-100 rounded-full"
      if (category.includes("nature")) return "bg-green-100 rounded-md"
      if (category.includes("shopping")) return "bg-blue-100 rounded-lg"
      if (category.includes("transport")) return "bg-yellow-100 rounded-md"
      return "bg-gray-100 rounded-md" // Default style
    }

    return (
      <div key={stamp.id} className="flex flex-col items-center mb-4">
        <div className={`p-3 ${getStampClass()} flex items-center justify-center mb-2`}>{getStampIcon()}</div>
        <span className="text-xs text-center">{stamp.name}</span>
      </div>
    )
  }

  // Find the handleOpenStampPokedex function and replace it with this:
  const handleOpenStampPokedex = () => {
    // Navigate to the stamp-pokedex page instead of opening a modal
    router.push("/stamp-pokedex")
  }

  return (
    <div className="tab-container">
      <div
        id="profile"
        className={`tab-content ${isVisible ? "active" : ""} profile-tab-container pb-16`}
        style={{ minHeight: "calc(var(--app-height, 100vh) - 120px)" }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold serif-font">{currentLanguage === "en" ? "Profile" : "프로필"}</h2>
            <p className="text-stone-gray">
              {currentLanguage === "en" ? "Manage your account and preferences" : "계정 및 기본 설정 관리"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-12">
          {/* Profile Card - Redesigned to match Passport Identity Page */}
          <div className="bg-[#f8f3e2] p-6 rounded-xl border border-light-sand profile-card relative overflow-hidden">
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

            {/* Empty space where header was */}
            <div className="mb-4 relative z-10"></div>

            {/* Main content with photo on left, details on right */}
            <div className="flex flex-row gap-4 relative z-10">
              {/* Left Side - Photo */}
              <div className="w-1/3 sm:w-1/4">
                <div className="w-full aspect-[3/4] overflow-hidden bg-white p-1 border border-gray-300 mb-2">
                  <img src="/images/jaime-sung-resized.png" alt={userName} className="w-full h-full object-cover" />
                </div>
                <div className="bg-brand-yellow text-deep-navy text-xs font-bold px-2 py-1 rounded text-center">
                  LEVEL {level}
                </div>
              </div>

              {/* Right Side - Profile Details */}
              <div className="w-2/3 sm:w-3/4 space-y-2 text-sm">
                <div>
                  <p className="text-xs text-brand-blue font-medium">
                    {currentLanguage === "en" ? "NAME / 이름" : "이름 / NAME"}
                  </p>
                  <p className="font-bold text-deep-navy">{userName}</p>
                </div>

                <div className="flex justify-between mt-3">
                  <div className="text-center">
                    <p className="font-bold text-deep-navy">{followingCount}</p>
                    <p className="text-xs text-brand-blue font-medium">
                      {currentLanguage === "en" ? "Following" : "팔로잉"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-deep-navy">{followersCount}</p>
                    <p className="text-xs text-brand-blue font-medium">
                      {currentLanguage === "en" ? "Followers" : "팔로워"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-deep-navy">{totalVisits}</p>
                    <p className="text-xs text-brand-blue font-medium">
                      {currentLanguage === "en" ? "Visits" : "방문"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-brand-blue font-medium">
                    {currentLanguage === "en" ? "MEMBER SINCE / 가입일" : "가입일 / MEMBER SINCE"}
                  </p>
                  <p className="font-bold text-deep-navy">{joinDate}</p>
                </div>

                <div>
                  <p className="text-xs text-brand-blue font-medium">
                    {currentLanguage === "en" ? "EXPLORER ID / 탐험가 ID" : "탐험가 ID / EXPLORER ID"}
                  </p>
                  <p className="font-bold text-deep-navy">PTR-2023-JS</p>
                </div>

                {/* Removed total visits and streak section */}
              </div>
            </div>

            {/* XP Progress */}
            <div className="mt-4 pt-4 border-t border-gray-300 relative z-10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-xs text-brand-blue font-medium">
                  {currentLanguage === "en" ? "XP PROGRESS / XP 진행률" : "XP 진행률 / XP PROGRESS"}
                </span>
                <span className="font-medium text-deep-navy">
                  {xp}/{nextLevelXp}
                </span>
              </div>
              <div className="progress-bar mb-2">
                <div className="progress-fill bg-sky-blue" style={{ width: `${xpProgress}%` }}></div>
              </div>
              <p className="text-xs text-stone-gray text-center">
                {currentLanguage === "en"
                  ? `${Math.round(nextLevelXp - xp)} XP until Level ${level + 1}`
                  : `레벨 ${level + 1}까지 ${Math.round(nextLevelXp - xp)} XP 남음`}
              </p>
            </div>

            {/* Social Connections Section with Tabs */}
            <div className="mt-4 pt-4 border-t border-gray-300 relative z-10">
              <div className="flex border-b border-gray-300 mb-3">
                <button
                  className={`flex-1 py-2 text-xs font-medium ${activeTab === "following" ? "text-brand-coral border-b-2 border-brand-coral" : "text-stone-gray"}`}
                  onClick={() => setActiveTab("following")}
                >
                  <Users className="w-4 h-4 inline mr-1" />
                  {currentLanguage === "en" ? "Following" : "팔로잉"}
                </button>
                <button
                  className={`flex-1 py-2 text-xs font-medium ${activeTab === "followers" ? "text-brand-coral border-b-2 border-brand-coral" : "text-stone-gray"}`}
                  onClick={() => setActiveTab("followers")}
                >
                  <Users className="w-4 h-4 inline mr-1" />
                  {currentLanguage === "en" ? "Followers" : "팔로워"}
                </button>
                <button
                  className={`flex-1 py-2 text-xs font-medium ${activeTab === "suggested" ? "text-brand-coral border-b-2 border-brand-coral" : "text-stone-gray"}`}
                  onClick={() => setActiveTab("suggested")}
                >
                  <UserPlus className="w-4 h-4 inline mr-1" />
                  {currentLanguage === "en" ? "Suggested" : "추천"}
                </button>
              </div>

              {/* Following Tab Content */}
              {activeTab === "following" && (
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {friends.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={friend.image || "/placeholder.svg"}
                          alt={friend.name}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                        <div>
                          <p className="text-xs font-medium">{friend.name}</p>
                          <p className="text-[10px] text-stone-gray">
                            {currentLanguage === "en" ? "Level" : "레벨"} {friend.level}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollowToggle(friend.id, "following")}
                        className={`text-xs px-2 py-1 rounded ${friend.isFollowing ? "bg-gray-200 text-stone-gray" : "bg-brand-coral text-white"}`}
                      >
                        {friend.isFollowing ? (
                          <>
                            <UserMinus className="w-3 h-3 inline mr-1" />
                            {currentLanguage === "en" ? "Unfollow" : "언팔로우"}
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3 inline mr-1" />
                            {currentLanguage === "en" ? "Follow" : "팔로우"}
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Followers Tab Content */}
              {activeTab === "followers" && (
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {followers.map((follower) => (
                    <div key={follower.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={follower.image || "/placeholder.svg"}
                          alt={follower.name}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                        <div>
                          <p className="text-xs font-medium">{follower.name}</p>
                          <p className="text-[10px] text-stone-gray">
                            {currentLanguage === "en" ? "Level" : "레벨"} {follower.level}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollowToggle(follower.id, "followers")}
                        className={`text-xs px-2 py-1 rounded ${follower.isFollowing ? "bg-gray-200 text-stone-gray" : "bg-brand-coral text-white"}`}
                      >
                        {follower.isFollowing ? (
                          <>
                            <UserMinus className="w-3 h-3 inline mr-1" />
                            {currentLanguage === "en" ? "Unfollow" : "언팔로우"}
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3 inline mr-1" />
                            {currentLanguage === "en" ? "Follow" : "팔로우"}
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Tab Content */}
              {activeTab === "suggested" && (
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {suggestedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={user.image || "/placeholder.svg"}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                        <div>
                          <p className="text-xs font-medium">{user.name}</p>
                          <p className="text-[10px] text-stone-gray">
                            {currentLanguage === "en" ? "Level" : "레벨"} {user.level}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollowToggle(user.id, "suggested")}
                        className={`text-xs px-2 py-1 rounded ${user.isFollowing ? "bg-gray-200 text-stone-gray" : "bg-brand-coral text-white"}`}
                      >
                        {user.isFollowing ? (
                          <>
                            <UserMinus className="w-3 h-3 inline mr-1" />
                            {currentLanguage === "en" ? "Unfollow" : "언팔로우"}
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3 inline mr-1" />
                            {currentLanguage === "en" ? "Follow" : "팔로우"}
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sign Out Button */}
            <div className="mt-4 pt-4 border-t border-gray-300 relative z-10">
              <button
                className="w-full px-4 py-2 border border-brand-coral text-brand-coral rounded-lg hover:bg-brand-coral hover:text-white transition-colors"
                onClick={handleSignOut}
              >
                {currentLanguage === "en" ? "Sign Out" : "로그아웃"}
              </button>
            </div>
          </div>
        </div>

        {/* Stamp Collection Section - Redesigned */}
        <div className="bg-cloud-white p-6 rounded-xl border border-light-sand mb-12">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">{currentLanguage === "en" ? "Stamp Collection" : "스탬프 컬렉션"}</h3>
              <p className="text-xs text-stone-gray">
                {currentLanguage === "en" ? "Your travel memories" : "당신의 여행 기억들"}
              </p>
            </div>
            <div className="flex items-center">
              <div className="bg-brand-yellow px-3 py-1 rounded-full flex items-center">
                <span className="text-xs font-medium text-deep-navy mr-1">12</span>
                <span className="text-xs text-deep-navy">{currentLanguage === "en" ? "collected" : "수집됨"}</span>
              </div>
              <div className="bg-light-sand px-3 py-1 rounded-full flex items-center ml-2">
                <span className="text-xs font-medium text-stone-gray mr-1">24</span>
                <span className="text-xs text-stone-gray">{currentLanguage === "en" ? "total" : "전체"}</span>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex overflow-x-auto pb-2 mb-4 gap-2 scrollbar-hide">
            <button className="px-3 py-1 bg-brand-coral text-white text-xs rounded-full whitespace-nowrap">
              {currentLanguage === "en" ? "All Stamps" : "모든 스탬프"}
            </button>
            <button className="px-3 py-1 bg-light-sand text-stone-gray text-xs rounded-full whitespace-nowrap">
              {currentLanguage === "en" ? "Food" : "음식"}
            </button>
            <button className="px-3 py-1 bg-light-sand text-stone-gray text-xs rounded-full whitespace-nowrap">
              {currentLanguage === "en" ? "Culture" : "문화"}
            </button>
            <button className="px-3 py-1 bg-light-sand text-stone-gray text-xs rounded-full whitespace-nowrap">
              {currentLanguage === "en" ? "Nature" : "자연"}
            </button>
            <button className="px-3 py-1 bg-light-sand text-stone-gray text-xs rounded-full whitespace-nowrap">
              {currentLanguage === "en" ? "Shopping" : "쇼핑"}
            </button>
          </div>

          {/* Stamps Grid with Improved Design */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {stamps.map((stamp) => (
              <div
                key={stamp.id}
                className="stamp-card relative flex flex-col items-center p-2 rounded-lg border border-light-sand hover:border-brand-coral transition-all hover:shadow-md"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-coral p-0.5 bg-white mb-1 relative">
                  <img
                    src={stamp.image || "/placeholder.svg"}
                    alt={stamp.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                  {/* Category Indicator */}
                  <div
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border border-white ${
                      stamp.category === "food"
                        ? "bg-orange-400"
                        : stamp.category === "culture"
                          ? "bg-purple-400"
                          : stamp.category === "shopping"
                            ? "bg-blue-400"
                            : "bg-green-400"
                    }`}
                  ></div>
                </div>
                <p className="text-xs font-medium text-center line-clamp-1">{stamp.name}</p>
                <p className="text-[10px] text-stone-gray">{stamp.date}</p>
              </div>
            ))}

            {/* Recently Unlocked Stamp with Special Effect */}
            <div className="stamp-card relative flex flex-col items-center p-2 rounded-lg border-2 border-brand-yellow bg-gradient-to-b from-yellow-50 to-white hover:shadow-md">
              <div className="absolute -top-1 -right-1 bg-brand-yellow text-xs text-deep-navy px-1.5 py-0.5 rounded-full">
                {currentLanguage === "en" ? "New" : "신규"}
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-yellow p-0.5 bg-white mb-1 relative animate-pulse">
                <img
                  src="/images/n-seoultower.png"
                  alt="N Seoul Tower"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border border-white bg-purple-400"></div>
              </div>
              <p className="text-xs font-medium text-center line-clamp-1">N Seoul Tower</p>
              <p className="text-[10px] text-brand-coral font-medium">{currentLanguage === "en" ? "Today" : "오늘"}</p>
            </div>

            {/* Locked Stamps */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={`locked-${i}`}
                className="stamp-card relative flex flex-col items-center p-2 rounded-lg border border-dashed border-light-sand bg-gray-50"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 p-0.5 bg-gray-100 mb-1 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-300"
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
                <p className="text-xs font-medium text-center text-gray-400">
                  {currentLanguage === "en" ? "Locked" : "잠김"}
                </p>
                <p className="text-[10px] text-gray-300">
                  {currentLanguage === "en" ? "Visit to unlock" : "방문하여 잠금 해제"}
                </p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-gray">
                {currentLanguage === "en" ? "Collection Progress" : "컬렉션 진행도"}
              </span>
              <span className="font-medium">12/24</span>
            </div>
            <div className="h-2 bg-light-sand rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-coral to-brand-yellow" style={{ width: "50%" }}></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              className="flex-1 py-2 bg-brand-coral text-cloud-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
              onClick={handleOpenStampPokedex}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              {currentLanguage === "en" ? "View All Stamps" : "모든 스탬프 보기"}
            </button>
            <button className="flex-1 py-2 border border-brand-coral text-brand-coral rounded-lg hover:bg-brand-coral hover:text-white transition-colors flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {currentLanguage === "en" ? "Check In Now" : "지금 체크인"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileTab
