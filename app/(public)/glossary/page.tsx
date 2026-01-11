import type React from "react";
import GlossaryComponent from "@/components/glossary";

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
 * Requirements: 1.8, 3.4
 */
export default async function GlossaryPage() {
  // For now, use default terms to avoid server-side fetch issues
  // The client component can handle dynamic loading if needed
  const glossaryTerms: GlossaryTerm[] = [
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
    {
      term: "Licencia de Conducción",
      explanation:
        "Documento que autoriza a una persona para conducir vehículos.",
    },
    {
      term: "Pico y Placa",
      explanation:
        "Medida de restricción vehicular basada en el último dígito de la placa.",
    },
    {
      term: "Comparendo",
      explanation: "Orden de comparecencia por infracción de tránsito.",
    },
    {
      term: "Inmovilización",
      explanation: "Retención temporal de un vehículo por infracciones graves.",
    },
    {
      term: "Embriaguez",
      explanation:
        "Estado de alteración por consumo de alcohol que afecta la conducción.",
    },
  ];

  return <GlossaryComponent initialTerms={glossaryTerms} />;
}

export async function generateMetadata() {
  return {
    title: "Glosario de Tránsito - TransitIA",
    description:
      "Consulta definiciones y términos importantes relacionados con el tránsito y la normatividad vial en Colombia.",
    openGraph: {
      title: "Glosario de Tránsito - TransitIA",
      description:
        "Consulta definiciones y términos importantes relacionados con el tránsito y la normatividad vial en Colombia.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Glosario de Tránsito - TransitIA",
      description:
        "Consulta definiciones y términos importantes relacionados con el tránsito y la normatividad vial en Colombia.",
    },
  };
}
