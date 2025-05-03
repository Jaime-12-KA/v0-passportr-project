export type TipAuthor = {
  name: string
  nameKr?: string
  avatar: string
  bio: string
  bioKr?: string
  location: string
  locationKr?: string
  level?: number
  isVerified?: boolean
}

export type LocalTip = {
  id: string
  placeId: string
  content: { en: string; kr: string }
  author: TipAuthor
  createdAt: string
  likes: number
  tags?: string[]
}

// 작성자 정보
const authors: Record<string, TipAuthor> = {
  jaime: {
    name: "Jaime Sung",
    nameKr: "성재미",
    avatar: "/images/jaime-sung-avatar.png",
    bio: "Travel blogger & Seoul native. I love sharing hidden gems in my city!",
    bioKr: "여행 블로거 & 서울 토박이. 우리 도시의 숨겨진 보석들을 공유하는 것을 좋아해요!",
    location: "Seoul, South Korea",
    locationKr: "대한민국 서울",
    level: 12,
    isVerified: true,
  },
  minho: {
    name: "Minho Park",
    nameKr: "박민호",
    avatar: "/images/Friends_Tom Park.jpg",
    bio: "Food enthusiast and cultural guide with 5 years of experience showing tourists around Seoul.",
    bioKr: "5년 동안 관광객들에게 서울을 안내한 경험이 있는 음식 애호가이자 문화 가이드입니다.",
    location: "Seoul, South Korea",
    locationKr: "대한민국 서울",
    level: 10,
  },
  sujin: {
    name: "Sujin Kim",
    nameKr: "김수진",
    avatar: "/images/Friends_Sarah Lee.jpg",
    bio: "Photographer and cafe explorer. I've visited over 200 cafes in Seoul!",
    bioKr: "사진작가이자 카페 탐험가. 서울에서 200개 이상의 카페를 방문했어요!",
    location: "Seoul, South Korea",
    locationKr: "대한민국 서울",
    level: 8,
  },
  minji: {
    name: "Minji Kim",
    nameKr: "김민지",
    avatar: "/images/Friends_Minji Kim.jpg",
    bio: "History buff and tour guide specializing in Korean palaces and traditional culture.",
    bioKr: "한국 궁궐과 전통 문화를 전문으로 하는 역사 애호가이자 투어 가이드입니다.",
    location: "Seoul, South Korea",
    locationKr: "대한민국 서울",
    level: 15,
    isVerified: true,
  },
  james: {
    name: "James Choi",
    nameKr: "최재임스",
    avatar: "/images/Friends_James Choi.jpg",
    bio: "Street food connoisseur and night market expert. Follow me for the best bites in town!",
    bioKr: "길거리 음식 전문가이자 야시장 전문가. 도시 최고의 맛집을 알려드립니다!",
    location: "Seoul, South Korea",
    locationKr: "대한민국 서울",
    level: 9,
  },
  nari: {
    name: "Nari Lee",
    nameKr: "이나리",
    avatar: "/images/alien_james.png",
    bio: "Hiking enthusiast and nature photographer. I've hiked all the mountains around Seoul!",
    bioKr: "등산 애호가이자 자연 사진작가. 서울 주변의 모든 산을 등반했어요!",
    location: "Seoul, South Korea",
    locationKr: "대한민국 서울",
    level: 7,
  },
  sarah: {
    name: "Sarah Johnson",
    nameKr: "사라 존슨",
    avatar: "/images/astronaut_sarah.png",
    bio: "American expat living in Seoul for 7 years. I love discovering cultural differences!",
    bioKr: "7년 동안 서울에 거주하는 미국인 이주자. 문화적 차이를 발견하는 것을 좋아해요!",
    location: "Seoul, South Korea (Originally from New York)",
    locationKr: "대한민국 서울 (원래는 뉴욕 출신)",
    level: 11,
    isVerified: true,
  },
  somchai: {
    name: "Somchai Wattana",
    nameKr: "솜차이 와타나",
    avatar: "/placeholder.svg?key=ri6u8",
    bio: "Bangkok native and street food expert. I know all the best spots in the city!",
    bioKr: "방콕 토박이이자 길거리 음식 전문가. 도시 최고의 장소를 모두 알고 있어요!",
    location: "Bangkok, Thailand",
    locationKr: "태국 방콕",
    level: 13,
    isVerified: true,
  },
  mike: {
    name: "Mike Rodriguez",
    nameKr: "마이크 로드리게즈",
    avatar: "/placeholder.svg?key=xdi0i",
    bio: "NYC tour guide with a passion for the city's history and architecture.",
    bioKr: "뉴욕시의 역사와 건축에 열정을 가진 뉴욕 투어 가이드.",
    location: "New York City, USA",
    locationKr: "미국 뉴욕시",
    level: 14,
    isVerified: true,
  },
  jiwon: {
    name: "Jiwon Park",
    nameKr: "박지원",
    avatar: "/placeholder.svg?key=sk99k",
    bio: "Busan local and seafood lover. I can tell you where to find the freshest catch!",
    bioKr: "부산 현지인이자 해산물 애호가. 가장 신선한 해산물을 어디서 찾을 수 있는지 알려드릴게요!",
    location: "Busan, South Korea",
    locationKr: "대한민국 부산",
    level: 8,
    isVerified: true,
  },
}

