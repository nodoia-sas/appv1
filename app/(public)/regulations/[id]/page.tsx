"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { validateAndSanitizeId } from "@/lib/route-validation";
import RegulationDetail from "@/src/components/RegulationDetail";

/**
 * Dynamic Regulation Detail Page - Public route for specific regulation
 *
 * This page displays the full content of a specific regulation
 * identified by the dynamic [id] parameter using the new TransitIA API integration.
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 8.1, 8.3, 8.4, 9.1, 9.2, 9.4
 */
export default function RegulationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  // Validate the ID parameter
  const validation = validateAndSanitizeId(params.id, {
    type: "string",
  });

  if (!validation.isValid) {
    console.error("Invalid regulation ID:", validation.error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">ID Inválido</h1>
          <p className="text-gray-600 mb-6">{validation.error}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* RegulationDetail component with TransitIA API integration */}
      <RegulationDetail regulationId={validation.sanitizedId || params.id} />
    </div>
  );
}
