"use client"

import { useState, useEffect, useRef, useCallback } from "react"

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
      "Sí, tienes derecho a grabar el procedimiento siempre que no interfiera con la labor del agente. Es recomendable informar que estás grabando para transparencia del proceso.",
    normativity: "Constitución Política, Art. 15 - Derecho a la intimidad",
  },
  {
    id: 3,
    question: "¿Qué documentos debo portar siempre?",
    answer:
      "Licencia de conducción vigente, SOAT vigente, tarjeta de propiedad del vehículo y revisión técnico-mecánica vigente. Todos deben estar en formato físico o digital válido.",
    normativity: "Ley 769 de 2002, Art. 21, 25",
  },
]

const ALL_INFRACTIONS_DATA = [
  {
    id: 1,
    code: "C01",
    description: "Conducir sin licencia de conducción",
    fine: "$1.296.900",
    points: 0,
    immobilization: true,
  },
  {
    id: 2,
    code: "C02",
    description: "Conducir con licencia vencida",
    fine: "$648.450",
    points: 0,
    immobilization: true,
  },
  {
    id: 3,
    code: "C14",
    description: "No usar cinturón de seguridad",
    fine: "$432.300",
    points: 0,
    immobilization: false,
  },
]

const ALL_DOCUMENTS_DATA = [
  {
    id: "licencia",
    name: "Licencia de Conducción",
    dueDate: "2025-06-15",
    uploaded: false,
  },
  {
    id: "soat",
    name: "SOAT",
    dueDate: "2025-03-20",
    uploaded: false,
    insurerPhone: "01-8000-123456",
  },
  {
    id: "propiedad",
    name: "Tarjeta de Propiedad",
    dueDate: "2026-01-10",
    uploaded: false,
  },
  {
    id: "tecnomecanica",
    name: "Revisión Técnico-mecánica",
    dueDate: "2025-04-30",
    uploaded: false,
  },
]

const ALL_NEWS_ITEMS = [
  {
    id: 1,
    title: "Nuevas medidas de Pico y Placa en Bogotá",
    summary: "A partir del próximo mes, se implementarán nuevas restricciones vehiculares en la capital.",
    fullContent:
      "La Secretaría de Movilidad de Bogotá anunció cambios en las medidas de Pico y Placa que entrarán en vigencia el próximo mes. Las nuevas restricciones buscan mejorar la calidad del aire y reducir la congestión vehicular en las principales vías de la ciudad.",
    imageUrl: "/traffic-bogota-city.jpg",
  },
  {
    id: 2,
    title: "Campaña de seguridad vial en colegios",
    summary: "Se inicia una nueva campaña educativa sobre normas de tránsito dirigida a estudiantes.",
    fullContent:
      "El Ministerio de Transporte, en alianza con instituciones educativas, lanza una campaña nacional de seguridad vial dirigida a estudiantes de primaria y secundaria. La iniciativa incluye talleres prácticos y material didáctico sobre normas de tránsito.",
    imageUrl: "/school-traffic-safety-campaign.jpg",
  },
]

const ALL_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "¿Cuál es la velocidad máxima permitida en zona urbana?",
    options: ["30 km/h", "50 km/h", "60 km/h", "80 km/h"],
    answer: "50 km/h",
    imageUrl: null,
  },
  {
    id: 2,
    question: "¿Qué significa una señal de tránsito de color rojo?",
    options: ["Precaución", "Prohibición", "Información", "Prevención"],
    answer: "Prohibición",
    imageUrl: null,
  },
  {
    id: 3,
    question: "¿Es obligatorio el uso del cinturón de seguridad?",
    options: ["Solo en carretera", "Solo en ciudad", "Siempre", "Solo de noche"],
    answer: "Siempre",
    imageUrl: null,
  },
]

const ALL_GLOSSARY_TERMS = [
  {
    term: "SOAT",
    explanation:
      "Seguro Obligatorio de Accidentes de Tránsito. Seguro obligatorio que cubre gastos médicos en caso de accidentes de tránsito.",
  },
  {
    term: "Pico y Placa",
    explanation:
      "Medida de restricción vehicular basada en el último dígito de la placa, implementada para reducir la congestión y contaminación.",
  },
  {
    term: "Revisión Técnico-mecánica",
    explanation: "Inspección obligatoria que verifica el estado mecánico y de emisiones de los vehículos.",
  },
]

const VEHICLE_TYPES = ["Carro", "Moto", "Taxi", "Bus", "Camión"]

const COLOMBIAN_CITIES_WITH_PICO_Y_PLACA = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Manizales",
  "Ibagué",
  "Villavicencio",
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

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const MicIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
    />
  </svg>
)

// Define data for dropdowns

// Helper to calculate days remaining until a due date.

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

// Full bank of 100 quiz questions

// Glossary Terms Data (30 terms)

