import type React from "react";
import UnderConstructionComponent from "../../../components/under-construction-new";

/**
 * Under Construction Page - Public route for features in development
 *
 * This page displays a message for features that are still in development.
 * Uses the public layout to maintain consistency with the platform.
 *
 * Requirements: Consistent look and feel with platform
 */
export default function UnderConstructionPage() {
  return <UnderConstructionComponent />;
}

export async function generateMetadata() {
  return {
    title: "En Construcción - TransitIA",
    description:
      "Esta funcionalidad está en desarrollo y estará disponible pronto.",
    openGraph: {
      title: "En Construcción - TransitIA",
      description:
        "Esta funcionalidad está en desarrollo y estará disponible pronto.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "En Construcción - TransitIA",
      description:
        "Esta funcionalidad está en desarrollo y estará disponible pronto.",
    },
  };
}
