"use client";

import MainApp from "@/src/components/MainApp";
import RegisterSW from "@/components/register-sw";
import type { Metadata } from "next";

// This will be the home page in the new App Router structure
// For now, we maintain compatibility with the existing MainApp component
// while preparing for the full migration to individual route pages

export default function HomePage() {
  return (
    <>
      <MainApp />
      <RegisterSW />
    </>
  );
}
