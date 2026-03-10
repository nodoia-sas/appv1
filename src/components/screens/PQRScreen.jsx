"use client";

import { Pqr } from "../../../features/pqr";
import { useNotifications } from "../../hooks/useNotifications";

/**
 * PQRScreen Component - Independent PQR screen component
 *
 * Extracted from transit-app.jsx monolith to provide a dedicated
 * PQR (Peticiones, Quejas y Reclamos) interface. Integrates with
 * the migrated Pqr feature component and useNotifications hook.
 *
 * Requirements: 1.7 - PQR screen as independent component
 */
const PQRScreen = ({ onNavigate }) => {
  const { showNotification } = useNotifications();

  return (
    <Pqr setActiveScreen={onNavigate} showNotification={showNotification} />
  );
};

export default PQRScreen;
