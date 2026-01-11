"use client";

import Link from "next/link";
import * as Icons from "../../../components/icons";

/**
 * HomeScreen Component - Main dashboard screen
 *
 * Renders the main dashboard with service tiles that provide quick access
 * to different features of the application. This component maintains the
 * same functionality as the original home screen in transit-app.jsx.
 *
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
const HomeScreen = () => {
  return (
    <div className="p-4" data-testid="screen-home">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Tu asesor inteligente de tránsito
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/under-construction"
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-blue-500 to-blue-700 text-white"
          role="button"
          aria-label="Conocimiento - Próximamente"
          title="Conocimiento - Próximamente"
        >
          <Icons.BookOpenIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">
            Conocimiento
          </span>
          <span className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
            Próximamente
          </span>
        </Link>
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
        <Link
          href="/news"
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-purple-500 to-purple-700 text-white"
        >
          <Icons.NewspaperIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">Noticias</span>
        </Link>
        <Link
          href="/quiz"
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-teal-500 to-teal-700 text-white"
        >
          <Icons.ListChecksIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">
            Quiz de Tránsito
          </span>
        </Link>
        <Link
          href="/regulations"
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white"
        >
          <Icons.GavelIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">
            Normatividad
          </span>
        </Link>
        <Link
          href="/glossary"
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-cyan-500 to-cyan-700 text-white"
        >
          <Icons.BookIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">Glosario</span>
        </Link>
        <Link
          href="/pqr"
          className="flex flex-col items-center justify-center p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-pink-500 to-pink-700 text-white"
        >
          <Icons.MessageSquareTextIcon className="w-8 h-8 mb-2" />
          <span className="text-base font-semibold text-center">PQR</span>
        </Link>
      </div>
    </div>
  );
};

export default HomeScreen;
