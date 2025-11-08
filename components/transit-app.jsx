"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useUser } from '@auth0/nextjs-auth0/client'
import MyProfile from './my-profile'
import Documents from './documents'
import Quiz from "./quiz"
import RegulationsMain from "./regulations-main"
import RegulationDetail from "./regulation-detail"
import GlossaryMain from "./glossary-main"
import PqrMain from "./pqr-main"
import AiAssist from "./ai-assist"
import Notifications from "./notifications"
import News from "./news"
import PicoYPlaca from "./pico-y-placa"
import UnderConstruction from "./under-construction"
// data-loading responsibilities moved to individual components


// Simulated data removed — app should obtain content from persistent storage or APIs.
// Initial states for learn content, infractions, news and quiz questions are empty arrays.

// SVGs are included directly to simulate 'lucide-react' imports.
const BookOpenIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
)

const CalendarCheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const ReceiptTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5l-8-8-8 8V7a2 2 0 012-2h12a2 2 0 012 2v11z"
    />
  </svg>
)

const NewspaperIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
    />
  </svg>
)

const ListChecksIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  </svg>
)

const GavelIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
    />
  </svg>
)

const BookIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
)

const MessageSquareTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
)

const FileTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const HomeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

const StarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

const LightbulbIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
)

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const LogInIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  </svg>
)

const BellIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-5 5v-5zM10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"
    />
  </svg>
)

const InfoIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const FileWarningIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
)

const Share2Icon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
    />
  </svg>
)

