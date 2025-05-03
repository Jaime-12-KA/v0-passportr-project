/**
 * 배포 환경에서 정적 자산 경로를 확인하는 함수
 */
export const getAssetPath = (path: string): string => {
  // 경로가 이미 절대 경로인 경우 그대로 반환
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) {
    return path
  }

  // 경로가 슬래시로 시작하지 않으면 슬래시 추가
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  // 배포 환경에서 basePath가 있는 경우 추가
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  return `${basePath}${normalizedPath}`
}

/**
 * 이미지 파일 확장자 정규화 함수
 * 대소문자 구분 문제를 해결하기 위해 모든 확장자를 소문자로 변환
 */
export const normalizeImagePath = (path: string): string => {
  if (!path) return ""

  // 확장자 추출 및 소문자 변환
  const parts = path.split(".")
  if (parts.length > 1) {
    const ext = parts.pop()?.toLowerCase()
    return [...parts, ext].join(".")
  }

  return path
}

/**
 * 이미지 URL이 유효한지 확인하는 함수
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false

  // 기본적인 URL 형식 검사
  const pattern = /^(https?:\/\/|\/|blob:|data:).+/i
  return pattern.test(url)
}

/**
 * 이미지 로드 실패 시 폴백 이미지를 반환하는 함수
 */
export const getImageWithFallback = (src: string, fallback = "/placeholder.svg"): string => {
  if (!src) return getAssetPath(fallback)
  return getAssetPath(src)
}
