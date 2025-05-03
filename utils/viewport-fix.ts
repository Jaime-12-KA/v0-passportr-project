// 모바일 브라우저에서 뷰포트 높이 문제를 해결하기 위한 유틸리티

export function setupViewportHeightFix() {
  // 앱 높이 변수 설정 함수
  const updateViewportHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
    document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`)
  }

  // 초기 설정
  updateViewportHeight()

  // 이벤트 리스너 추가
  window.addEventListener("resize", updateViewportHeight)
  window.addEventListener("orientationchange", updateViewportHeight)

  // iOS Safari에서 스크롤 시 주소창 높이 변화에 대응
  window.addEventListener("scroll", updateViewportHeight)

  // 페이지 로드 완료 후 다시 한번 실행
  window.addEventListener("load", updateViewportHeight)

  // 100ms 간격으로 주기적으로 업데이트 (iOS Safari에서 더 안정적인 동작을 위해)
  setInterval(updateViewportHeight, 100)
}
