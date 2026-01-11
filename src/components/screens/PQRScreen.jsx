"use client";

import PqrMain from "../../../components/pqr-main";
import { useNotifications } from "../../hooks/useNotifications";

/**
 * PQRScreen Component - Independent PQR screen component
 *
 * Extracted from transit-app.jsx monolith to provide a dedicated
 * PQR (Peticiones, Quejas y Reclamos) interface. Integrates with
 * the existing PqrMain component and useNotifications hook.
 *
 * Requirements: 1.7 - PQR screen as independent component
 */
const PQRScreen = ({ onNavigate }) => {
  const { showNotification } = useNotifications();

  return (
    <PqrMain setActiveScreen={onNavigate} showNotification={showNotification} />
  );
};

export default PQRScreen;
