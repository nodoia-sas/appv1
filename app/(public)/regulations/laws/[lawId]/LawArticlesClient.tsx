"use client";

import type React from "react";
import { validateAndSanitizeId } from "@/lib/route-validation";
import LawArticles from "@/src/components/LawArticles";
import Link from "next/link";

export default function LawArticlesClient({
  params,
}: {
  params: { lawId: string };
}) {
  const validation = validateAndSanitizeId(params.lawId, { type: "string" });

  if (!validation.isValid) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">ID Inválido</h1>
          <p className="text-gray-600 mb-6">{validation.error}</p>
          <Link
            href="/regulations"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Volver a Leyes
          </Link>
        </div>
      </div>
    );
  }

  return <LawArticles lawId={validation.sanitizedId || params.lawId} />;
}
