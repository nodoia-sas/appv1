"use client";
import type React from "react";
import RegulationsMain from "@/features/regulations/components/RegulationsMain";

/**
 * Regulations Client Page - Client component for regulations functionality
 * Now uses RegulationsMain which fetches data from the TransitIA API
 */
export default function RegulationsClientPage() {
  return <RegulationsMain />;
}
