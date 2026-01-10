"use client";

import GlossaryMain from "../../../components/glossary-main";

/**
 * GlossaryScreen Component - Independent glossary screen component
 *
 * Extracted from transit-app.jsx monolith to provide a dedicated
 * glossary interface. Maintains existing GlossaryMain component
 * integration while providing screen-level navigation capabilities.
 *
 * Requirements: 1.5 - Glossary screen as independent component
 */
const GlossaryScreen = ({ onNavigate }) => {
  return (
    <div data-testid="screen-glossary">
      <GlossaryMain setActiveScreen={onNavigate} />
    </div>
  );
};

export default GlossaryScreen;
