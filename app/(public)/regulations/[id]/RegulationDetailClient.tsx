"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { validateAndSanitizeId } from "@/lib/route-validation";
import RegulationDetail from "@/src/components/RegulationDetail";

export default function RegulationDetailClient({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const validation = validateAndSanitizeId(params.id, { type: "string" });

  if (!validation.isValid) {
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
      <RegulationDetail regulationId={validation.sanitizedId || params.id} />
    </div>
  );
}
