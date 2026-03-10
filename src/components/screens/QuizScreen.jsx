"use client";

import { Quiz } from "@/features/quiz";

/**
 * QuizScreen Component - Independent quiz screen component
 *
 * Extracted from transit-app.jsx monolith to provide a dedicated
 * quiz interface. Maintains existing Quiz component integration
 * while providing screen-level navigation capabilities.
 *
 * Requirements: 1.6 - Quiz screen as independent component
 */
const QuizScreen = ({ onNavigate }) => {
  return (
    <div data-testid="screen-quiz">
      <Quiz setActiveScreen={onNavigate} />
    </div>
  );
};

export default QuizScreen;
