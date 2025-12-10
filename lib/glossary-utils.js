"use strict"

const DEFAULT_GLOSSARY_TERMS = [
  { term: "SOAT", explanation: "Seguro Obligatorio de Accidentes de Tránsito." },
  { term: "Revisión Técnico-Mecánica", explanation: "Inspección periódica de seguridad vehicular." },
  { term: "Cédula", explanation: "Documento de identificación personal utilizado en Colombia." },
]

export async function fetchGlossaryTerms() {
  try {
    const res = await fetch('/api/hooks/glossaries/listAll')
    if (!res.ok) throw new Error('Failed to fetch')
    const json = await res.json()
    if (json.data && Array.isArray(json.data)) {
      return json.data.map(item => ({
        term: item.name,
        explanation: item.description
      }))
    }
  } catch (e) {
    console.error(e)
  }
  return DEFAULT_GLOSSARY_TERMS
}

export default {
  fetchGlossaryTerms,
}
