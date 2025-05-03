import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth"
import { getAnalytics as getFirebaseAnalytics } from "firebase/analytics"

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCqOPbVJjqQot0DV1MpWUdxyQCmHaeuMxw",
  authDomain: "passportr-c8a37.firebaseapp.com",
  projectId: "passportr-c8a37",
  storageBucket: "passportr-c8a37.firebasestorage.app",
  messagingSenderId: "943425638426",
  appId: "1:943425638426:web:0ca4d9098dd755051641a3",
  measurementId: "G-V3NLGZP27E",
}

// Firebase 앱 인스턴스를 위한 싱글톤 패턴
let firebaseApp: FirebaseApp | undefined
let analyticsInstance: any | undefined

// Firebase 초기화 함수
export const initFirebase = () => {
  try {
    // 이미 초기화된 앱이 있는지 확인
    if (!firebaseApp && getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig)
      console.log("Firebase initialized successfully")

      // Analytics는 브라우저 환경에서만 초기화
      if (typeof window !== "undefined") {
        analyticsInstance = getFirebaseAnalytics(firebaseApp)
        console.log("Firebase Analytics initialized")
      }
    } else if (!firebaseApp) {
      firebaseApp = getApps()[0]
    }

    return firebaseApp
  } catch (error) {
    console.error("Error initializing Firebase:", error)
    // 오류 발생 시 undefined 반환하여 우아한 폴백 허용
    return undefined
  }
}

// Firebase 인증 인스턴스 가져오기
export const getFirebaseAuth = () => {
  const app = initFirebase()
  if (!app) {
    console.error("Firebase app not initialized. Cannot get auth instance.")
    // 앱이 크래시되지 않도록 모의 인증 객체 반환
    return {
      onAuthStateChanged: () => () => {},
      signOut: async () => {},
      currentUser: null,
    } as any
  }
  return getAuth(app)
}

// 인증 상태 변경 ��독
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  try {
    const auth = getFirebaseAuth()
    return onAuthStateChanged(auth, callback)
  } catch (error) {
    console.error("Error subscribing to auth changes:", error)
    // 작동하지 않는 구독 취소 함수 반환
    return () => {}
  }
}

// 로그아웃
export const signOut = async () => {
  try {
    const auth = getFirebaseAuth()
    return firebaseSignOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
  }
}

// 사용자 로그인 상태 확인
export const isUserLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem("isLoggedIn") === "true"
  } catch (error) {
    console.error("Error checking login status:", error)
    return false
  }
}

// Analytics 인스턴스 가져오기
export const getAnalytics = () => {
  return analyticsInstance
}
