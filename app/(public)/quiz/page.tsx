import type React from "react";
import type { Metadata } from "next";
import QuizComponent from "@/components/quiz";
import {
  generatePageMetadata,
  PAGE_METADATA_CONFIGS,
} from "@/lib/metadata-utils";

/**
 * Quiz Page - Public route for traffic knowledge quiz
 *
 * This page provides an interactive quiz to test traffic knowledge
 * accessible without authentication as per requirements.
 *
 * Requirements: 1.9, 3.5, 7.2, 7.3, 7.4, 7.5
 */

export const metadata: Metadata = generatePageMetadata(
  PAGE_METADATA_CONFIGS.quiz
);

export default function QuizPage() {
  return <QuizComponent />;
}
