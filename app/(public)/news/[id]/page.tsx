"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchNews } from "@/lib/news-utils";
import { notFound } from "next/navigation";
import { validateAndSanitizeId } from "@/lib/route-validation";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  fullContent: string;
  imageUrl: string;
}

/**
 * Dynamic News Detail Page - Public route for specific news article
 *
 * This page displays detailed information about a specific news article
 * identified by the [id] parameter. Accessible without authentication.
 *
 * Requirements: 6.3, 6.5
 */
export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewsItem = async () => {
      try {
        // Check if params and params.id exist
        if (!params?.id) {
          notFound();
          return;
        }

        // Validate the ID parameter
        const validation = validateAndSanitizeId(params.id, {
          type: "numeric",
        });

        if (!validation.isValid) {
          console.error("Invalid news ID:", validation.error);
          notFound();
          return;
        }

        const newsItems = await fetchNews();
        const foundNewsItem = newsItems.find(
          (item: NewsItem) => item.id.toString() === validation.sanitizedId
        );

        if (!foundNewsItem) {
          notFound();
          return;
        }

        setNewsItem(foundNewsItem);
      } catch (error) {
        console.error("Error loading news item:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadNewsItem();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
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

  if (!newsItem) {
    return null; // notFound() will handle this
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Volver a Noticias
        </button>
      </nav>

      <article className="max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {newsItem.title}
          </h1>
          {newsItem.imageUrl && (
            <div className="mb-6">
              <img
                src={newsItem.imageUrl}
                alt={newsItem.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {newsItem.summary}
          </p>
        </header>

        <section className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {newsItem.fullContent}
          </div>
        </section>

        <footer className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push("/news")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver más noticias
            </button>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              Volver
            </button>
          </div>
        </footer>
      </article>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const newsItems = await fetchNews();
    const newsItem = newsItems.find(
      (item: NewsItem) => item.id.toString() === params.id
    );

    if (!newsItem) {
      return {
        title: "Noticia no encontrada - TransitIA",
        description: "La noticia solicitada no existe.",
      };
    }

    return {
      title: `${newsItem.title} - TransitIA`,
      description: newsItem.summary,
      openGraph: {
        title: `${newsItem.title} - TransitIA`,
        description: newsItem.summary,
        type: "article",
        images: newsItem.imageUrl ? [newsItem.imageUrl] : [],
      },
      twitter: {
        card: newsItem.imageUrl ? "summary_large_image" : "summary",
        title: `${newsItem.title} - TransitIA`,
        description: newsItem.summary,
        images: newsItem.imageUrl ? [newsItem.imageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: "Error - TransitIA",
      description: "Error al cargar la noticia.",
    };
  }
}
