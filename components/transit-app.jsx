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
import Terms from './terms'
import HelpContact from './help-contact'
import * as Icons from './icons'
import Toast from './toast'

// Auth handled via Auth0; local login modal removed

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
  const [loadingProfileFromApi, setLoadingProfileFromApi] = useState(false)
  
  // quiz progress moved to Quiz component

  const [activeScreen, setActiveScreen] = useState("home")
  const [showLoginDropdown, setShowLoginDropdown] = useState(false)
  const loginButtonRef = useRef(null)
  const [notification, setNotification] = useState({ message: "", visible: false, type: "" })

  // Data for learn/infractions/news/vehicles/quiz are loaded by each feature component

  // Quiz state is managed inside the Quiz component

  // Pico y Placa States (kept minimal in parent: registeredVehicles)

  // Firestore Initialization & Authentication
  // No local persistence: always load authoritative profile from backend when authenticated
  useEffect(() => {
    // Other domain data (vehicles, learn content, infractions, news, quiz bank)
    // are loaded and managed by their respective components to avoid prop-drilling.
  }, [])

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, visible: true, type })
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }, [])

  // When Auth0 user is present fetch authoritative profile from backend (/api/profile)
  useEffect(() => {
    if (!user) return
    let mounted = true
    const controller = new AbortController()
    const fetchProfile = async () => {
      setLoadingProfileFromApi(true)
      try {
        const res = await fetch('/api/profile', { signal: controller.signal })
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const json = await res.json()
        const profile = json?.data || json
        if (mounted) {
          setUserProfile((prev) => ({
            name: profile.name ?? prev.name,
            email: profile.email ?? prev.email,
            phone: profile.phone ?? prev.phone,
            vehicles: profile.vehicles ?? prev.vehicles ?? []
          }))
        }
      } catch (e) {
        if (showNotification) showNotification('No se pudo obtener el perfil desde el servidor', 'warning')
      } finally {
        if (mounted) setLoadingProfileFromApi(false)
      }
    }
    fetchProfile()
    return () => { mounted = false; controller.abort() }
  }, [user, showNotification])

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
                <Icons.BookOpenIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Conocimiento</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-orange-500 to-orange-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // "pico-y-placa"
              >
                <Icons.CalendarCheckIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Pico y Placa</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-red-500 to-red-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // no screen yet
              >
                <Icons.ReceiptTextIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Consulta Multas</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-purple-500 to-purple-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // "news"
              >
                <Icons.NewspaperIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Noticias</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-teal-500 to-teal-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // "quiz"
              >
                <Icons.ListChecksIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Quiz de Tránsito</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // "regulations-main"
              >
                <Icons.GavelIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Normatividad</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-cyan-500 to-cyan-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // "glossary"
              >
                <Icons.BookIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Glosario</span>
                <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Próximamente</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-pink-500 to-pink-700 text-white"
                onClick={() => setActiveScreen("under-construction")} // "pqr"
              >
                <Icons.MessageSquareTextIcon className="w-8 h-8 mb-2" />
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
            showNotification={showNotification}
          />
        )
      case "terms":
        return (
          <Terms setActiveScreen={setActiveScreen} />
        )
      case "help-contact":
        return (
          <HelpContact setActiveScreen={setActiveScreen} />
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
  { name: "Perfil", icon: Icons.UserIcon, screen: "my-profile" },
    { name: "Docs", icon: Icons.FileTextIcon, screen: "documents" },
    { name: "Inicio", icon: Icons.HomeIcon, screen: "home" },
    { name: "Favs", icon: Icons.StarIcon, screen: "favorites" },
    { name: "Asesoría", icon: Icons.LightbulbIcon, screen: "ai-assist" },
  ]

  // Navigation handler that requires authentication for routes different than 'home'
  const handleNavClick = (screen) => {
    if (screen !== 'home' && !loggedIn) {
      showNotification('Debes iniciar sesión para acceder a esta sección', 'info')
      // Redirect to Auth0 login page to begin authentication
      try {
        if (typeof window !== 'undefined') window.location.href = '/api/auth/login'
      } catch (e) {
        // ignore
      }
      return
    }

    setActiveScreen(screen)
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col p-4">
      <div
  className="relative w-full max-w-md md:max-w-2xl lg:max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] mx-auto"
      >
        <div
          className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 md:px-6 flex items-center justify-between rounded-t-xl shadow-md z-50 w-full max-w-md md:max-w-2xl lg:max-w-3xl"
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
                <Icons.UserIcon className="w-5 h-5" />
                <span>Mi cuenta</span>
              </button>
            ) : (
              <a
                ref={loginButtonRef}
                href="/api/auth/login"
                className="flex items-center space-x-2 px-3 py-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 text-sm font-semibold shadow-md"
                aria-label="Iniciar sesión"
              >
                <Icons.LogInIcon className="w-5 h-5" />
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
                      <Icons.UserIcon className="w-4 h-4" />
                      <span>Mi perfil</span>
                    </button>
                    <button
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setActiveScreen('documents')
                        setShowLoginDropdown(false)
                      }}
                    >
                      <Icons.FileTextIcon className="w-4 h-4" />
                      <span>Mis documentos</span>
                    </button>
                    <a
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setActiveScreen('help-contact')
                        setShowLoginDropdown(false)
                      }}
                    >
                      <Icons.InfoIcon className="w-4 h-4" />
                      <span>Ayuda/Contacto</span>
                    </a>
                    <button
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setActiveScreen('terms')
                        setShowLoginDropdown(false)
                      }}
                    >
                      <Icons.FileWarningIcon className="w-4 h-4" />
                      <span>Términos y privacidad</span>
                    </button>
                    <a
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        showNotification("Compartir app (simulado)", "info")
                        setShowLoginDropdown(false)
                      }}
                    >
                      <Icons.Share2Icon className="w-4 h-4" />
                      <span>Compartir app</span>
                    </a>
                    <div className="border-t border-gray-200 my-1"></div>
                    <a
                      href="/api/auth/logout"
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => setShowLoginDropdown(false)}
                    >
                      <Icons.LogInIcon className="w-4 h-4 transform rotate-180" />
                      <span>Cerrar Sesión</span>
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        // redirect to Auth0 login
                        try { if (typeof window !== 'undefined') window.location.href = '/api/auth/login' } catch (e) {}
                        setShowLoginDropdown(false)
                      }}
                    >
                      <Icons.UserIcon className="w-4 h-4" />
                      <span>Iniciar Sesión</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        // Navigate to Help/Contact view (unauthenticated users may still view contact info)
                        setActiveScreen('help-contact')
                        setShowLoginDropdown(false)
                      }}
                    >
                      <Icons.InfoIcon className="w-4 h-4" />
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
                      <Icons.FileWarningIcon className="w-4 h-4" />
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
                      <Icons.Share2Icon className="w-4 h-4" />
                      <span>Compartir app</span>
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">Transit IA</h1>
          <div className="flex items-center">
            <button
              className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 shadow-md"
              onClick={() => {
                if (!loggedIn) {
                  // require login to view notifications
                  showNotification('Debes iniciar sesión para ver notificaciones', 'info')
                  // redirect to Auth0 login
                  try { if (typeof window !== 'undefined') window.location.href = '/api/auth/login' } catch (e) {}
                  return
                }
                setActiveScreen("notifications")
              }}
              aria-label="View notifications"
            >
              <Icons.BellIcon className="w-5 h-5" />
            </button>
          </div>
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
          className="fixed left-1/2 transform -translate-x-1/2 bottom-0 bg-white border-t border-gray-200 rounded-t-xl shadow-inner z-50 h-20 flex items-center justify-around px-2 w-full max-w-md md:max-w-2xl lg:max-w-3xl"
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
      {/* local login modal removed; Auth0 handles auth */}
      {/* Global search removed */}
      <Toast
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onRequestClose={() => setNotification({ message: '', visible: false, type: '' })}
        onHidden={() => { /* no-op */ }}
      />
    </div>
  )
}

export default App
