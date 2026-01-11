"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchRegulations } from "@/lib/regulations-utils";
import { notFound } from "next/navigation";
import { validateAndSanitizeId } from "@/lib/route-validation";

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
 * This page displays detailed information about a specific regulation
 * identified by the [id] parameter. Accessible without authentication.
 *
 * Requirements: 6.2, 6.5
 */
export default function RegulationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [regulation, setRegulation] = useState<Regulation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRegulation = async () => {
      try {
        // Check if params and params.id exist
        if (!params?.id) {
          notFound();
          return;
        }

        // Validate the ID parameter
        const validation = validateAndSanitizeId(params.id, {
          type: "string",
          pattern: /^[a-zA-Z0-9_-]+$/,
        });

        if (!validation.isValid) {
          console.error("Invalid regulation ID:", validation.error);
          notFound();
          return;
        }

        const regulations = await fetchRegulations();
        const foundRegulation = regulations.find(
          (reg) => reg.id === validation.sanitizedId
        );

        if (!foundRegulation) {
          notFound();
          return;
        }

        setRegulation(foundRegulation);
      } catch (error) {
        console.error("Error loading regulation:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadRegulation();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!regulation) {
    return null; // notFound() will handle this
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Volver a Regulaciones
        </button>
      </nav>

      <article className="max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {regulation.title}
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            {regulation.summary}
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Artículos Principales
          </h2>
          <div className="space-y-6">
            {regulation.articles.map((article) => (
              <div
                key={article.number}
                className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 rounded-r-lg"
              >
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Artículo {article.number}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const regulations = await fetchRegulations();
    const regulation = regulations.find((reg) => reg.id === params.id);

    if (!regulation) {
      return {
        title: "Regulación no encontrada - TransitIA",
        description: "La regulación solicitada no existe.",
      };
    }

    return {
      title: `${regulation.title} - TransitIA`,
      description: regulation.summary,
      openGraph: {
        title: `${regulation.title} - TransitIA`,
        description: regulation.summary,
        type: "article",
      },
      twitter: {
        card: "summary",
        title: `${regulation.title} - TransitIA`,
        description: regulation.summary,
      },
    };
  } catch (error) {
    return {
      title: "Error - TransitIA",
      description: "Error al cargar la regulación.",
    };
  }
}