const App = () => {
  const [userId, setUserId] = useState("local-user-123")
  const [loggedIn, setLoggedIn] = useState(true)
  const [userProfile, setUserProfile] = useState({
    name: "Usuario Demo",
    email: "demo@transitia.com",
    phone: "300 123 4567",
    vehicles: [],
  })
  const [userVehicles, setUserVehicles] = useState([])
  const [userDocuments, setUserDocuments] = useState([])
  const [favoriteNews, setFavoriteNews] = useState([])
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
  const [documents, setDocuments] = useState(ALL_DOCUMENTS_DATA)
  const [registeredVehicles, setRegisteredVehicles] = useState([])
  const [favoriteItems, setFavoriteItems] = useState([])
  const [newsItems, setNewsItems] = useState(ALL_NEWS_ITEMS.map((item) => ({ ...item, expanded: false, saved: false })))

  // Quiz States
  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentScore, setCurrentScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Learn & Infractions Expanded States (local to component)
  const [learnExpandedState, setLearnExpandedState] = useState({})
  const [infractionsExpandedState, setInfractionsExpandedState] = useState({})
  const [newsExpandedState, setNewsExpandedState] = useState({})

  // Pico y Placa States
  const [picoYPlacaPlateDomicile, setPicoYPlacaPlateDomicile] = useState("")
  const [picoYPlacaVehicleTypeDomicile, setPicoYPlacaVehicleTypeDomicile] = useState("")
  const [picoYPlacaCityDomicile, setPicoYPlacaCityDomicile] = useState("Bogotá")
  const [picoYPlacaPlateOther, setPicoYPlacaPlateOther] = useState("")
  const [picoYPlacaVehicleTypeOther, setPicoYPlacaVehicleTypeOther] = useState("")
  const [picoYPlacaCityOther, setPicoYPlacaCityOther] = useState("")
  const [showRegisterVehicleForm, setShowRegisterVehicleForm] = useState(false)

  const [newVehicleLastTwoDigits, setNewVehicleLastTwoDigits] = useState("")
  const [newVehicleType, setNewVehicleType] = useState("")
  const [newVehicleCity, setNewVehicleCity] = useState("")

  // Firestore Initialization & Authentication
  useEffect(() => {
    // Initialize local data from localStorage
    const savedProfile = localStorage.getItem("transit-user-profile")
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }

    const savedVehicles = localStorage.getItem("transit-user-vehicles")
    if (savedVehicles) {
      setUserVehicles(JSON.parse(savedVehicles))
      setRegisteredVehicles(JSON.parse(savedVehicles))
    }

    const savedDocuments = localStorage.getItem("transit-user-documents")
    if (savedDocuments) {
      setUserDocuments(JSON.parse(savedDocuments))
      setDocuments(JSON.parse(savedDocuments))
    } else {
      // Initialize with default documents if none exist
      setDocuments(ALL_DOCUMENTS_DATA)
      saveToLocalStorage("transit-user-documents", ALL_DOCUMENTS_DATA)
    }

    const savedFavorites = localStorage.getItem("transit-favorites")
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites)
      setFavoriteNews(favorites)

      // Update content with saved status
      setLearnContent((prev) =>
        prev.map((item) => ({
          ...item,
          saved: favorites.some((fav) => fav.originalId === item.id && fav.type === "learn"),
        })),
      )

      setInfractionsData((prev) =>
        prev.map((item) => ({
          ...item,
          saved: favorites.some((fav) => fav.originalId === item.id && fav.type === "infractions"),
        })),
      )

      setNewsItems((prev) =>
        prev.map((item) => ({
          ...item,
          saved: favorites.some((fav) => fav.originalId === item.id && fav.type === "news"),
        })),
      )

      setFavoriteItems(favorites)
    }

    const savedQuizProgress = localStorage.getItem("transit-quiz-progress")
    if (savedQuizProgress) {
      setQuizProgress(JSON.parse(savedQuizProgress))
    }
  }, [])

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
  }

  const addVehicle = async (vehicleData) => {
    const newVehicle = {
      id: Date.now().toString(),
      ...vehicleData,
      createdAt: new Date().toISOString(),
    }
    const updatedVehicles = [...userVehicles, newVehicle]
    setUserVehicles(updatedVehicles)
    saveToLocalStorage("transit-user-vehicles", updatedVehicles)
  }

  const updateVehicle = async (vehicleId, updates) => {
    const updatedVehicles = userVehicles.map((vehicle) =>
      vehicle.id === vehicleId ? { ...vehicle, ...updates } : vehicle,
    )
    setUserVehicles(updatedVehicles)
    saveToLocalStorage("transit-user-vehicles", updatedVehicles)
  }

  const deleteVehicle = async (vehicleId) => {
    const updatedVehicles = userVehicles.filter((vehicle) => vehicle.id !== vehicleId)
    setUserVehicles(updatedVehicles)
    saveToLocalStorage("transit-user-vehicles", updatedVehicles)
  }

  const addDocument = async (documentData) => {
    const newDocument = {
      id: Date.now().toString(),
      ...documentData,
      createdAt: new Date().toISOString(),
    }
    const updatedDocuments = [...userDocuments, newDocument]
    setUserDocuments(updatedDocuments)
    saveToLocalStorage("transit-user-documents", updatedDocuments)
  }

  const updateDocument = async (documentId, updates) => {
    const updatedDocuments = userDocuments.map((doc) => (doc.id === documentId ? { ...doc, ...updates } : doc))
    setUserDocuments(updatedDocuments)
    saveToLocalStorage("transit-user-documents", updatedDocuments)
  }

  const deleteDocument = async (documentId) => {
    const updatedDocuments = userDocuments.filter((doc) => doc.id !== documentId)
    setUserDocuments(updatedDocuments)
    saveToLocalStorage("transit-user-documents", updatedDocuments)
  }

  const updateProfile = async (updates) => {
    const updatedProfile = { ...userProfile, ...updates }
    setUserProfile(updatedProfile)
    saveToLocalStorage("transit-user-profile", updatedProfile)
  }

  const toggleFavoriteNews = (newsId) => {
    const updatedFavorites = favoriteNews.includes(newsId)
      ? favoriteNews.filter((id) => id !== newsId)
      : [...favoriteNews, newsId]
    setFavoriteNews(updatedFavorites)
    saveToLocalStorage("transit-favorites", updatedFavorites)
  }

  const saveQuizProgress = (progress) => {
    setQuizProgress(progress)
    saveToLocalStorage("transit-quiz-progress", progress)
  }

  useEffect(() => {
    try {
      // No Firebase initialization needed
    } catch (e) {
      console.error("Firebase Initialization Error:", e)
    }
  }, [])

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, visible: true, type })
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }, [])

  // Simulate Pico y Placa logic
  const checkPicoYPlacaStatus = (plate, vehicleType, city) => {
    if (!plate || !vehicleType || !city) return "Datos incompletos para verificar Pico y Placa (simulado)."
    const lastDigit = Number.parseInt(plate.slice(-1))
    const today = new Date()
    const dayOfWeek = today.getDay() // Sunday - 0, Monday - 1, ..., Saturday - 6
    let status = "No tiene Pico y Placa hoy (simulado)."
    if (city === "Bogotá") {
      if (vehicleType === "Carro") {
        if (dayOfWeek === 1 && [0, 1, 2, 3, 4].includes(lastDigit)) {
          status = "Tiene Pico y Placa hoy (dígitos 0-4, simulado)."
        } else if (dayOfWeek === 2 && [5, 6, 7, 8, 9].includes(lastDigit)) {
          status = "Tiene Pico y Placa hoy (dígitos 5-9, simulado)."
        }
      } else if (vehicleType === "Moto") {
        if (dayOfWeek === 3 && [1, 2].includes(lastDigit)) {
          status = "Tiene Pico y Placa hoy (motos, dígitos 1-2 Miércoles, simulado)."
        }
      }
    } else if (city === "Medellín") {
      if (vehicleType === "Carro") {
        if (dayOfWeek === 1 && [0, 1].includes(lastDigit))
          status = "Tiene Pico y Placa hoy (ejemplo: 0-1 Lunes, simulado)."
        else if (dayOfWeek === 2 && [2, 3].includes(lastDigit))
          status = "Tiene Pico y Placa hoy (ejemplo: 2-3 Martes, simulado)."
        else if (dayOfWeek === 3 && [4, 5].includes(lastDigit))
          status = "Tiene Pico y Placa hoy (ejemplo: 4-5 Miércoles, simulado)."
        else if (dayOfWeek === 4 && [6, 7].includes(lastDigit))
          status = "Tiene Pico y Placa hoy (ejemplo: 6-7 Jueves, simulado)."
        else if (dayOfWeek === 5 && [8, 9].includes(lastDigit))
          status = "Tiene Pico y Placa hoy (ejemplo: 8-9 Viernes, simulado)."
      } else {
        status = "Reglas específicas para motos o taxis en Medellín (simulado)."
      }
    }
    return status
  }

  const handlePicoYPlacaConsultDomicile = () => {
    const message = checkPicoYPlacaStatus(
      picoYPlacaPlateDomicile,
      picoYPlacaVehicleTypeDomicile,
      picoYPlacaCityDomicile,
    )
    showNotification(message, "info")
  }

  const handlePicoYPlacaConsultOther = () => {
    const message = checkPicoYPlacaStatus(picoYPlacaPlateOther, picoYPlacaVehicleTypeOther, picoYPlacaCityOther)
    showNotification(message, "info")
  }

  const toggleLearnExpanded = (id) => {
    setLearnExpandedState((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleInfractionExpanded = (id) => {
    setInfractionsExpandedState((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleNewsExpanded = (id) => {
    setNewsExpandedState((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleToggleFavorite = async (item, source) => {
    const existingFavoriteIndex = favoriteItems.findIndex((fav) => fav.originalId === item.id && fav.type === source)

    let updatedFavorites
    if (existingFavoriteIndex >= 0) {
      // Remove from favorites
      updatedFavorites = favoriteItems.filter((_, index) => index !== existingFavoriteIndex)
      showNotification("Eliminado de Favoritos", "info")
    } else {
      // Add to favorites
      const favoriteData = {
        id: Date.now().toString(),
        originalId: item.id,
        type: source,
        content: item,
      }
      updatedFavorites = [...favoriteItems, favoriteData]
      showNotification("Añadido a Favoritos", "success")
    }

    setFavoriteItems(updatedFavorites)
    saveToLocalStorage("transit-favorites", updatedFavorites)

    // Update the saved status in the respective content arrays
    if (source === "learn") {
      setLearnContent((prev) =>
        prev.map((contentItem) =>
          contentItem.id === item.id ? { ...contentItem, saved: existingFavoriteIndex < 0 } : contentItem,
        ),
      )
    } else if (source === "infractions") {
      setInfractionsData((prev) =>
        prev.map((contentItem) =>
          contentItem.id === item.id ? { ...contentItem, saved: existingFavoriteIndex < 0 } : contentItem,
        ),
      )
    } else if (source === "news") {
      setNewsItems((prev) =>
        prev.map((contentItem) =>
          contentItem.id === item.id ? { ...contentItem, saved: existingFavoriteIndex < 0 } : contentItem,
        ),
      )
    }
  }

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

  const [draggedItemIndex, setDraggedItemIndex] = useState(null)
  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", index)
  }
  const handleDragOver = (e) => e.preventDefault()
  const handleDragEnter = (e, index) => {
    e.preventDefault()
    if (draggedItemIndex === null || draggedItemIndex === index) return
    const newFavorites = [...favoriteItems]
    const draggedItem = newFavorites.splice(draggedItemIndex, 1)[0]
    newFavorites.splice(index, 0, draggedItem)
    setDraggedItemIndex(index)
    setFavoriteItems(newFavorites)
  }
  const handleDragEnd = () => setDraggedItemIndex(null)

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

  const [chatHistory, setChatHistory] = useState([])
  const [userMessage, setUserMessage] = useState("")

  const getAiResponse = useCallback(async (prompt) => {
    try {
      const chatHistoryForApi = [{ role: "user", parts: [{ text: prompt }] }]
      const payload = { contents: chatHistoryForApi }
      const apiKey = ""
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text
      } else {
        console.error("Unexpected API response structure:", result)
        return "Lo siento, no pude obtener una respuesta en este momento. Intenta de nuevo más tarde."
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      return "Hubo un error al conectar con el asistente de IA. Por favor, verifica tu conexión o intenta más tarde."
    }
  }, [])

  const handleSendMessage = async () => {
    if (userMessage.trim() === "") return
    const newUserMessage = { role: "user", content: userMessage }
    setChatHistory((prev) => [...prev, newUserMessage])
    setUserMessage("")
    const aiResponse = await getAiResponse(userMessage)
    setChatHistory((prev) => [...prev, { role: "ai", content: aiResponse }])
  }

  const renderContent = () => {
    switch (activeScreen) {
      case "home":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Tu asesor inteligente de tránsito</h2>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-blue-500 to-blue-700 text-white"
                onClick={() => setActiveScreen("knowledge")}
              >
                <BookOpenIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Conocimiento</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-orange-500 to-orange-700 text-white"
                onClick={() => setActiveScreen("pico-y-placa")}
              >
                <CalendarCheckIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Pico y Placa</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-red-500 to-red-700 text-white"
                onClick={() => showNotification("Funcionalidad en desarrollo", "info")}
              >
                <ReceiptTextIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Consulta Multas</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-purple-500 to-purple-700 text-white"
                onClick={() => setActiveScreen("news")}
              >
                <NewspaperIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Noticias</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-teal-500 to-teal-700 text-white"
                onClick={() => setActiveScreen("quiz")}
              >
                <ListChecksIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Quiz de Tránsito</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white"
                onClick={() => setActiveScreen("regulations-main")}
              >
                <GavelIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Normatividad</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-cyan-500 to-cyan-700 text-white"
                onClick={() => setActiveScreen("glossary")}
              >
                <BookIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">Glosario</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-pink-500 to-pink-700 text-white"
                onClick={() => setActiveScreen("pqr")}
              >
                <MessageSquareTextIcon className="w-8 h-8 mb-2" />
                <span className="text-base font-semibold text-center">PQR</span>
              </div>
            </div>
          </div>
        )
      case "knowledge":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Conocimiento Vial</h2>
            <button
              onClick={() => setActiveScreen("home")}
              className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
            >
              ← Volver al Inicio
            </button>
            <div className="flex justify-around bg-gray-200 p-2 rounded-full mb-6 text-sm font-medium shadow-inner">
              <button
                className={`flex-1 py-2 rounded-full transition-all duration-200 ${activeScreen === "knowledge" && "learn" === "learn" ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-300"}`}
                onClick={() => setActiveScreen("knowledge")}
              >
                Aprende a defenderte
              </button>
              <button
                className={`flex-1 py-2 rounded-full transition-all duration-200 ${activeScreen === "knowledge" && "learn" === "infractions" ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-300"}`}
                onClick={() => setActiveScreen("knowledge")}
              >
                Top de Infracciones
              </button>
            </div>
            <div className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
              <p className="text-gray-600 text-center mb-6">
                Información clave para reaccionar ante situaciones de tránsito cotidianas, basadas en la normativa.
              </p>
              {learnContent.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg pr-4">{item.question}</h3>
                    <button
                      onClick={() => handleToggleFavorite(item, "learn")}
                      className="p-1 rounded-full text-gray-400 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200"
                      aria-label={item.saved ? "Eliminar de Favoritos" : "Guardar en Favoritos"}
                    >
                      <StarIcon className={`w-6 h-6 ${item.saved ? "text-yellow-400" : "text-gray-400"}`} />
                    </button>
                  </div>
                  {learnExpandedState[item.id] && (
                    <>
                      <p className="text-gray-700 mt-2 text-sm leading-relaxed">{item.answer}</p>
                      <p className="text-gray-500 text-xs italic mt-2">Normatividad: {item.normativity}</p>
                    </>
                  )}
                  <button
                    onClick={() => toggleLearnExpanded(item.id)}
                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-200 text-sm shadow-md hover:shadow-lg"
                  >
                    {learnExpandedState[item.id] ? "Ver menos" : "Ver más"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      case "favorites":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tus Favoritos</h2>
            <button
              onClick={() => setActiveScreen("home")}
              className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
            >
              ← Volver al Inicio
            </button>
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {favoriteItems.length === 0 ? (
                <p className="text-gray-600 text-center">
                  Aún no tienes información favorita. ¡Explora las secciones y guarda lo que te interese!
                </p>
              ) : (
                favoriteItems.map((item, index) => (
                  <div
                    key={item.id}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    className="bg-white p-4 rounded-xl shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg data-[dragging=true]:opacity-50"
                    data-dragging={draggedItemIndex === index ? "true" : "false"}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {item.content.question || item.content.title || `Infracción ${item.content.code}`}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.content.answer || item.content.summary || item.content.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleFavorite(item.content, item.type)}
                        className="p-1 rounded-full text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                        aria-label="Eliminar de favoritos"
                      >
                        <StarIcon className="w-6 h-6 text-yellow-400" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      case "documents":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tus Documentos</h2>
            <button
              onClick={() => setActiveScreen("home")}
              className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
            >
              ← Volver al Inicio
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {documents.map((doc) => {
                const daysRemaining = calculateDaysRemaining(doc.dueDate)
                const statusColor =
                  daysRemaining <= 30 ? "text-red-500" : daysRemaining <= 90 ? "text-orange-500" : "text-green-500"
                return (
                  <div key={doc.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{doc.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Vencimiento: {new Date(doc.dueDate).toLocaleDateString("es-CO")}
                        </p>
                        <p className={`text-sm font-bold ${statusColor}`}>
                          {daysRemaining > 0 ? `Faltan ${daysRemaining} días` : "Vencido"}
                        </p>
                        {doc.insurerPhone && (
                          <p className="text-sm text-gray-600 mt-1">Tel. Aseguradora: {doc.insurerPhone}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDocumentUpload(doc.id)}
                        className={`py-2 px-4 rounded-full text-white text-sm shadow-md ${doc.uploaded ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
                        aria-label={doc.uploaded ? `Marcar ${doc.name} como no subido` : `Subir ${doc.name}`}
                      >
                        {doc.uploaded ? "Subido" : "Subir"}
                      </button>
                    </div>
                    {(doc.id === "licencia" || doc.id === "propiedad") && (
                      <button
                        onClick={() => window.open("https://www.runt.com.co/ciudadano/consulta-documento", "_blank")}
                        className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-200 text-sm shadow-md"
                        aria-label={`Ver ${doc.name} en RUNT`}
                      >
                        Ver en RUNT
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      case "quiz":
        const currentQuestion = quizQuestions[currentQuestionIndex]
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Quiz de Tránsito</h2>
            <button
              onClick={() => {
                setActiveScreen("home")
                setQuizStarted(false)
              }}
              className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
            >
              ← Volver al Inicio
            </button>
            {!quizStarted ? (
              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 text-center mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Aprende y pon a prueba tus conocimientos de tránsito
                </h3>
                <p className="text-gray-600 mb-6">
                  Responde 20 preguntas aleatorias para evaluar tu dominio de las normas viales.
                </p>
                <button
                  onClick={() => {
                    setQuizStarted(true)
                    selectRandomQuizQuestions()
                  }}
                  className="bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
                >
                  Comenzar Quiz
                </button>
              </div>
            ) : quizCompleted ? (
              <div className="bg-blue-100 p-5 rounded-xl shadow-md border border-blue-300 text-center mt-8">
                <h3 className="text-xl font-bold text-blue-800 mb-3">¡Quiz Completado!</h3>
                <p className="text-lg text-blue-700 mb-2">
                  Tu puntuación:{" "}
                  <span className="font-bold">
                    {currentScore} / {quizQuestions.length}
                  </span>
                </p>
                <p className="text-lg text-blue-700 font-semibold">{getKnowledgeRange(currentScore)}</p>
                <button
                  onClick={resetQuiz}
                  className="mt-5 bg-blue-600 text-white py-2 px-5 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
                >
                  Reiniciar Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-md">
                  {currentQuestion.imageUrl && (
                    <div className="mb-4 flex justify-center">
                      <img
                        src={currentQuestion.imageUrl || "/placeholder.svg"}
                        alt="Imagen relacionada con el quiz"
                        className="rounded-lg max-h-32 object-cover"
                      />
                    </div>
                  )}
                  <h4 className="font-semibold text-gray-800 mb-3">{currentQuestion.question}</h4>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(currentQuestion.id, option)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 shadow-sm
                          ${
                            currentQuestion.selected === option
                              ? currentQuestion.correct
                                ? "bg-green-100 border-green-500 text-green-800"
                                : "bg-red-100 border-red-500 text-red-800"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        disabled={currentQuestion.selected !== null}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {currentQuestion.selected !== null && (
                    <p
                      className={`mt-3 text-sm font-semibold ${currentQuestion.correct ? "text-green-600" : "text-red-600"}`}
                    >
                      {currentQuestion.correct
                        ? "¡Correcto!"
                        : `Incorrecto. La respuesta correcta es: ${currentQuestion.answer}`}
                    </p>
                  )}
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="text-gray-600 text-sm flex items-center">
                    {currentQuestionIndex + 1} / {quizQuestions.length}
                  </span>
                  <button
                    onClick={goToNextQuestion}
                    disabled={currentQuestion.selected === null && currentQuestionIndex < quizQuestions.length - 1}
                    className="bg-blue-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:opacity-50"
                  >
                    {currentQuestionIndex === quizQuestions.length - 1 ? "Finalizar Quiz" : "Siguiente"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      case "regulations-main":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Normatividad Vial</h2>
            <button
              onClick={() => setActiveScreen("home")}
              className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
            >
              ← Volver al Inicio
            </button>
            <p className="text-gray-600 text-center mb-6">Principales normas de tránsito en Colombia.</p>
            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {regulationsData.map((regulation) => (
                <div
                  key={regulation.id}
                  className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg"
                >
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">{regulation.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{regulation.summary}</p>
                  <button
                    onClick={() => {
                      setActiveScreen("regulation-detail")
                      setSelectedRegulation(regulation)
                    }}
                    className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-full text-sm hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                    aria-label={`Ver detalle de ${regulation.title}`}
                  >
                    Ver en detalle
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      case "regulation-detail":
        return (
          <div className="p-6">
            <button
              onClick={() => {
                setActiveScreen("regulations-main")
                setSelectedRegulation(null)
              }}
              className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
            >
              ← Volver a Normatividad
            </button>
            {selectedRegulation && (
              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 max-h-[calc(100vh-150px)] overflow-y-auto pr-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{selectedRegulation.title}</h2>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{selectedRegulation.summary}</p>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Artículos Clave:</h3>
                <div className="space-y-4">
                  {selectedRegulation.articles && selectedRegulation.articles.length > 0 ? (
                    selectedRegulation.articles.map((article, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-800">Artículo {article.number}:</p>
                        <p className="text-sm text-gray-700">{article.summary}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 italic">No hay artículos detallados disponibles para esta normativa.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      case "glossary":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Glosario de Tránsito</h2>
            <button
              onClick={() => setActiveScreen("home")}
              className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
            >
              ← Volver al Inicio
            </button>
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Buscar término..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                value={glossarySearchTerm}
                onChange={(e) => setGlossarySearchTerm(e.target.value)}
                aria-label="Buscar término en el glosario"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
            </div>
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
              {filteredGlossaryTerms.length === 0 ? (
                <p className="text-gray-600 text-center">No se encontraron términos para tu búsqueda.</p>
              ) : (
                filteredGlossaryTerms.map((term, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{term.term}</h3>
                    <p className="text-gray-700 text-sm">{term.explanation}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      case "pqr":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Preguntas, Quejas y Reclamos (PQR)</h2>
            <button
              onClick={() => setActiveScreen("home")}
              className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
            >
              ← Volver al Inicio
            </button>
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <p className="text-gray-700 mb-4">
                ¿Tienes alguna pregunta sobre tránsito que te gustaría que incluimos en nuestra sección de Conocimiento?
                ¡Escríbenos!
              </p>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none"
                rows="6"
                placeholder="Escribe tu mensaje aquí..."
                value={pqrQuestion}
                onChange={(e) => setPqrQuestion(e.target.value)}
                aria-label="Campo para escribir tu pregunta, queja o reclamo"
              ></textarea>
              <button
                onClick={handlePqrSubmit}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
              >
                Enviar Pregunta
              </button>
            </div>
          </div>
        )
      case "ai-assist":
        return (
          <div className="p-6 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Asesoría IA</h2>
            <button
              onClick={() => setActiveScreen("home")}
              className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
            >
              ← Volver al Inicio
            </button>
            <p className="text-gray-600 text-center mb-6">
              Pregunta a nuestro asistente inteligente sobre cualquier duda vial.
            </p>
            <div className="flex-grow bg-white p-4 rounded-xl shadow-md border border-gray-200 overflow-y-auto mb-4 space-y-4">
              {chatHistory.length === 0 ? (
                <p className="text-gray-500 text-center italic">¡Hola! ¿En qué puedo ayudarte hoy?</p>
              ) : (
                chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center space-x-3">
              <textarea
                className="flex-grow p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="1"
                placeholder="Escribe tu mensaje..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                aria-label="Escribir mensaje al asistente IA"
              ></textarea>
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-200"
                aria-label="Enviar mensaje"
              >
                <MicIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        )
      case "notifications":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Notificaciones</h2>
            <button
              onClick={() => setActiveScreen("home")}
              className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
            >
              ← Volver al Inicio
            </button>
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 mb-6">
              <h3 className="font-semibold text-gray-800 text-lg mb-3">Tus Multas</h3>
              <p className="text-green-600 font-semibold">No tienes multas registradas en las páginas oficiales</p>
              <button
                onClick={() => showNotification("Redirigir a consulta SIMIT (simulado)", "info")}
                className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition-colors duration-200 text-sm shadow-md"
                aria-label="Consultar multas en SIMIT"
              >
                Consultar en SIMIT
              </button>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 mb-6">
              <h3 className="font-semibold text-gray-800 text-lg mb-3">Pico y Placa para tus Vehículos Registrados</h3>
              {registeredVehicles.length === 0 ? (
                <p className="text-gray-600">
                  Aún no tienes vehículos registrados. Regístralos para recibir notificaciones de pico y placa.
                </p>
              ) : (
                <ul className="space-y-3">
                  {registeredVehicles.map((vehicle) => (
                    <li key={vehicle.id} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 shadow-sm">
                      <p>
                        <span className="font-semibold">Placa (últimos 2):</span> {vehicle.lastTwoDigits}
                      </p>
                      <p>
                        <span className="font-semibold">Tipo:</span> {vehicle.type}
                      </p>
                      <p>
                        <span className="font-semibold">Ciudad:</span> {vehicle.city}
                      </p>
                      <p
                        className={`text-base font-bold mt-1 ${checkPicoYPlacaStatus(vehicle.lastTwoDigits, vehicle.type, vehicle.city).includes("Tiene") ? "text-red-500" : "text-green-500"}`}
                      >
                        {checkPicoYPlacaStatus(vehicle.lastTwoDigits, vehicle.type, vehicle.city)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
              <h3 className="font-semibold text-gray-800 text-lg mb-3">Recordatorio de Documentos</h3>
              <div className="space-y-3">
                {documents.map((doc) => {
                  const daysRemaining = calculateDaysRemaining(doc.dueDate)
                  const statusColor =
                    daysRemaining <= 30 ? "text-red-500" : daysRemaining <= 90 ? "text-orange-500" : "text-green-500"
                  return (
                    <div key={doc.id} className="flex items-center justify-between text-gray-700 text-sm">
                      <span>{doc.name}</span>
                      <span className={`font-bold ${statusColor}`}>
                        {daysRemaining > 0 ? `Faltan ${daysRemaining} días` : "Vencido"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      case "news":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Noticias y Novedades</h2>
            <button
              onClick={() => setActiveScreen("home")}
              className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
            >
              ← Volver al Inicio
            </button>
            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg pr-4">{item.title}</h3>
                    <button
                      onClick={() => handleToggleFavorite(item, "news")}
                      className="p-1 rounded-full text-gray-400 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200"
                      aria-label={item.saved ? "Eliminar de Favoritos" : "Guardar en Favoritos"}
                    >
                      <StarIcon className={`w-6 h-6 ${item.saved ? "text-yellow-400" : "text-gray-400"}`} />
                    </button>
                  </div>
                  {item.imageUrl && (
                    <div className="mb-4 flex justify-center">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={`Imagen de ${item.title}`}
                        className="rounded-lg max-h-40 w-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                    {newsExpandedState[item.id] ? item.fullContent : item.summary}
                  </p>
                  <button
                    onClick={() => toggleNewsExpanded(item.id)}
                    className="mt-4 w-full bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition-colors duration-200 text-sm shadow-md hover:shadow-lg"
                  >
                    {newsExpandedState[item.id] ? "Ver menos" : "Ver más"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      case "pico-y-placa":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Pico y Placa</h2>
            <button
              onClick={() => setActiveScreen("home")}
              className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
            >
              ← Volver al Inicio
            </button>
            <div
              className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-md mb-6 text-sm"
              role="alert"
            >
              <strong className="font-bold">¡Atención!</strong>
              <span className="block sm:inline">
                {" "}
                La funcionalidad de Pico y Placa es una simulación. Las reglas reales varían y se actualizan
                constantemente por cada ciudad. Para información precisa, consulte fuentes oficiales.
              </span>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
                <h3 className="font-semibold text-gray-800 text-lg mb-3">Pico y Placa en tu Ciudad de Domicilio</h3>
                <div className="mb-4">
                  <label htmlFor="pico-plate-domicile" className="block text-gray-700 text-sm font-bold mb-2">
                    Placa:
                  </label>
                  <input
                    type="text"
                    id="pico-plate-domicile"
                    placeholder="Ej: ABC123"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={picoYPlacaPlateDomicile}
                    onChange={(e) => setPicoYPlacaPlateDomicile(e.target.value.toUpperCase())}
                    aria-label="Ingresar placa para Pico y Placa de domicilio"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="pico-vehicle-type-domicile" className="block text-gray-700 text-sm font-bold mb-2">
                    Tipo de Vehículo:
                  </label>
                  <select
                    id="pico-vehicle-type-domicile"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    value={picoYPlacaVehicleTypeDomicile}
                    onChange={(e) => setPicoYPlacaVehicleTypeDomicile(e.target.value)}
                    aria-label="Seleccionar tipo de vehículo para Pico y Placa de domicilio"
                  >
                    <option value="">Selecciona</option>
                    {VEHICLE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="pico-city-domicile" className="block text-gray-700 text-sm font-bold mb-2">
                    Ciudad:
                  </label>
                  <select
                    id="pico-city-domicile"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    value={picoYPlacaCityDomicile}
                    onChange={(e) => setPicoYPlacaCityDomicile(e.target.value)}
                    aria-label="Seleccionar ciudad de domicilio para Pico y Placa"
                  >
                    {COLOMBIAN_CITIES_WITH_PICO_Y_PLACA.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handlePicoYPlacaConsultDomicile}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 shadow-md"
                >
                  Consultar
                </button>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
                <h3 className="font-semibold text-gray-800 text-lg mb-3">Pico y Placa en Otra Ciudad</h3>
                <div className="mb-4">
                  <label htmlFor="pico-plate-other" className="block text-gray-700 text-sm font-bold mb-2">
                    Placa:
                  </label>
                  <input
                    type="text"
                    id="pico-plate-other"
                    placeholder="Ej: XYZ789"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={picoYPlacaPlateOther}
                    onChange={(e) => setPicoYPlacaPlateOther(e.target.value.toUpperCase())}
                    aria-label="Ingresar placa para Pico y Placa en otra ciudad"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="pico-vehicle-type-other" className="block text-gray-700 text-sm font-bold mb-2">
                    Tipo de Vehículo:
                  </label>
                  <select
                    id="pico-vehicle-type-other"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    value={picoYPlacaVehicleTypeOther}
                    onChange={(e) => setPicoYPlacaVehicleTypeOther(e.target.value)}
                    aria-label="Seleccionar tipo de vehículo para Pico y Placa en otra ciudad"
                  >
                    <option value="">Selecciona</option>
                    {VEHICLE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="pico-city-other" className="block text-gray-700 text-sm font-bold mb-2">
                    Ciudad:
                  </label>
                  <select
                    id="pico-city-other"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    value={picoYPlacaCityOther}
                    onChange={(e) => setPicoYPlacaCityOther(e.target.value)}
                    aria-label="Seleccionar ciudad para Pico y Placa en otra ciudad"
                  >
                    <option value="">Selecciona una ciudad</option>
                    {COLOMBIAN_CITIES_WITH_PICO_Y_PLACA.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handlePicoYPlacaConsultOther}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 shadow-md"
                >
                  Consultar
                </button>
              </div>
            </div>
          </div>
        )
      case "my-profile":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mi Perfil</h2>
            <button
              onClick={() => setActiveScreen("home")}
              className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
            >
              ← Volver al Inicio
            </button>
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
                <h3 className="font-semibold text-gray-800 text-lg mb-3">Mis Datos</h3>
                {userId && (
                  <p className="text-gray-700 text-sm break-words">
                    ID de usuario: <span className="font-mono">{userId}</span>
                  </p>
                )}
                <button
                  onClick={() => showNotification("Funcionalidad de edición de datos simulada", "info")}
                  className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-200 text-sm shadow-md"
                >
                  Editar Datos
                </button>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg">Vehículos Registrados</h3>
                  <button
                    onClick={() => setShowRegisterVehicleForm((prev) => !prev)}
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 shadow-md"
                    aria-label={
                      showRegisterVehicleForm
                        ? "Cerrar formulario de registro de vehículo"
                        : "Abrir formulario de registro de vehículo"
                    }
                  >
                    <PlusIcon className="w-6 h-6" />
                  </button>
                </div>
                {registeredVehicles.length === 0 ? (
                  <p className="text-gray-600 text-center">Aún no tienes vehículos registrados.</p>
                ) : (
                  <ul className="space-y-3">
                    {registeredVehicles.map((vehicle) => (
                      <li
                        key={vehicle.id}
                        className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 flex justify-between items-center shadow-sm"
                      >
                        <span>
                          Placa (últimos 2): <span className="font-semibold">{vehicle.lastTwoDigits}</span> - Tipo:{" "}
                          <span className="font-semibold">{vehicle.type}</span> - Ciudad:{" "}
                          <span className="font-semibold">{vehicle.city}</span>
                        </span>
                        <button
                          onClick={() => handleForgetVehicle(vehicle.id)}
                          className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors duration-200"
                          aria-label={`Olvidar vehículo con últimos 2 dígitos ${vehicle.lastTwoDigits}`}
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {showRegisterVehicleForm && (
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
                  <h3 className="font-semibold text-gray-800 text-lg mb-3">Registra un Nuevo Vehículo</h3>
                  <div className="mb-4">
                    <label htmlFor="last-two-digits" className="block text-gray-700 text-sm font-bold mb-2">
                      Últimos 2 dígitos de la placa:
                    </label>
                    <input
                      type="text"
                      id="last-two-digits"
                      placeholder="Ej: 23"
                      maxLength="2"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newVehicleLastTwoDigits}
                      onChange={(e) => setNewVehicleLastTwoDigits(e.target.value.replace(/[^0-9]/g, ""))}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="new-vehicle-type" className="block text-gray-700 text-sm font-bold mb-2">
                      Tipo de Vehículo:
                    </label>
                    <select
                      id="new-vehicle-type"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={newVehicleType}
                      onChange={(e) => setNewVehicleType(e.target.value)}
                    >
                      <option value="">Selecciona</option>
                      {VEHICLE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="new-vehicle-city" className="block text-gray-700 text-sm font-bold mb-2">
                      Ciudad:
                    </label>
                    <select
                      id="new-vehicle-city"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={newVehicleCity}
                      onChange={(e) => setNewVehicleCity(e.target.value)}
                    >
                      <option value="">Selecciona una ciudad</option>
                      {COLOMBIAN_CITIES_WITH_PICO_Y_PLACA.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleRegisterVehicle}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
                  >
                    Guardar Vehículo
                  </button>
                </div>
              )}
            </div>
          </div>
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

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col p-4">
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-screen"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between rounded-t-xl shadow-md">
          <div className="relative">
            {loggedIn ? (
              <button
                ref={loginButtonRef}
                className="flex items-center space-x-2 px-3 py-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 text-sm font-semibold shadow-md"
                onClick={() => setShowLoginDropdown((prev) => !prev)}
                aria-label="Opciones de usuario"
              >
                <UserIcon className="w-5 h-5" />
                <span>Perfil</span>
              </button>
            ) : (
              <button
                ref={loginButtonRef}
                className="flex items-center space-x-2 px-3 py-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 text-sm font-semibold shadow-md"
                onClick={() => setShowLoginDropdown((prev) => !prev)}
                aria-label="Opciones de inicio de sesión"
              >
                <LogInIcon className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
            {showLoginDropdown && (
              <div
                className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                onMouseLeave={() => setShowLoginDropdown(false)}
              >
                {loggedIn ? (
                  <>
                    <a
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setActiveScreen("my-profile")
                        setShowLoginDropdown(false)
                      }}
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Mi perfil</span>
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
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setLoggedIn(false)
                        setShowLoginDropdown(false)
                        showNotification("Sesión cerrada.", "info")
                      }}
                    >
                      <LogInIcon className="w-4 h-4 transform rotate-180" />
                      <span>Cerrar Sesión</span>
                    </button>
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
        <div className="flex-grow overflow-y-auto pb-20">{renderContent()}</div>
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-b-xl shadow-inner z-10 h-20 flex items-center justify-around px-2">
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
              onClick={() => {
                if (item.screen === "global-search") {
                  setShowGlobalSearchModal(true)
                } else {
                  setActiveScreen(item.screen)
                }
              }}
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
