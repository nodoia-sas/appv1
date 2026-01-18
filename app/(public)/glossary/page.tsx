import type React from "react";
import type { Metadata } from "next";
import GlossaryComponent from "@/components/glossary";
import {
  generatePageMetadata,
  PAGE_METADATA_CONFIGS,
} from "@/lib/metadata-utils";

interface GlossaryTerm {
  term: string;
  explanation: string;
}

/**
 * Glossary Page - Public route for traffic terminology
 *
 * This page displays a searchable glossary of traffic terms and definitions
 * accessible without authentication as per requirements.
 *
 * Requirements: 1.8, 3.4, 7.2, 7.3, 7.4, 7.5
 */

export const metadata: Metadata = generatePageMetadata(
  PAGE_METADATA_CONFIGS.glossary
);

export default async function GlossaryPage() {
  // The component will load data dynamically from the API
  // We only provide fallback terms in case of error
  const fallbackTerms = [
    {
      term: "SOAT",
      explanation: "Seguro Obligatorio de Accidentes de Tránsito.",
    },
    {
      term: "Revisión Técnico-Mecánica",
      explanation: "Inspección periódica de seguridad vehicular.",
    },
    {
      term: "Cédula",
      explanation:
        "Documento de identificación personal utilizado en Colombia.",
    },
  ];

  return <GlossaryComponent initialTerms={fallbackTerms} />;
}
