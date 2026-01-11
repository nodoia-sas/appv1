"use client";

import { Vehicles } from "@/components/documents-manager/Vehicles";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Vehicles Page - Protected route for vehicle management
 *
 * This page provides dedicated access to vehicle registration and management.
 * Requires authentication via AuthLayout.
 *
 * Requirements: 1.10 - Vehicles page as protected route
 */
export default function VehiclesPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Mis Vehículos
      </h2>

      {/* Message Display */}
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {/* Vehicles Component */}
      <Vehicles showMessage={showMessage} />

      {/* Navigation Actions */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => router.push("/documents")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ver Todos los Documentos
        </button>
      </div>
    </div>
  );
}
