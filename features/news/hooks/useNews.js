/**
 * useNews Hook
 * Manages news state, loading, and favorites
 */

import { useEffect, useState } from "react";
import { newsService } from "../services/newsService";
import {
  getFavorites,
  toggleFavorite as toggleFavoriteUtil,
  hasFavorite,
} from "@/lib/favorites-utils";

export function useNews() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadNews = async () => {
      try {
        setLoading(true);
        const data = await newsService.fetchNews();

        if (mounted) {
          const favs = getFavorites();
          const itemsWithFavorites = data.map((item) => ({
            ...item,
            saved: hasFavorite(favs, item.id, "news"),
          }));
          setNewsItems(itemsWithFavorites);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load news");
          console.error("Error loading news:", err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadNews();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleFavorite = (item) => {
    try {
      const favs = getFavorites();
      const updated = toggleFavoriteUtil(favs, item, "news");
      const nowSaved = hasFavorite(updated, item.id, "news");

      setNewsItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, saved: nowSaved } : n))
      );
    } catch (e) {
      console.error("Error toggling favorite:", e);
    }
  };

  return {
    newsItems,
    loading,
    error,
    toggleFavorite,
  };
}
