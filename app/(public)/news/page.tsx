import type React from "react";
import type { Metadata } from "next";
import { News } from "@/features/news";
import {
  generatePageMetadata,
  PAGE_METADATA_CONFIGS,
} from "@/lib/metadata-utils";

/**
 * News Page - Public route for news and updates
 *
 * This page displays news and updates about traffic regulations and system changes.
 * It's accessible without authentication as per requirements.
 *
 * Requirements: 1.6, 3.2, 7.2, 7.3, 7.4, 7.5
 */

export const metadata: Metadata = generatePageMetadata(
  PAGE_METADATA_CONFIGS.news
);

export default function NewsPage() {
  return <News />;
}
