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
import { checkPicoYPlacaStatus } from "../lib/pico-utils"
import { getFavorites, hasFavorite } from "../lib/favorites-utils"


// Datos simulados para la aplicación
const ALL_LEARN_CONTENT = [
  {
    id: 1,
    question: "¿Qué hacer si me detiene la policía de tránsito?",
    answer:
      "Mantén la calma, presenta tus documentos (licencia, SOAT, tarjeta de propiedad), responde con respeto y conoce tus derechos. Si no estás de acuerdo con la infracción, puedes solicitar que se registre tu inconformidad.",
    normativity: "Ley 769 de 2002, Art. 131",
  },
  {
    id: 2,
    question: "¿Puedo grabar durante un procedimiento de tránsito?",
    answer:
      "En general es posible grabar procedimientos en vía pública; sin embargo, respeta indicaciones de seguridad y evita confrontaciones. Consulta siempre fuentes oficiales para casos específicos.",
  },
]

// Default data sets used by the app. Restored minimal versions to avoid runtime errors
const ALL_INFRACTIONS_DATA = [
  { id: 1, code: "C01", description: "Conducir sin licencia de conducción", fine: "$1.296.900", points: 0, immobilization: true },
  { id: 2, code: "C02", description: "Conducir con licencia vencida", fine: "$648.450", points: 0, immobilization: true },
  { id: 3, code: "C14", description: "No usar cinturón de seguridad", fine: "$432.300", points: 0, immobilization: false },
]

const ALL_DOCUMENTS_DATA = [
  { id: "licencia", name: "Licencia de Conducción", dueDate: "2025-06-15", uploaded: false },
  { id: "soat", name: "SOAT", dueDate: "2025-03-20", uploaded: false },
  { id: "propiedad", name: "Tarjeta de Propiedad", dueDate: "2026-01-10", uploaded: false },
]

const ALL_NEWS_ITEMS = [
  { id: 1, title: "Actualización de normas de tránsito", summary: "Resumen breve de cambios en la normativa.", fullContent: "Detalle ampliado de la noticia.", imageUrl: "" },
]

const ALL_QUIZ_QUESTIONS = [
  { id: 1, question: "¿Cuál es la edad mínima para conducir?", options: ["16", "18", "21"], answer: "18" },
  { id: 2, question: "¿Qué documento es obligatorio portar?", options: ["Licencia", "Pasaporte", "Cédula"], answer: "Licencia" },
]

const ALL_GLOSSARY_TERMS = [
  { term: "SOAT", explanation: "Seguro Obligatorio de Accidentes de Tránsito." },
  { term: "Revisión Técnico-Mecánica", explanation: "Inspección periódica de seguridad vehicular." },
]

