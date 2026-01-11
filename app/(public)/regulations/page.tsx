"use client";
import type React from "react";
import { useEffect, useState } from "react";
import RegulationsComponent from "@/components/regulations";
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
 * Regulations Page - Public route for traffic regulations
 *
 * This page displays traffic regulations and laws that users can access
 * without authentication as per requirements.
 *
 * Requirements: 1.7, 3.3
 */
export default function RegulationsPage() {
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
    <RegulationsComponent
      regulationsData={regulationsData}
      setSelectedRegulation={setSelectedRegulation}
    />
  );
}
