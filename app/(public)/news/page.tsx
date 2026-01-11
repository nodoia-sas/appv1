import type React from "react";
import NewsComponent from "@/components/news";

/**
 * News Page - Public route for news and updates
 *
 * This page displays news and updates about traffic regulations and system changes.
 * It's accessible without authentication as per requirements.
 *
 * Requirements: 1.6, 3.2
 */
export default function NewsPage() {
  return <NewsComponent setActiveScreen={() => {}} />;
}

export async function generateMetadata() {
  return {
    title: "Noticias y Novedades - TransitIA",
    description:
      "Mantente informado sobre las últimas noticias y actualizaciones en normatividad de tránsito en Colombia.",
    openGraph: {
      title: "Noticias y Novedades - TransitIA",
      description:
        "Mantente informado sobre las últimas noticias y actualizaciones en normatividad de tránsito en Colombia.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Noticias y Novedades - TransitIA",
      description:
        "Mantente informado sobre las últimas noticias y actualizaciones en normatividad de tránsito en Colombia.",
    },
  };
}
