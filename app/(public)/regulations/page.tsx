import type React from "react";
import type { Metadata } from "next";
import {
  generatePageMetadata,
  PAGE_METADATA_CONFIGS,
} from "@/lib/metadata-utils";
import RegulationsClientPage from "./client-page";

/**
 * Regulations Page - Public route for traffic regulations
 *
 * This page displays traffic regulations and laws that users can access
 * without authentication as per requirements.
 *
 * Requirements: 1.7, 3.3, 7.2, 7.3, 7.4, 7.5
 */

export const metadata: Metadata = generatePageMetadata(
  PAGE_METADATA_CONFIGS.regulations
);

export default function RegulationsPage() {
  return <RegulationsClientPage />;
}
