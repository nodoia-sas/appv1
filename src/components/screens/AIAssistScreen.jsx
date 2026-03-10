"use client";

import AiAssist from "../../../components/ai-assist";

/**
 * AIAssistScreen Component - Independent AI assistant screen component
 *
 * Extracted from transit-app.jsx monolith to provide a dedicated
 * AI assistant interface. Maintains existing AiAssist component integration
 * while following the new modular architecture pattern.
 *
 * Requirements: 1.8 - AI assist screen as independent component
 */
const AIAssistScreen = ({ onNavigate }) => {
  return <AiAssist setActiveScreen={onNavigate} />;
};

export default AIAssistScreen;
