/**
 * News Feature - Barrel Export
 * Public API for the news feature
 */

export { default as News } from "./components/News";
export { useNews } from "./hooks/useNews";
export { newsService } from "./services/newsService";
export type { NewsItem, NewsState } from "./types";
