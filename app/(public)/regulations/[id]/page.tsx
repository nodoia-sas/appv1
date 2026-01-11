import type React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchRegulations } from "@/lib/regulations-utils";
import { validateAndSanitizeId } from "@/lib/route-validation";
import {
  generateDynamicMetadata,
  PAGE_METADATA_CONFIGS,
} from "@/lib/metadata-utils";

interface RegulationArticle {
  number: string;
  summary: string;
}

interface Regulation {
  id: string;
  title: string;
  summary: string;
  articles: RegulationArticle[];
}

/**
 * Dynamic Regulation Detail Page - Public route for specific regulation
 *
 * This page displays the full content of a specific regulation
 * identified by the dynamic [id] parameter. It validates the ID
 * and shows a 404 page if the regulation doesn't exist.
 *
 * Requirements: 6.2, 6.5, 7.1, 7.6
 */
export default async function RegulationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // Validate the ID parameter
    const validation = validateAndSanitizeId(params.id, {
      type: "string",
    });

    if (!validation.isValid) {
      console.error("Invalid regulation ID:", validation.error);
      notFound();
    }

    const regulations = await fetchRegulations();
    const regulation = regulations.find(
      (reg: Regulation) => reg.id === validation.sanitizedId
    );

    if (!regulation) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <a
              href="/regulations"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver a Regulaciones
            </a>
          </div>

          {/* Regulation content */}
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {regulation.title}
              </h1>

              <div className="text-lg text-gray-600 mb-8">
                {regulation.summary}
              </div>

              {/* Articles */}
              {regulation.articles && regulation.articles.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Artículos
                  </h2>
                  {regulation.articles.map((article, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Artículo {article.number}
                      </h3>
                      <p className="text-gray-700">{article.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading regulation:", error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const regulations = await fetchRegulations();
    const regulation = regulations.find(
      (reg: Regulation) => reg.id === params.id
    );

    if (!regulation) {
      return generateDynamicMetadata(
        PAGE_METADATA_CONFIGS.regulations,
        "Regulación no encontrada",
        "La regulación solicitada no existe.",
        params.id
      );
    }

    return generateDynamicMetadata(
      {
        ...PAGE_METADATA_CONFIGS.regulations,
        author: "Ministerio de Transporte",
        section: "Regulaciones",
      },
      regulation.title,
      regulation.summary,
      params.id
    );
  } catch (error) {
    console.error("Error generating metadata for regulation:", error);
    return generateDynamicMetadata(
      PAGE_METADATA_CONFIGS.regulations,
      "Error",
      "Error al cargar la regulación.",
      params.id
    );
  }
}
