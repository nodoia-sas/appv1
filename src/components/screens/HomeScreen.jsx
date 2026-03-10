"use client";

import { OptimizedLink, HighPriorityLink } from "@/lib/performance";
import * as Icons from "../../../components/icons";
import SmartSearch from "../SmartSearch";

/**
 * HomeScreen Component - Main dashboard screen
 *
 * Renders the main dashboard with service tiles that provide quick access
 * to different features of the application. This component maintains the
 * same functionality as the original home screen in transit-app.jsx.
 *
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.8 (SmartSearch integration)
 */
const HomeScreen = () => {
  return (
    <div className="p-4" data-testid="screen-home">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Tu asesor inteligente de tránsito
      </h2>

      {/* SmartSearch Component - Requirement 7.8 */}
      <div className="mb-8">
        <SmartSearch />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <OptimizedLink
          href="/under-construction"
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-linear-to-br from-blue-500 to-blue-700 text-white"
          role="button"
          aria-label="Conocimiento - Próximamente"
          title="Conocimiento - Próximamente"
          priority="low"
        >
          <Icons.BookOpenIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">
            Conocimiento
          </span>
          <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
            Próximamente
          </span>
        </OptimizedLink>
        <div
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-orange-500 to-orange-700 text-white"
          onClick={() => window.open("https://www.pyphoy.com/bogota", "_blank")}
        >
          <Icons.CalendarCheckIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">
            Pico y Placa
          </span>
        </div>
        <div
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-red-500 to-red-700 text-white"
          onClick={() =>
            window.open(
              "https://www.fcm.org.co/simit/#/estado-cuenta",
              "_blank"
            )
          }
        >
          <Icons.ReceiptTextIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">
            Consulta Multas
          </span>
        </div>
        <OptimizedLink
          //href="/news"
          href="/under-construction"
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-linear-to-br from-purple-500 to-purple-700 text-white"
          aria-label="Noticias - Próximamente"
          title="Noticias - Próximamente"
        >
          <Icons.NewspaperIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">Noticias</span>
          <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
            Próximamente
          </span>
        </OptimizedLink>
        <OptimizedLink
          //href="/quiz"
          href="/under-construction"
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-linear-to-br from-teal-500 to-teal-700 text-white"
          aria-label="Quiz - Próximamente"
          title="Quiz - Próximamente"
        >
          <Icons.ListChecksIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">
            Quiz de Tránsito
          </span>
          <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
            Próximamente
          </span>
        </OptimizedLink>
        <HighPriorityLink
          href="/regulations"
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-linear-to-br from-indigo-500 to-indigo-700 text-white"
        >
          <Icons.GavelIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">
            Normatividad
          </span>
        </HighPriorityLink>
        <HighPriorityLink
          href="/glossary"
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-linear-to-br from-cyan-500 to-cyan-700 text-white"
        >
          <Icons.BookIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">Glosario</span>
        </HighPriorityLink>
        <OptimizedLink
          //href="/pqr"
          href="/under-construction"
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-linear-to-br from-pink-500 to-pink-700 text-white"
          aria-label="PQR - Próximamente"
          title="PQR - Próximamente"
        >
          <Icons.MessageSquareTextIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">PQR</span>
          <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
            Próximamente
          </span>
        </OptimizedLink>
      </div>
    </div>
  );
};

export default HomeScreen;
