"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Regulations } from "@/features/regulations";
import { fetchRegulations } from "@/lib/regulations-utils";

interface RegulationArticle {
  number: string;
  summary: string;
}

interface Regulation {
  id: string;
  title: string;
  summary: string;
  articles: RegulationArticle[];
}

/**
 * Regulations Client Page - Client component for regulations functionality
 */
export default function RegulationsClientPage() {
  const [regulationsData, setRegulationsData] = useState<Regulation[]>([]);
  const [selectedRegulation, setSelectedRegulation] =
    useState<Regulation | null>(null);

  useEffect(() => {
    const loadRegulations = async () => {
      try {
        const data = await fetchRegulations();
        setRegulationsData(data);
      } catch (error) {
        console.error("Error loading regulations:", error);
      }
    };

    loadRegulations();
  }, []);

  return (
    <Regulations
      regulationsData={regulationsData}
      setSelectedRegulation={setSelectedRegulation}
    />
  );
}
