"use client";
import React, { useEffect, useState, useCallback } from "react";
import Regulations from "./Regulations";
import { useRegulations } from "../hooks/useRegulations";

/**
 * RegulationsMain Component
 * Main container for regulations feature with data fetching
 */
export default function RegulationsMain({
  setActiveScreen,
  setSelectedRegulation,
}) {
  const { regulations, loading, fetchRegulations } = useRegulations();

  const handleSelectRegulation = useCallback(
    (regulation) => {
      if (typeof setSelectedRegulation === "function") {
        setSelectedRegulation(regulation);
      }
    },
    [setSelectedRegulation]
  );

  return (
    <Regulations
      regulationsData={regulations}
      setActiveScreen={setActiveScreen}
      setSelectedRegulation={handleSelectRegulation}
    />
  );
}
