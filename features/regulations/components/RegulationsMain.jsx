"use client";
import React, { useEffect, useState, useCallback } from "react";
import Regulations from "./Regulations";
import { useRegulations } from "../hooks/useRegulations";

/**
 * RegulationsMain Component
 * Main container for regulations feature with data fetching and pagination
 */
export default function RegulationsMain({
  setActiveScreen,
  setSelectedRegulation,
}) {
  const { regulations, loading, pagination, fetchRegulations } =
    useRegulations();

  const handleSelectRegulation = useCallback(
    (regulation) => {
      if (typeof setSelectedRegulation === "function") {
        setSelectedRegulation(regulation);
      }
    },
    [setSelectedRegulation]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      fetchRegulations(newPage, 10);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchRegulations]
  );

  return (
    <Regulations
      regulationsData={regulations}
      setActiveScreen={setActiveScreen}
      setSelectedRegulation={handleSelectRegulation}
      pagination={pagination}
      onPageChange={handlePageChange}
      loading={loading}
    />
  );
}
