import type React from "react";
import QuizComponent from "@/components/quiz";

/**
 * Quiz Page - Public route for traffic knowledge quiz
 *
 * This page provides an interactive quiz to test traffic knowledge
 * accessible without authentication as per requirements.
 *
 * Requirements: 1.9, 3.5
 */
export default function QuizPage() {
  return <QuizComponent />;
}

export async function generateMetadata() {
  return {
    title: "Quiz de Tránsito - TransitIA",
    description:
      "Pon a prueba tus conocimientos sobre normatividad de tránsito con nuestro quiz interactivo.",
    openGraph: {
      title: "Quiz de Tránsito - TransitIA",
      description:
        "Pon a prueba tus conocimientos sobre normatividad de tránsito con nuestro quiz interactivo.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Quiz de Tránsito - TransitIA",
      description:
        "Pon a prueba tus conocimientos sobre normatividad de tránsito con nuestro quiz interactivo.",
    },
  };
}