const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const LoginModal = ({ onClose, showNotification, setLoggedIn }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (email && password) {
      setLoggedIn(true)
      showNotification("¡Bienvenido a Transit IA!", "success")
      onClose()
    } else {
      showNotification("Por favor completa todos los campos", "error")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Iniciar Sesión</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  const [userId, setUserId] = useState("local-user-123")
  const [loggedIn, setLoggedIn] = useState(false)
  const { user, error: userError, isLoading } = useUser()

  useEffect(() => {
    setLoggedIn(Boolean(user))
    if (user && user.sub) setUserId(user.sub)
  }, [user])
  const [userProfile, setUserProfile] = useState({
    name: "Usuario Demo",
    email: "demo@transitia.com",
    phone: "300 123 4567",
    vehicles: [],
  })
  
  // quiz progress moved to Quiz component

  const [activeScreen, setActiveScreen] = useState("home")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showLoginDropdown, setShowLoginDropdown] = useState(false)
  const loginButtonRef = useRef(null)
  const [notification, setNotification] = useState({ message: "", visible: false, type: "" })

  // Data for learn/infractions/news/vehicles/quiz are loaded by each feature component

  // Quiz state is managed inside the Quiz component

  // Pico y Placa States (kept minimal in parent: registeredVehicles)

  // Firestore Initialization & Authentication
  useEffect(() => {
    // Initialize user profile from localStorage
    const savedProfile = localStorage.getItem("transit-user-profile")
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }

    // Other domain data (vehicles, learn content, infractions, news, quiz bank)
    // are loaded and managed by their respective components to avoid prop-drilling.
  }, [])

  // If the app is opened with a ?screen=... query param or hash, navigate to that screen
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const qScreen = params.get('screen')
        const hashScreen = window.location.hash ? window.location.hash.replace(/^#/, '') : null
        const target = qScreen || hashScreen
        if (target) {
          setActiveScreen(target)
          // remove the screen param from URL to keep it clean
          const url = new URL(window.location.href)
          url.searchParams.delete('screen')
          // keep hash if present
          history.replaceState(null, '', url.pathname + (window.location.hash || ''))
        }
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, visible: true, type })
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }, [])

  // Global search removed — related state and helpers cleaned up

  // Quiz selection logic moved to Quiz component

  const [selectedRegulation, setSelectedRegulation] = useState(null) 

  const renderContent = () => {
    switch (activeScreen) {
      case "home":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Tu asesor inteligente de tránsito</h2>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-blue-500 to-blue-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // no screen yet
                role="button"
                aria-label="Conocimiento - Próximamente"
                title="Conocimiento - Próximamente"
              >
                <BookOpenIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Conocimiento</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-orange-500 to-orange-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // "pico-y-placa"
              >
                <CalendarCheckIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Pico y Placa</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-red-500 to-red-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // no screen yet
              >
                <ReceiptTextIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Consulta Multas</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-purple-500 to-purple-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // "news"
              >
                <NewspaperIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Noticias</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-teal-500 to-teal-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // "quiz"
              >
                <ListChecksIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Quiz de Tránsito</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // "regulations-main"
              >
                <GavelIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Normatividad</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-cyan-500 to-cyan-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // "glossary"
              >
                <BookIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Glosario</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-pink-500 to-pink-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // "pqr"
              >
                <MessageSquareTextIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">PQR</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
            </div>
          </div>
        )
        
      case "under-construction":
        return (
          <UnderConstruction setActiveScreen={setActiveScreen} showNotification={showNotification} />
        )
      case "pico-y-placa":
        return (
          <PicoYPlaca setActiveScreen={setActiveScreen} />
        )
      case "news":
        return (
          <News setActiveScreen={setActiveScreen} />
        )
      case "my-profile":
        return (
          <MyProfile
            setActiveScreen={setActiveScreen}
            userId={userId}
            showNotification={showNotification}
          />
        )
      case "quiz":
        return (
          <Quiz setActiveScreen={setActiveScreen} />
        )
      case "regulations-main":
        return (
          <RegulationsMain
            setActiveScreen={setActiveScreen}
            setSelectedRegulation={setSelectedRegulation}
          />
        )
      case "regulation-detail":
        return (
          <RegulationDetail
            selectedRegulation={selectedRegulation}
            setActiveScreen={setActiveScreen}
            setSelectedRegulation={setSelectedRegulation}
          />
        )
      case "glossary":
        return (
          <GlossaryMain
            setActiveScreen={setActiveScreen}
          />
        )
      case "pqr":
        // Render autonomous PQR
        return (
          <PqrMain setActiveScreen={setActiveScreen} showNotification={showNotification} />
        )
      case "ai-assist":
        // Autonomous AiAssist now manages its own chat state and persistence via lib/ai-utils
        return (
          <AiAssist
            setActiveScreen={setActiveScreen}
          />
        )
      case "notifications":
        // Notifications is now autonomous: it reads vehicles/documents from localStorage and uses pico-utils
        return (
          <Notifications setActiveScreen={setActiveScreen} />
        )
      case "documents":
        // Lazy render external Documents component
        return (
          <Documents
            setActiveScreen={setActiveScreen}
          />
        )
      default:
        return null
    }
  }

  const navItems = [
    { name: "Perfil", icon: UserIcon, screen: "my-profile" },
    { name: "Docs", icon: FileTextIcon, screen: "documents" },
    { name: "Inicio", icon: HomeIcon, screen: "home" },
    { name: "Favs", icon: StarIcon, screen: "favorites" },
    { name: "Asesoría", icon: LightbulbIcon, screen: "ai-assist" },
  ]

  // Navigation handler that requires authentication for routes different than 'home'
  const handleNavClick = (screen) => {
    if (screen !== 'home' && !loggedIn) {
      showNotification('Debes iniciar sesión para acceder a esta sección', 'info')
      // Redirect to Auth0 login page to begin authentication
      try {
        if (typeof window !== 'undefined') window.location.href = '/api/auth/login'
      } catch (e) {
        // fallback: open local login modal
        setShowLoginModal(true)
      }
      return
    }

    setActiveScreen(screen)
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col p-4">
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]"
      >
        <div
          className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between rounded-t-xl shadow-md z-50 w-full max-w-md"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="relative">
            {loggedIn ? (
              <button
                ref={loginButtonRef}
                onClick={() => setShowLoginDropdown((s) => !s)}
                className="flex items-center space-x-2 px-3 py-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 text-sm font-semibold shadow-md"
                aria-label="Abrir menú de usuario"
              >
                <UserIcon className="w-5 h-5" />
                <span>Mi cuenta</span>
              </button>
            ) : (
              <a
                ref={loginButtonRef}
                href="/api/auth/login"
                className="flex items-center space-x-2 px-3 py-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 text-sm font-semibold shadow-md"
                aria-label="Iniciar sesión"
              >
                <LogInIcon className="w-5 h-5" />
                <span>Login</span>
              </a>
            )}
            {showLoginDropdown && (
              <div
                className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                onMouseLeave={() => setShowLoginDropdown(false)}
              >
                {loggedIn ? (
                  <>
                    <button
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setActiveScreen('my-profile')
                        setShowLoginDropdown(false)
                      }}
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Mi perfil</span>
                    </button>
                    <button
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setActiveScreen('documents')
                        setShowLoginDropdown(false)
                      }}
                    >
                      <FileTextIcon className="w-4 h-4" />
                      <span>Mis documentos</span>
                    </button>
                    <a
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        showNotification("Navegar a Ayuda/Contacto (simulado)", "info")
                        setShowLoginDropdown(false)
                      }}
                    >
                      <InfoIcon className="w-4 h-4" />
                      <span>Ayuda/Contacto</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        showNotification("Navegar a Términos y privacidad (simulado)", "info")
                        setShowLoginDropdown(false)
                      }}
                    >
                      <FileWarningIcon className="w-4 h-4" />
                      <span>Términos y privacidad</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        showNotification("Compartir app (simulado)", "info")
                        setShowLoginDropdown(false)
                      }}
                    >
                      <Share2Icon className="w-4 h-4" />
                      <span>Compartir app</span>
                    </a>
                    <div className="border-t border-gray-200 my-1"></div>
                    <a
                      href="/api/auth/logout"
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => setShowLoginDropdown(false)}
                    >
                      <LogInIcon className="w-4 h-4 transform rotate-180" />
                      <span>Cerrar Sesión</span>
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setShowLoginModal(true)
                        setShowLoginDropdown(false)
                      }}
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Iniciar Sesión</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        showNotification("Navegar a Ayuda/Contacto (simulado)", "info")
                        setShowLoginDropdown(false)
                      }}
                    >
                      <InfoIcon className="w-4 h-4" />
                      <span>Ayuda/Contacto</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        showNotification("Navegar a Términos y privacidad (simulado)", "info")
                        setShowLoginDropdown(false)
                      }}
                    >
                      <FileWarningIcon className="w-4 h-4" />
                      <span>Términos y privacidad</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        showNotification("Compartir app (simulado)", "info")
                        setShowLoginDropdown(false)
                      }}
                    >
                      <Share2Icon className="w-4 h-4" />
                      <span>Compartir app</span>
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">Transit IA</h1>
          <button
            className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 shadow-md"
            onClick={() => setActiveScreen("notifications")}
            aria-label="View notifications"
          >
            <BellIcon className="w-5 h-5" />
          </button>
        </div>
        <div
          className="flex-grow overflow-y-auto"
          style={{
            paddingTop: 'calc(3.5rem + env(safe-area-inset-top))',
            paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))',
          }}
        >
          {renderContent()}
        </div>

        <nav
          className="fixed left-1/2 transform -translate-x-1/2 bottom-0 bg-white border-t border-gray-200 rounded-t-xl shadow-inner z-50 h-20 flex items-center justify-around px-2 w-full max-w-md"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)', WebkitTapHighlightColor: 'transparent' }}
        >
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-2
                          rounded-xl transition-all duration-300 ease-in-out
                          ${
                            activeScreen === item.screen
                              ? "bg-blue-500 text-white transform -translate-y-2 shadow-lg"
                              : "bg-white text-gray-600 hover:bg-gray-100"
                          }
                          focus:outline-none focus:ring-2 focus:ring-blue-300`}
              onClick={() => handleNavClick(item.screen)}
              aria-label={`Go to ${item.name}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          showNotification={showNotification}
          setLoggedIn={setLoggedIn}
        />
      )}
      {/* Global search removed */}
      {notification.visible && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-lg text-white z-50 transition-all duration-300 ${notification.type === "success" ? "bg-green-500" : "bg-blue-500"}`}
        >
          {notification.message}
        </div>
      )}
    </div>
  )
}

export default App