// 장소별 현지인 팁 데이터
export const localTips: LocalTip[] = [
  // 서울 - 경복궁
  {
    id: "tip-gyeongbokgung-1",
    placeId: "gyeongbokgung",
    content: {
      en: "Visit early in the morning (before 10am) to avoid crowds and get the best photos without many people in the background. The light is also perfect for photography at this time.",
      kr: "아침 일찍(오전 10시 이전)에 방문하면 사람들이 적고 배경에 사람이 많지 않은 최고의 사진을 찍을 수 있어요. 이 시간에는 사진 촬영을 위한 빛도 완벽합니다.",
    },
    author: authors.minji,
    createdAt: "2023-04-15T10:00:00Z",
    likes: 156,
    tags: ["photography", "crowds", "lighting"],
  },
  {
    id: "tip-gyeongbokgung-2",
    placeId: "gyeongbokgung",
    content: {
      en: "Don't miss the changing of the royal guard ceremony at 10am and 2pm. It's a colorful spectacle that offers great insight into Korean royal traditions.",
      kr: "오전 10시와 오후 2시에 있는 왕궁 수비대 교대식을 놓치지 마세요. 한국 왕실 전통에 대한 훌륭한 통찰력을 제공하는 화려한 장관입니다.",
    },
    author: authors.jaime,
    createdAt: "2023-05-22T14:00:00Z",
    likes: 98,
    tags: ["ceremony", "tradition", "culture"],
  },
  {
    id: "tip-gyeongbokgung-3",
    placeId: "gyeongbokgung",
    content: {
      en: "There's a free English guided tour at 11am and 1:30pm. It's worth joining as the guides share fascinating historical details you won't find in guidebooks.",
      kr: "오전 11시와 오후 1시 30분에 무료 영어 가이드 투어가 있습니다. 가이드들이 가이드북에서 찾을 수 없는 매혹적인 역사적 세부 사항을 공유하므로 참여할 가치가 있습니다.",
    },
    author: authors.sarah,
    createdAt: "2023-06-10T11:00:00Z",
    likes: 87,
    tags: ["tour", "history", "details"],
  },

  // 서울 - 남산타워
  {
    id: "tip-nseoul-1",
    placeId: "n-seoultower",
    content: {
      en: "Take the cable car up but walk down through the park for a beautiful experience. The hiking trail offers stunning views of the city and is quite easy.",
      kr: "케이블카를 타고 올라가서 공원을 통해 내려오면 아름다운 경험을 할 수 있어요. 하이킹 코스는 도시의 멋진 전망을 제공하며 꽤 쉽습니다.",
    },
    author: authors.nari,
    createdAt: "2023-03-18T15:00:00Z",
    likes: 124,
    tags: ["hike", "views", "easy"],
  },
  {
    id: "tip-nseoul-2",
    placeId: "n-seoultower",
    content: {
      en: "Visit at sunset for the most magical views of Seoul. Stay until it gets dark to see the city light up - it's breathtaking!",
      kr: "서울의 가장 마법 같은 전망을 위해 일몰 시간에 방문하세요. 어두워질 때까지 머물러 도시가 밝아지는 것을 보세요 - 정말 멋집니다!",
    },
    author: authors.jaime,
    createdAt: "2023-07-05T19:00:00Z",
    likes: 203,
    tags: ["sunset", "night", "views"],
  },
  {
    id: "tip-nseoul-3",
    placeId: "n-seoultower",
    content: {
      en: "There's a traditional Korean restaurant on the second floor that offers good food with amazing views. Make a reservation in advance if you want a window seat.",
      kr: "2층에는 멋진 전망과 함께 좋은 음식을 제공하는 전통 한국 레스토랑이 있습니다. 창가 자리를 원하시면 미리 예약하세요.",
    },
    author: authors.minho,
    createdAt: "2023-05-30T12:00:00Z",
    likes: 76,
    tags: ["restaurant", "food", "views"],
  },

  // 서울 - 광장시장
  {
    id: "tip-gwangjang-1",
    placeId: "gwangjang",
    content: {
      en: "Try the 'mayak gimbap' (addictive seaweed rice rolls) - they're small but packed with flavor. The best stalls are in the center of the market.",
      kr: "마약김밥을 꼭 드셔보세요 - 작지만 맛이 가득합니다. 가장 좋은 가게들은 시장 중앙에 있습니다.",
    },
    author: authors.james,
    createdAt: "2023-02-12T16:00:00Z",
    likes: 189,
    tags: ["food", "kimbap", "market"],
  },
  {
    id: "tip-gwangjang-2",
    placeId: "gwangjang",
    content: {
      en: "The market is less crowded on weekday mornings. If you want to avoid tourists and enjoy a more authentic experience, this is the best time to visit.",
      kr: "평일 아침에는 시장이 덜 붐빕니다. 관광객을 피하고 더 진정한 경험을 즐기고 싶다면 이때가 방문하기 가장 좋은 시간입니다.",
    },
    author: authors.minho,
    createdAt: "2023-04-08T09:00:00Z",
    likes: 112,
    tags: ["crowds", "authentic", "weekday"],
  },
  {
    id: "tip-gwangjang-3",
    placeId: "gwangjang",
    content: {
      en: "Don't miss the handmade mung bean pancakes (bindaetteok). Look for stalls where they grind the beans fresh - you can tell by the stone mills at the front.",
      kr: "수제 녹두전(빈대떡)을 놓치지 마세요. 콩을 신선하게 갈아주는 가게를 찾으세요 - 앞에 있는 맷돌로 알 수 있습니다.",
    },
    author: authors.jaime,
    createdAt: "2023-06-25T17:00:00Z",
    likes: 145,
    tags: ["food", "bindaetteok", "fresh"],
  },

  // 서울 - 홍대
  {
    id: "tip-hongdae-1",
    placeId: "hongdae",
    content: {
      en: "The street performers usually start around 7pm on weekends. Arrive early to get a good spot to watch - it gets very crowded!",
      kr: "거리 공연자들은 주말에 보통 저녁 7시경에 시작합니다. 좋은 관람 자리를 잡으려면 일찍 도착하세요 - 매우 붐빕니다!",
    },
    author: authors.sujin,
    createdAt: "2023-03-05T19:00:00Z",
    likes: 167,
    tags: ["performances", "crowds", "weekend"],
  },
  {
    id: "tip-hongdae-2",
    placeId: "hongdae",
    content: {
      en: "Explore the small alleys behind the main streets for the best cafes and boutiques. That's where the locals go to avoid the tourist crowds.",
      kr: "메인 거리 뒤의 작은 골목길을 탐험하면 최고의 카페와 부티크를 찾을 수 있어요. 현지인들이 관광객 무리를 피하기 위해 가는 곳이에요.",
    },
    author: authors.jaime,
    createdAt: "2023-05-17T10:00:00Z",
    likes: 203,
    tags: ["cafes", "boutiques", "locals"],
  },
  {
    id: "tip-hongdae-3",
    placeId: "hongdae",
    content: {
      en: "Visit the free trick art museum in the shopping complex near exit 9. It's small but fun for taking optical illusion photos.",
      kr: "9번 출구 근처 쇼핑 단지에 있는 무료 트릭아트 박물관을 방문해보세요. 작지만 착시 사진을 찍기에 재미있어요.",
    },
    author: authors.sarah,
    createdAt: "2023-07-02T14:00:00Z",
    likes: 89,
    tags: ["museum", "art", "photos"],
  },

  // 서울 - 북촌한옥마을
  {
    id: "tip-bukchon-1",
    placeId: "bukchon",
    content: {
      en: "The best views of the traditional houses are from the top of the hill. Follow the signs for 'Bukchon Viewpoint' for the iconic postcard view.",
      kr: "전통 가옥의 가장 좋은 전망은 언덕 꼭대기에서 볼 수 있습니다. '북촌 전망대'로 가는 표지판을 따라가면 상징적인 엽서 뷰를 볼 수 있어요.",
    },
    author: authors.minji,
    createdAt: "2023-04-22T16:00:00Z",
    likes: 176,
    tags: ["views", "postcard", "hill"],
  },
  {
    id: "tip-bukchon-2",
    placeId: "bukchon",
    content: {
      en: "Remember this is a residential area - please be quiet and respectful. The best time to visit is weekday mornings when it's peaceful.",
      kr: "여기는 주거 지역이라는 것을 기억하세요 - 조용히 하고 존중해주세요. 방문하기 가장 좋은 시간은 평화로운 평일 아침입니다.",
    },
    author: authors.jaime,
    createdAt: "2023-06-14T09:00:00Z",
    likes: 132,
    tags: ["residential", "quiet", "weekday"],
  },
  {
    id: "tip-bukchon-3",
    placeId: "bukchon",
    content: {
      en: "There are several traditional tea houses hidden in the alleys. My favorite is 'Cha Masineun Tteul' where you can enjoy tea in a 100-year-old hanok.",
      kr: "골목에 숨겨진 여러 전통 찻집이 있습니다. 제가 가장 좋아하는 곳은 100년 된 한옥에서 차를 즐길 수 있는 '차 마시는 뜰'입니다.",
    },
    author: authors.sujin,
    createdAt: "2023-05-08T14:00:00Z",
    likes: 98,
    tags: ["tea", "hanok", "traditional"],
  },

  // 방콕 - 왓아룬
  {
    id: "tip-watarun-1",
    placeId: "watarun",
    content: {
      en: "Visit in the late afternoon to see the temple glow in the sunset light. Then cross the river to Sala Rattanakosin for dinner with a view of the illuminated temple.",
      kr: "해질녘에 방문하여 일몰 빛에 빛나는 사원을 보세요. 그런 다음 강을 건너 살라 라타나코신으로 가서 조명이 켜진 사원을 보며 저녁 식사를 즐기세요.",
    },
    author: authors.somchai,
    createdAt: "2023-03-10T17:00:00Z",
    likes: 145,
    tags: ["sunset", "dinner", "views"],
  },
  {
    id: "tip-watarun-2",
    placeId: "watarun",
    content: {
      en: "Wear appropriate clothing (shoulders and knees covered) or you'll have to rent cover-ups at the entrance. Also, bring a bottle of water - it gets very hot!",
      kr: "적절한 복장(어깨와 무릎을 가린)을 입거나 입구에서 가리개를 대여해야 합니다. 또한, 물병을 가져오세요 - 매우 더워집니다!",
    },
    author: authors.jaime,
    createdAt: "2023-05-25T12:00:00Z",
    likes: 87,
    tags: ["dresscode", "water", "heat"],
  },

  // 방콕 - 카오산로드
  {
    id: "tip-khaosan-1",
    placeId: "khaosan",
    content: {
      en: "The street is completely different during the day vs. night. Visit during both times for two totally different experiences!",
      kr: "이 거리는 낮과 밤에 완전히 다릅니다. 두 가지 완전히 다른 경험을 위해 두 시간대 모두 방문해보세요!",
    },
    author: authors.somchai,
    createdAt: "2023-04-18T10:00:00Z",
    likes: 156,
    tags: ["day", "night", "experience"],
  },
  {
    id: "tip-khaosan-2",
    placeId: "khaosan",
    content: {
      en: "For the best pad thai on Khaosan, look for the cart with the longest line of locals (usually near the eastern end of the street).",
      kr: "카오산에서 최고의 팟타이를 찾으려면 현지인들이 가장 길게 줄을 서 있는 카트를 찾으세요(보통 거리 동쪽 끝 근처에 있습니다).",
    },
    author: authors.jaime,
    createdAt: "2023-06-30T18:00:00Z",
    likes: 123,
    tags: ["food", "padthai", "locals"],
  },

  // 뉴욕 - 자유의 여신상
  {
    id: "tip-liberty-1",
    placeId: "liberty",
    content: {
      en: "The Staten Island Ferry is free and gives you great views of the Statue of Liberty. It's a great alternative if you don't have time for the official tour.",
      kr: "스태튼 아일랜드 페리는 무료이며 자유의 여신상의 멋진 전망을 제공합니다. 공식 투어를 위한 시간이 없다면 좋은 대안입니다.",
    },
    author: authors.mike,
    createdAt: "2023-02-28T10:00:00Z",
    likes: 189,
    tags: ["ferry", "views", "free"],
  },
  {
    id: "tip-liberty-2",
    placeId: "liberty",
    content: {
      en: "Book crown access tickets at least 3 months in advance if you want to go all the way to the top. They sell out very quickly!",
      kr: "꼭대기까지 가고 싶다면 최소 3개월 전에 크라운 액세스 티켓을 예약하세요. 매우 빨리 매진됩니다!",
    },
    author: authors.jaime,
    createdAt: "2023-05-12T14:00:00Z",
    likes: 134,
    tags: ["tickets", "crown", "advance"],
  },

  // 뉴욕 - 엠파이어 스테이트 빌딩
  {
    id: "tip-empire-1",
    placeId: "empire",
    content: {
      en: "Visit between 8-10am to avoid the worst crowds. Or go very late at night (after 11pm) for a magical nighttime experience with fewer people.",
      kr: "가장 붐비는 시간을 피하려면 오전 8-10시 사이에 방문하세요. 또는 밤늦게(오후 11시 이후)에 가면 사람이 적은 마법 같은 야간 경험을 할 수 있습니다.",
    },
    author: authors.mike,
    createdAt: "2023-03-22T09:00:00Z",
    likes: 167,
    tags: ["crowds", "night", "views"],
  },
  {
    id: "tip-empire-2",
    placeId: "empire",
    content: {
      en: "The 86th floor outdoor observatory is better than the 102nd floor indoor one. The view isn't that different but the experience of being outside is worth it.",
      kr: "86층 야외 전망대가 102층 실내 전망대보다 낫습니다. 전망은 크게 다르지 않지만 야외에 있는 경험은 가치가 있습니다.",
    },
    author: authors.jaime,
    createdAt: "2023-06-05T17:00:00Z",
    likes: 142,
    tags: ["observatory", "views", "experience"],
  },

  // 뉴욕 - 타임스퀘어
  {
    id: "tip-timessquare-1",
    placeId: "timessquare",
    content: {
      en: "Visit late at night (after 11pm) when it's less crowded but still bright as day with all the billboards. It's a surreal experience!",
      kr: "사람이 적지만 모든 광고판으로 여전히 낮처럼 밝은 늦은 밤(오후 11시 이후)에 방문하세요. 초현실적인 경험입니다!",
    },
    author: authors.mike,
    createdAt: "2023-04-15T23:00:00Z",
    likes: 178,
    tags: ["night", "billboards", "surreal"],
  },
  {
    id: "tip-timessquare-2",
    placeId: "timessquare",
    content: {
      en: "Avoid the costumed characters who want to take photos with you - they'll demand money afterward. And watch your belongings as it's a hotspot for pickpockets.",
      kr: "당신과 사진을 찍고 싶어하는 코스튬 캐릭터들을 피하세요 - 그들은 나중에 돈을 요구할 것입니다. 그리고 소매치기의 핫스팟이므로 소지품을 주의하세요.",
    },
    author: authors.jaime,
    createdAt: "2023-05-28T16:00:00Z",
    likes: 156,
    tags: ["characters", "safety", "belongings"],
  },

  // 제주 - 한라산
  {
    id: "tip-hallasan-1",
    placeId: "hallasan",
    content: {
      en: "Start early (before 8am) if you want to reach the summit and return before the cut-off times. Bring plenty of water and snacks as there are no shops on the trails.",
      kr: "정상에 도달하고 제한 시간 전에 돌아오려면 일찍(오전 8시 이전) 시작하세요. 등산로에는 상점이 없으므로 충분한 물과 간식을 가져오세요.",
    },
    author: authors.hyejin,
    createdAt: "2023-03-08T07:00:00Z",
    likes: 198,
    tags: ["early", "water", "snacks"],
  },
  {
    id: "tip-hallasan-2",
    placeId: "hallasan",
    content: {
      en: "The Gwaneumsa Trail is the most beautiful but also the most challenging. For an easier hike with still great views, take the Seongpanak Trail.",
      kr: "관음사 코스가 가장 아름답지만 가장 도전적입니다. 여전히 멋진 전망을 볼 수 있는 더 쉬운 등산을 원한다면 성판악 코스를 이용하세요.",
    },
    author: authors.jaime,
    createdAt: "2023-05-20T13:00:00Z",
    likes: 145,
    tags: ["trail", "views", "difficulty"],
  },

  // 제주 - 만장굴
  {
    id: "tip-manjanggul-1",
    placeId: "manjanggul",
    content: {
      en: "Bring a light jacket even in summer - the cave maintains a cool temperature year-round. And wear good shoes as the floor can be slippery.",
      kr: "여름에도 가벼운 재킷을 가져오세요 - 동굴은 연중 시원한 온도를 유지합니다. 그리고 바닥이 미끄러울 수 있으므로 좋은 신발을 신으세요.",
    },
    author: authors.hyejin,
    createdAt: "2023-04-12T14:00:00Z",
    likes: 132,
    tags: ["jacket", "shoes", "temperature"],
  },
  {
    id: "tip-manjanggul-2",
    placeId: "manjanggul",
    content: {
      en: "Visit in the late afternoon when most tour groups have left. You'll have a more peaceful experience and can take your time exploring.",
      kr: "대부분의 관광 그룹이 떠난 늦은 오후에 방문하세요. 더 평화로운 경험을 할 수 있고 천천히 탐험할 수 있습니다.",
    },
    author: authors.jaime,
    createdAt: "2023-06-18T16:00:00Z",
    likes: 98,
    tags: ["crowds", "peaceful", "afternoon"],
  },

  // 부산 - 해운대
  {
    id: "tip-haeundae-1",
    placeId: "haeundae",
    content: {
      en: "Visit on weekdays if possible - the beach gets extremely crowded on summer weekends. Early mornings are beautiful and peaceful.",
      kr: "가능하면 평일에 방문하세요 - 여름 주말에는 해변이 매우 붐빕니다. 이른 아침은 아름답고 평화롭습니다.",
    },
    author: authors.jiwon,
    createdAt: "2023-03-25T08:00:00Z",
    likes: 176,
    tags: ["weekday", "crowds", "peaceful"],
  },
  {
    id: "tip-haeundae-2",
    placeId: "haeundae",
    content: {
      en: "Try the seafood restaurants in Millak Fish Market instead of the touristy ones on the beachfront. Better prices and more authentic food!",
      kr: "해변가의 관광객용 식당 대신 민락 어시장의 해산물 식당을 이용해보세요. 더 나은 가격과 더 정통한 음식을 맛볼 수 있습니다!",
    },
    author: authors.jaime,
    createdAt: "2023-05-15T12:00:00Z",
    likes: 154,
    tags: ["seafood", "authentic", "prices"],
  },

  // 부산 - 자갈치시장
  {
    id: "tip-jagalchi-1",
    placeId: "jagalchi",
    content: {
      en: "Go to the second floor of the main market building where you can select fresh seafood and have it cooked on the spot. An unforgettable experience!",
      kr: "신선한 해산물을 선택하고 그 자리에서 요리해 먹을 수 있는 주 시장 건물 2층으로 가보세요. 잊을 수 없는 경험입니다!",
    },
    author: authors.jiwon,
    createdAt: "2023-04-05T10:00:00Z",
    likes: 187,
    tags: ["seafood", "fresh", "experience"],
  },
  {
    id: "tip-jagalchi-2",
    placeId: "jagalchi",
    content: {
      en: "Visit early in the morning (around 5-6am) to see the fish auction in action. It's fascinating to watch the local fishermen and buyers in action.",
      kr: "어시장 경매를 보려면 이른 아침(오전 5-6시경)에 방문하세요. 현지 어부들과 구매자들이 활동하는 모습을 보는 것은 매혹적입니다.",
    },
    author: authors.jaime,
    createdAt: "2023-06-22T06:00:00Z",
    likes: 132,
    tags: ["auction", "fishermen", "morning"],
  },
]

