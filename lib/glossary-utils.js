"use strict";

const DEFAULT_GLOSSARY_TERMS = [
  {
    term: "SOAT",
    explanation: "Seguro Obligatorio de Accidentes de Tránsito.",
  },
  {
    term: "Revisión Técnico-Mecánica",
    explanation: "Inspección periódica de seguridad vehicular.",
  },
  {
    term: "Cédula",
    explanation: "Documento de identificación personal utilizado en Colombia.",
  },
];

export async function fetchGlossaryTerms() {
  try {
    // For server-side calls, we need to construct the full URL
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    const url = `${baseUrl}/api/hooks/glossaries/listAll`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    const json = await res.json();
    if (json.data && Array.isArray(json.data)) {
      return json.data.map((item) => ({
        term: item.name,
        explanation: item.description,
      }));
    }
  } catch (e) {
    console.error("Error fetching glossary terms:", e);
  }
  return DEFAULT_GLOSSARY_TERMS;
}

export default {
  fetchGlossaryTerms,
};
