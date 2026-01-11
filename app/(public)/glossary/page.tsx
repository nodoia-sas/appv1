"use client";
import type React from "react";
import { useEffect, useState } from "react";
import GlossaryComponent from "@/components/glossary";
import { fetchGlossaryTerms } from "@/lib/glossary-utils";

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
export default function GlossaryPage() {
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [glossarySearchTerm, setGlossarySearchTerm] = useState("");

  useEffect(() => {
    const loadGlossaryTerms = async () => {
      try {
        const terms = await fetchGlossaryTerms();
        setGlossaryTerms(terms);
      } catch (error) {
        console.error("Error loading glossary terms:", error);
      }
    };

    loadGlossaryTerms();
  }, []);

  // Filter terms based on search
  const filteredGlossaryTerms = glossaryTerms.filter(
    (term) =>
      term.term.toLowerCase().includes(glossarySearchTerm.toLowerCase()) ||
      term.explanation.toLowerCase().includes(glossarySearchTerm.toLowerCase())
  );

  return (
    <GlossaryComponent
      glossarySearchTerm={glossarySearchTerm}
      setGlossarySearchTerm={setGlossarySearchTerm}
      filteredGlossaryTerms={filteredGlossaryTerms}
      setActiveScreen={() => {}}
    />
  );
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
