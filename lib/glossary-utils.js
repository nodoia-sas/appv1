"use strict"

const DEFAULT_GLOSSARY_TERMS = [
  { term: "SOAT", explanation: "Seguro Obligatorio de Accidentes de Tránsito." },
  { term: "Revisión Técnico-Mecánica", explanation: "Inspección periódica de seguridad vehicular." },
  { term: "Cédula", explanation: "Documento de identificación personal utilizado en Colombia." },
]

export async function fetchGlossaryTerms() {
  // stub for future API call
  return DEFAULT_GLOSSARY_TERMS
}

export default {
  fetchGlossaryTerms,
}
