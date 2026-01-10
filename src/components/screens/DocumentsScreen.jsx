"use client";

import Documents from "../../../components/documents";

/**
 * DocumentsScreen Component - Independent documents screen component
 *
 * Extracted from transit-app.jsx monolith to provide a dedicated
 * documents management interface. Maintains existing Documents component
 * integration while providing screen-level navigation capabilities.
 *
 * Requirements: 1.2 - Documents screen as independent component
 */
const DocumentsScreen = ({ onNavigate }) => {
  return (
    <div data-testid="screen-documents">
      <Documents />
    </div>
  );
};

export default DocumentsScreen;
