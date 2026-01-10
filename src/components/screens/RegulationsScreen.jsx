"use client";

import { useState } from "react";
import RegulationsMain from "../../../components/regulations-main";
import RegulationDetail from "../../../components/regulation-detail";

/**
 * RegulationsScreen Component - Independent regulations screen component
 *
 * Extracted from transit-app.jsx monolith to provide a dedicated
 * regulations interface. Maintains existing RegulationsMain and RegulationDetail
 * component integration while managing regulation selection state internally.
 *
 * This component handles both the main regulations list view and the detailed
 * regulation view, managing navigation between them internally.
 *
 * Requirements: 1.4 - Regulations screen as independent component
 */
const RegulationsScreen = ({ onNavigate }) => {
  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [currentView, setCurrentView] = useState("main"); // "main" or "detail"

  // Handle regulation selection - navigate to detail view
  const handleSelectRegulation = (regulation) => {
    setSelectedRegulation(regulation);
    setCurrentView("detail");
  };

  // Handle navigation back to main regulations list
  const handleBackToMain = () => {
    setCurrentView("main");
    setSelectedRegulation(null);
  };

  // Internal navigation handler for regulations flow
  const handleInternalNavigation = (screen) => {
    if (screen === "regulations-main") {
      handleBackToMain();
    } else if (screen === "regulation-detail") {
      setCurrentView("detail");
    } else {
      // External navigation - delegate to parent
      onNavigate(screen);
    }
  };

  return (
    <div data-testid="screen-regulations">
      {currentView === "main" ? (
        <RegulationsMain
          setActiveScreen={handleInternalNavigation}
          setSelectedRegulation={handleSelectRegulation}
        />
      ) : (
        <RegulationDetail
          selectedRegulation={selectedRegulation}
          setActiveScreen={handleInternalNavigation}
          setSelectedRegulation={setSelectedRegulation}
        />
      )}
    </div>
  );
};

export default RegulationsScreen;
