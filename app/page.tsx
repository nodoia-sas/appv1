"use client";

import type { Metadata } from "next";
import MainApp from "@/src/components/MainApp";
import RegisterSW from "@/components/register-sw";
import {
  generatePageMetadata,
  PAGE_METADATA_CONFIGS,
} from "@/lib/metadata-utils";

// This will be the home page in the new App Router structure
// For now, we maintain compatibility with the existing MainApp component
// while preparing for the full migration to individual route pages
// Requirements: 1.2, 7.2, 7.3, 7.4, 7.5

// Note: Since this is a client component, metadata is handled in the root layout
// The home page metadata is already configured in the root layout.tsx

export default function HomePage() {
  return (
    <>
      <MainApp />
      <RegisterSW />
    </>
  );
}
