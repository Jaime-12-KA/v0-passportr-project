"use client"

import { type FC, useState } from "react"

interface QATabProps {
  currentLanguage: string
}

const QATab: FC<QATabProps> = ({ currentLanguage }) => {
  const [activeFilter, setActiveFilter] = useState("trending")
  const [qaLanguage, setQALanguage] = useState("en")

  return (
    <div id="qa" className="tab-content">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold serif-font">
            {currentLanguage === "en" ? "Q&A Forum" : "질문 & 답변 포럼"}
          </h2>
          <p className="text-stone-gray">
            {currentLanguage === "en" ? "Ask questions and share your knowledge" : "질문하고 지식을 공유하세요"}
          </p>
        </div>
        <div className="flex items-center">
          <div className="mr-4">
            <div className="language-toggle">
              <div
                className={`language-option qa-en ${qaLanguage === "en" ? "active" : ""}`}
                onClick={() => setQALanguage("en")}
              >
                EN
              </div>
              <div
                className={`language-option qa-kr ${qaLanguage === "kr" ? "active" : ""}`}
                onClick={() => setQALanguage("kr")}
              >
                KR
              </div>
              <div
                className="language-slider qa-slider"
                style={{
                  width: "36px",
                  transform: qaLanguage === "en" ? "translateX(0)" : "translateX(36px)",
                }}
              ></div>
            </div>
          </div>
          <button className="px-4 py-2 bg-sunset-coral text-white rounded-lg btn-effect">
            <i className="fas fa-plus mr-1"></i>
            <span>{currentLanguage === "en" ? "Ask Question" : "질문하기"}</span>
          </button>
        </div>
      </div>

      <div className="flex mb-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder={currentLanguage === "en" ? "Search questions..." : "질문 검색..."}
            className="w-full px-4 py-3 rounded-lg border border-light-sand focus:outline-none focus:border-sky-blue transition-colors"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 hover-effect">
            <i className="fas fa-search text-stone-gray"></i>
          </button>
        </div>
      </div>

      <div className="passport-tabs mb-6">
        <div
          className={`passport-tab ${activeFilter === "trending" ? "active" : ""}`}
          onClick={() => setActiveFilter("trending")}
        >
          {currentLanguage === "en" ? "Trending" : "인기"}
        </div>
        <div
          className={`passport-tab ${activeFilter === "recent" ? "active" : ""}`}
          onClick={() => setActiveFilter("recent")}
        >
          {currentLanguage === "en" ? "Recent" : "최근"}
        </div>
        <div
          className={`passport-tab ${activeFilter === "unanswered" ? "active" : ""}`}
          onClick={() => setActiveFilter("unanswered")}
        >
          {currentLanguage === "en" ? "Unanswered" : "미답변"}
        </div>
        <div
          className={`passport-tab ${activeFilter === "mystuff" ? "active" : ""}`}
          onClick={() => setActiveFilter("mystuff")}
        >
          {currentLanguage === "en" ? "My Questions" : "내 질문"}
        </div>
      </div>

      <div className="mb-12">
        {/* Question 1 */}
        <div className="bg-cloud-white p-4 rounded-lg border border-light-sand mb-4">
          <div className="flex items-start mb-3">
            <div className="w-10 h-10 bg-light-sand rounded-full flex items-center justify-center mr-3">
              <span className="text-deep-navy font-medium text-sm">TK</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold mb-1">
                {currentLanguage === "en" ? "Best street food markets in Seoul?" : "서울의 최고 길거리 음식 시장은?"}
              </h4>
              <p className="text-stone-gray mb-3">
                {currentLanguage === "en"
                  ? "I'm visiting Seoul next week and want to try authentic street food. Which markets would you recommend for the best experience?"
                  : "다음 주에 서울을 방문할 예정인데 정통 길거리 음식을 먹어보고 싶습니다. 최고의 경험을 위해 어떤 시장을 추천하시나요?"}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-light-sand px-2 py-1 rounded-full text-xs font-medium">
                  {currentLanguage === "en" ? "Seoul" : "서울"}
                </span>
                <span className="bg-light-sand px-2 py-1 rounded-full text-xs font-medium">
                  {currentLanguage === "en" ? "Food" : "음식"}
                </span>
                <span className="bg-light-sand px-2 py-1 rounded-full text-xs font-medium">
                  {currentLanguage === "en" ? "Markets" : "시장"}
                </span>
              </div>
              <div className="flex items-center text-sm text-stone-gray">
                <span>{currentLanguage === "en" ? "5 answers" : "5개의 답변"}</span>
                <span className="mx-2">•</span>
                <span>{currentLanguage === "en" ? "Asked 2 days ago" : "2일 전에 질문"}</span>
              </div>
            </div>
            <div className="flex flex-col items-center ml-4">
              <div className="w-10 h-10 bg-sky-blue bg-opacity-10 rounded-lg flex items-center justify-center mb-1 hover-effect">
                <i className="fas fa-arrow-up text-sky-blue"></i>
              </div>
              <span className="font-medium">23</span>
            </div>
          </div>

          <div className="ml-13 pl-13">
            <div className="border-l-2 border-light-sand pl-4 ml-6">
              <div className="flex items-start mb-3">
                <div className="w-8 h-8 bg-light-sand rounded-full flex items-center justify-center mr-3">
                  <span className="text-deep-navy font-medium text-xs">JS</span>
                </div>
                <div>
                  <p className="mb-1">
                    {currentLanguage === "en"
                      ? "Definitely check out Gwangjang Market! It's one of the oldest and most famous markets with amazing food stalls. Try the mung bean pancakes and kimbap."
                      : "광장시장을 꼭 가보세요! 가장 오래되고 유명한 시장 중 하나로 맛있는 음식 노점이 많습니다. 녹두전과 김밥을 꼭 드셔보세요."}
                  </p>
                  <div className="flex items-center text-xs text-stone-gray">
                    <span>{currentLanguage === "en" ? "2 days ago" : "2일 전"}</span>
                    <div className="flex items-center ml-3 hover-effect">
                      <i className="fas fa-arrow-up text-sky-blue mr-1"></i>
                      <span>12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-light-sand">
            <button className="text-sky-blue flex items-center hover-effect">
              <i className="fas fa-reply mr-1"></i>
              <span>{currentLanguage === "en" ? "Answer" : "답변하기"}</span>
            </button>
            <div className="flex items-center">
              <button className="mr-3 text-stone-gray hover:text-deep-navy transition-colors hover-effect">
                <i className="far fa-bookmark"></i>
              </button>
              <button className="text-stone-gray hover:text-deep-navy transition-colors hover-effect">
                <i className="fas fa-share-alt"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Additional questions would be added here */}
      </div>

      {/* Q&A Stats & Rewards */}
      <div className="bg-light-sand rounded-xl p-6">
        <h3 className="text-xl font-bold serif-font mb-4">
          {currentLanguage === "en" ? "Q&A Stats & Rewards" : "질문 & 답변 통계 및 보상"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-cloud-white p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-sunset-coral rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-question text-white text-lg"></i>
              </div>
              <div>
                <h4 className="font-bold">{currentLanguage === "en" ? "Questions Asked" : "질문한 수"}</h4>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-gray">{currentLanguage === "en" ? "Engagement Rate" : "참여율"}</span>
              <span className="font-medium">85%</span>
            </div>
          </div>

          <div className="bg-cloud-white p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-sky-blue rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-comment-dots text-white text-lg"></i>
              </div>
              <div>
                <h4 className="font-bold">{currentLanguage === "en" ? "Answers Given" : "답변한 수"}</h4>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-gray">{currentLanguage === "en" ? "Helpful Votes" : "도움됨 투표"}</span>
              <span className="font-medium">38</span>
            </div>
          </div>

          <div className="bg-cloud-white p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-sunshine-yellow rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-trophy text-deep-navy text-lg"></i>
              </div>
              <div>
                <h4 className="font-bold">{currentLanguage === "en" ? "Q&A Points" : "Q&A 포인트"}</h4>
                <p className="text-2xl font-bold">256</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-gray">{currentLanguage === "en" ? "Next Reward at" : "다음 보상"}</span>
              <span className="font-medium">300 pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QATab
