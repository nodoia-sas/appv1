import type React from "react";
import { notFound } from "next/navigation";
import { fetchNews } from "@/lib/news-utils";
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
 * This page displays the full content of a specific news article
 * identified by the dynamic [id] parameter. It validates the ID
 * and shows a 404 page if the article doesn't exist.
 *
 * Requirements: 6.3, 6.5
 */
export default async function NewsDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // Validate the ID parameter
    const validation = validateAndSanitizeId(params.id, {
      type: "numeric",
    });

    if (!validation.isValid) {
      console.error("Invalid news ID:", validation.error);
      notFound();
    }

    const newsItems = await fetchNews();
    const newsItem = newsItems.find(
      (item: NewsItem) => item.id.toString() === validation.sanitizedId
    );

    if (!newsItem) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <a
              href="/news"
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
              Volver a Noticias
            </a>
          </div>

          {/* News article */}
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {newsItem.imageUrl && (
              <div className="aspect-video w-full">
                <img
                  src={newsItem.imageUrl}
                  alt={newsItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {newsItem.title}
              </h1>

              <div className="text-lg text-gray-600 mb-6">
                {newsItem.summary}
              </div>

              <div className="prose prose-lg max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: newsItem.fullContent.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading news item:", error);
    notFound();
  }
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
