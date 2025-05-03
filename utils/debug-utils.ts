/**
 * 이미지 경로 디버깅 유틸리티
 * 모든 이미지 경로를 콘솔에 출력하여 디버깅을 돕습니다.
 */
export const debugImagePaths = (paths: string[]) => {
  console.group("Image Path Debugging")
  paths.forEach((path, index) => {
    console.log(`Image ${index + 1}: ${path}`)

    // 이미지 존재 여부 확인 (클라이언트 사이드에서만 작동)
    if (typeof window !== "undefined") {
      const img = new Image()
      img.onload = () => console.log(`✅ Image ${index + 1} loaded successfully: ${path}`)
      img.onerror = () => console.error(`❌ Image ${index + 1} failed to load: ${path}`)
      img.src = path
    }
  })
  console.groupEnd()
}

/**
 * 현재 환경 정보 출력
 */
export const logEnvironmentInfo = () => {
  console.group("Environment Info")
  console.log(`Base Path: ${process.env.NEXT_PUBLIC_BASE_PATH || "(not set)"}`)
  console.log(`Window Location: ${typeof window !== "undefined" ? window.location.href : "(SSR)"}`)
  console.log(`User Agent: ${typeof navigator !== "undefined" ? navigator.userAgent : "(SSR)"}`)
  console.groupEnd()
}
