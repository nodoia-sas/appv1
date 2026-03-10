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
    // Call the backend API directly at http://localhost:8011
    const url = "http://localhost:8011/glossaries";

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    const json = await res.json();

    // The API returns a paginated response with content array
    if (json.content && Array.isArray(json.content)) {
      return json.content.map((item) => ({
        term: item.wordName,
        explanation: item.wordValue,
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