// Función auxiliar para calcular días restantes
const calculateDaysRemaining = (dueDate) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Lucide React Icons (simulating common app icons)
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

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
  
  const [quizProgress, setQuizProgress] = useState({})

  const [activeScreen, setActiveScreen] = useState("home")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showLoginDropdown, setShowLoginDropdown] = useState(false)
  const loginButtonRef = useRef(null)
  const [showGlobalSearchModal, setShowGlobalSearchModal] = useState(false)
  const [notification, setNotification] = useState({ message: "", visible: false, type: "" })

  // Data states now using local storage
  const [learnContent, setLearnContent] = useState(ALL_LEARN_CONTENT.map((item) => ({ ...item, saved: false })))
  const [infractionsData, setInfractionsData] = useState(
    ALL_INFRACTIONS_DATA.map((item) => ({ ...item, saved: false })),
  )
  const [registeredVehicles, setRegisteredVehicles] = useState([])
  const [newsItems, setNewsItems] = useState(ALL_NEWS_ITEMS.map((item) => ({ ...item, expanded: false, saved: false })))

  // Quiz States
  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentScore, setCurrentScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Pico y Placa States (kept minimal in parent: registeredVehicles)

  // Firestore Initialization & Authentication
  useEffect(() => {
    // Initialize local data from localStorage
    const savedProfile = localStorage.getItem("transit-user-profile")
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }

    const savedVehicles = localStorage.getItem("transit-user-vehicles")
    if (savedVehicles) {
      setRegisteredVehicles(JSON.parse(savedVehicles))
    }

    // Documents are managed by the Documents component and lib/documents-utils.js

    const favs = getFavorites()
    if (favs && favs.length > 0) {
      // Update content with saved status using centralized favorites util
      setLearnContent((prev) => prev.map((item) => ({ ...item, saved: hasFavorite(favs, item.id, "learn") })))
      setInfractionsData((prev) => prev.map((item) => ({ ...item, saved: hasFavorite(favs, item.id, "infractions") })))
      setNewsItems((prev) => prev.map((item) => ({ ...item, saved: hasFavorite(favs, item.id, "news") })))
    }

    const savedQuizProgress = localStorage.getItem("transit-quiz-progress")
    if (savedQuizProgress) {
      setQuizProgress(JSON.parse(savedQuizProgress))
    }
  }, [])

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
  }

  // Document management moved to `components/Documents` and `lib/documents-utils.js`.
  // Parent no longer performs add/delete operations on transit-user-documents.

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

  const handleDocumentUpload = async (id) => {
    const updatedDocuments = documents.map((doc) => (doc.id === id ? { ...doc, uploaded: !doc.uploaded } : doc))
    setDocuments(updatedDocuments)
    saveToLocalStorage("transit-user-documents", updatedDocuments)

    const docToUpdate = documents.find((d) => d.id === id)
    if (docToUpdate) {
      showNotification(
        `Documento ${docToUpdate.name} marcado como ${!docToUpdate.uploaded ? "subido" : "no subido"}.`,
        "info",
      )
    }
  }

  const [glossarySearchTerm, setGlossarySearchTerm] = useState("")
  const filteredGlossaryTerms = ALL_GLOSSARY_TERMS.filter(
    (term) =>
      term.term.toLowerCase().includes(glossarySearchTerm.toLowerCase()) ||
      term.explanation.toLowerCase().includes(glossarySearchTerm.toLowerCase()),
  )

  const [pqrQuestion, setPqrQuestion] = useState("")
  const handlePqrSubmit = async () => {
    if (pqrQuestion.trim() === "") {
      showNotification("Por favor, escribe tu pregunta antes de enviar.", "info")
      return
    }

    // Simulate saving PQR locally
    const pqrData = {
      id: Date.now().toString(),
      question: pqrQuestion,
      timestamp: new Date().toISOString(),
    }

    const existingPqrs = JSON.parse(localStorage.getItem("transit-pqrs") || "[]")
    const updatedPqrs = [...existingPqrs, pqrData]
    saveToLocalStorage("transit-pqrs", updatedPqrs)

    showNotification("¡Gracias! Tu pregunta ha sido enviada.", "success")
    setPqrQuestion("")
  }

  const [globalSearchTerm, setGlobalSearchTerm] = useState("")
  const [globalSearchResults, setGlobalSearchResults] = useState([])

  const performGlobalSearch = (term) => {
    const results = []
    const lowerCaseTerm = term.toLowerCase()

    const searchSources = {
      "Aprende a defenderte": learnContent,
      "Top de Infracciones": infractionsData,
      Noticias: newsItems,
      Glosario: ALL_GLOSSARY_TERMS,
    }

    for (const section in searchSources) {
      searchSources[section].forEach((item) => {
        const itemText = JSON.stringify(item).toLowerCase()
        if (itemText.includes(lowerCaseTerm)) {
          const title = item.title || item.question || item.term || "Resultado de búsqueda"
          let snippet = item.summary || item.answer || item.explanation || ""
          if (snippet.length > 100) {
            snippet = snippet.substring(0, 100) + "..."
          }
          results.push({
            id: item.id || item.term,
            title,
            snippet,
            section,
            type: item.type,
          })
        }
      })
    }
    setGlobalSearchResults(results)
  }

  const handleGlobalSearchChange = (e) => {
    const term = e.target.value
    setGlobalSearchTerm(term)
    if (term.length > 2) {
      performGlobalSearch(term)
    } else {
      setGlobalSearchResults([])
    }
  }

  const handleGlobalSearchResultClick = (result) => {
    // This is a simple navigation, a real app might handle this more robustly
    showNotification(`Navegando a: ${result.section}`, "info")
    setShowGlobalSearchModal(false)
    setGlobalSearchTerm("")
    setGlobalSearchResults([])
    setActiveScreen(result.section.replace(/\s+/g, "-").toLowerCase())
  }

  const handleRegisterVehicle = async () => {
    if (!newVehicleLastTwoDigits || !newVehicleType || !newVehicleCity) {
      showNotification("Por favor, completa todos los campos para registrar el vehículo.", "error")
      return
    }
    if (newVehicleLastTwoDigits.length !== 2 || isNaN(newVehicleLastTwoDigits)) {
      showNotification("Los últimos dos dígitos de la placa deben ser numéricos y tener 2 dígitos.", "error")
      return
    }

    const newVehicle = {
      id: Date.now().toString(),
      lastTwoDigits: newVehicleLastTwoDigits,
      type: newVehicleType,
      city: newVehicleCity,
    }

    const updatedVehicles = [...registeredVehicles, newVehicle]
    setRegisteredVehicles(updatedVehicles)
    saveToLocalStorage("transit-user-vehicles", updatedVehicles)

    showNotification(`Vehículo ${newVehicleLastTwoDigits} (${newVehicleType}) registrado con éxito.`, "success")
    setNewVehicleLastTwoDigits("")
    setNewVehicleType("")
    setNewVehicleCity("")
    setShowRegisterVehicleForm(false)
  }

  const handleForgetVehicle = async (id) => {
    const updatedVehicles = registeredVehicles.filter((vehicle) => vehicle.id !== id)
    setRegisteredVehicles(updatedVehicles)
    saveToLocalStorage("transit-user-vehicles", updatedVehicles)
    showNotification("Vehículo olvidado correctamente.", "info")
  }

  const selectRandomQuizQuestions = useCallback(() => {
    const shuffled = [...ALL_QUIZ_QUESTIONS].sort(() => 0.5 - Math.random())
    const selected20 = shuffled.slice(0, 20).map((q) => ({ ...q, selected: null, correct: null }))
    setQuizQuestions(selected20)
    setCurrentScore(0)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
  }, [])

  useEffect(() => {
    if (activeScreen === "quiz" && quizStarted && quizQuestions.length === 0) {
      selectRandomQuizQuestions()
    }
  }, [activeScreen, quizStarted, quizQuestions.length, selectRandomQuizQuestions])

  const handleQuizAnswer = (questionId, selectedOption) => {
    const updatedQuizQuestions = quizQuestions.map((q) =>
      q.id === questionId ? { ...q, selected: selectedOption, correct: selectedOption === q.answer } : q,
    )
    setQuizQuestions(updatedQuizQuestions)
    const answeredQuestion = updatedQuizQuestions.find((q) => q.id === questionId)
    if (answeredQuestion && answeredQuestion.correct) {
      setCurrentScore((prevScore) => prevScore + 1)
    }
  }

  const resetQuiz = () => {
    selectRandomQuizQuestions()
    setQuizStarted(true)
    setCurrentQuestionIndex(0)
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
      setQuizCompleted(false)
    }
  }

  const getKnowledgeRange = (score) => {
    const totalQuestions = quizQuestions.length
    if (totalQuestions === 0) return "N/A"
    if (score === totalQuestions) {
      return "Experto: ¡Dominas las normas de tránsito!"
    } else if (score >= totalQuestions * 0.8) {
      return "Avanzado: ¡Excelente conocimiento vial!"
    } else if (score >= totalQuestions * 0.5) {
      return "Intermedio: Vas por buen camino, ¡sigue practicando!"
    } else {
      return "Principiante: Es hora de revisar las regulaciones, ¡puedes mejorar!"
    }
  }

  const [regulationsData, setRegulationsData] = useState([
    {
      id: "ley769",
      title: "Ley 769 de 2002 - Código Nacional de Tránsito",
      summary:
        "Establece las normas de comportamiento para conductores, pasajeros, peatones y ciclistas en las vías públicas y privadas abiertas al público.",
      articles: [
        { number: "21", summary: "Obligatoriedad de la licencia de conducción y su presentación." },
        { number: "25", summary: "Uso obligatorio del cinturón de seguridad para todos los ocupantes del vehículo." },
        { number: "55", summary: "Comportamiento de conductores y pasajeros en la vía, incluyendo prohibiciones." },
        { number: "131", summary: "Clasificación de las infracciones de tránsito y sus respectivas sanciones." },
      ],
    },
    {
      id: "res3027",
      title: "Resolución 3027 de 2010 - Manual de Señalización Vial",
      summary:
        "Define las características y el uso de la señalización vial en Colombia para garantizar la seguridad y fluidez del tránsito.",
      articles: [
        {
          number: "5",
          summary:
            "Clasificación general de las señales de tránsito (reglamentarias, preventivas, informativas, transitorias).",
        },
        { number: "10", summary: "Características de las señales reglamentarias (forma, color, significado)." },
        { number: "15", summary: "Características de las señales preventivas (forma, color, significado)." },
      ],
    },
    {
      id: "decreto1079",
      title: "Decreto 1079 de 2015 - Decreto Único Reglamentario del Sector Transporte",
      summary: "Compila y racionaliza las normas de carácter reglamentario que rigen el sector transporte en Colombia.",
      articles: [
        {
          number: "2.3.1.5.1",
          summary: "Regulación sobre la presentación de documentos de tránsito en formato digital.",
        },
        {
          number: "2.3.1.5.2",
          summary: "Disposiciones sobre la revisión técnico-mecánica y de emisiones contaminantes.",
        },
      ],
    },
  ])
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
    { name: "Buscar", icon: SearchIcon, screen: "global-search" },
    { name: "Docs", icon: FileTextIcon, screen: "documents" },
    { name: "Inicio", icon: HomeIcon, screen: "home" },
    { name: "Favs", icon: StarIcon, screen: "favorites" },
    { name: "Asesoría", icon: LightbulbIcon, screen: "ai-assist" },
  ]

  // Navigation handler that requires authentication for routes different than 'home'
  const handleNavClick = (screen) => {
    // Allow global-search to open the modal without forcing login
    if (screen !== 'home' && screen !== 'global-search' && !loggedIn) {
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

    if (screen === 'global-search') {
      setShowGlobalSearchModal(true)
    } else {
      setActiveScreen(screen)
    }
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
      {showGlobalSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative transform transition-all duration-300 scale-100 opacity-100 mt-10">
            <button
              onClick={() => {
                setShowGlobalSearchModal(false)
                setGlobalSearchTerm("")
                setGlobalSearchResults([])
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close global search"
            >
              <XIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Búsqueda Rápida</h2>
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Buscar en toda la app..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                value={globalSearchTerm}
                onChange={handleGlobalSearchChange}
                aria-label="Global search input field"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-3">
              {globalSearchTerm.length > 2 && globalSearchResults.length === 0 ? (
                <p className="text-gray-600 text-center">No se encontraron resultados para "{globalSearchTerm}".</p>
              ) : (
                globalSearchResults.map((result, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => handleGlobalSearchResultClick(result)}
                    aria-label={`Search result: ${result.title} in ${result.section}`}
                  >
                    <h4 className="font-semibold text-gray-800">{result.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Sección: <span className="font-medium">{result.section}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{result.snippet}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
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
