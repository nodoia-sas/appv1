/**
 * News Feature Types
 */

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  fullContent: string;
  imageUrl?: string;
  saved?: boolean;
}

export interface NewsState {
  newsItems: NewsItem[];
  loading: boolean;
  error: string | null;
}
