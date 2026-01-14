"use client";

import { News } from "@/features/news";

/**
 * NewsScreen Component - Independent news screen component
 *
 * Extracted from transit-app.jsx monolith to provide a dedicated
 * news and updates interface. Maintains existing News component
 * integration while providing screen-level navigation capabilities.
 *
 * Requirements: 1.3 - News screen as independent component
 */
const NewsScreen = ({ onNavigate }) => {
  return (
    <div data-testid="screen-news">
      <News setActiveScreen={onNavigate} />
    </div>
  );
};

export default NewsScreen;