// 장소 ID로 팁을 가져오는 함수
export function getTipsByPlaceId(placeId: string): LocalTip[] {
  return localTips.filter((tip) => tip.placeId === placeId)
}

// 특정 팁 ID로 팁을 가져오는 함수
export function getTipById(tipId: string): LocalTip | undefined {
  return localTips.find((tip) => tip.id === tipId)
}

// 스탬프 ID로 현지인 팁 가져오기
export function getLocalTipsByStampId(stampId: string): LocalTip[] {
  // 실제 앱에서는 데이터베이스 또는 API에서 팁을 가져와야 합니다.
  // 여기서는 임시로 샘플 데이터를 사용합니다.
  switch (stampId) {
    case "gyeongbokgung":
      return localTips.filter((tip) => tip.placeId === "gyeongbokgung")
    case "n-seoultower":
      return localTips.filter((tip) => tip.placeId === "n-seoultower")
    case "gwangjang":
      return localTips.filter((tip) => tip.placeId === "gwangjang")
    case "hongdae":
      return localTips.filter((tip) => tip.placeId === "hongdae")
    case "bukchon":
      return localTips.filter((tip) => tip.placeId === "bukchon")
    case "watarun":
      return localTips.filter((tip) => tip.placeId === "watarun")
    case "khaosan":
      return localTips.filter((tip) => tip.placeId === "khaosan")
    case "liberty":
      return localTips.filter((tip) => tip.placeId === "liberty")
    case "empire":
      return localTips.filter((tip) => tip.placeId === "empire")
    case "timessquare":
      return localTips.filter((tip) => tip.placeId === "timessquare")
    case "hallasan":
      return localTips.filter((tip) => tip.placeId === "hallasan")
    case "manjanggul":
      return localTips.filter((tip) => tip.placeId === "hallasan")
    case "haeundae":
      return localTips.filter((tip) => tip.placeId === "haeundae")
    case "jagalchi":
      return localTips.filter((tip) => tip.placeId === "jagalchi")
    case "bukchon":
      return localTips.filter((tip) => tip.placeId === "bukchon")
    case "hongdae":
      return localTips.filter((tip) => tip.placeId === "hongdae")
    case "gwangjang":
      return localTips.filter((tip) => tip.placeId === "gwangjang")
    default:
      return []
  }
}
