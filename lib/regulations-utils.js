"use strict"

// Simple regulations utilities and defaults
const DEFAULT_REGULATIONS = [
  {
    id: "ley769",
    title: "Ley 769 de 2002 - Código Nacional de Tránsito",
    summary:
      "Establece las normas de comportamiento para conductores, pasajeros, peatones y ciclistas en las vías públicas y privadas abiertas al público.",
    articles: [
      { number: "21", summary: "Obligatoriedad de la licencia de conducción y su presentación." },
      { number: "25", summary: "Uso obligatorio del cinturón de seguridad para todos los ocupantes del vehículo." },
      { number: "55", summary: "Comportamiento de conductores y pasajeros en la vía, incluyendo prohibiciones." },
      { number: "131", summary: "Clasificación de las infracciones de tránsito y sus respectivas sanciones." },
    ],
  },
  {
    id: "res3027",
    title: "Resolución 3027 de 2010 - Manual de Señalización Vial",
    summary:
      "Define las características y el uso de la señalización vial en Colombia para garantizar la seguridad y fluidez del tránsito.",
    articles: [
      {
        number: "5",
        summary:
          "Clasificación general de las señales de tránsito (reglamentarias, preventivas, informativas, transitorias).",
      },
      { number: "10", summary: "Características de las señales reglamentarias (forma, color, significado)." },
      { number: "15", summary: "Características de las señales preventivas (forma, color, significado)." },
    ],
  },
  {
    id: "decreto1079",
    title: "Decreto 1079 de 2015 - Decreto Único Reglamentario del Sector Transporte",
    summary: "Compila y racionaliza las normas de carácter reglamentario que rigen el sector transporte en Colombia.",
    articles: [
      {
        number: "2.3.1.5.1",
        summary: "Regulación sobre la presentación de documentos de tránsito en formato digital.",
      },
      {
        number: "2.3.1.5.2",
        summary: "Disposiciones sobre la revisión técnico-mecánica y de emisiones contaminantes.",
      },
    ],
  },
]

const SELECTED_REGULATION_KEY = "transit-selected-regulation"

export async function fetchRegulations() {
  // stub for future API calls
  return DEFAULT_REGULATIONS
}

export function saveSelectedRegulation(regulation) {
  try {
    localStorage.setItem(SELECTED_REGULATION_KEY, JSON.stringify(regulation))
  } catch (e) {
    // ignore
  }
}

export function getSelectedRegulation() {
  try {
    const raw = localStorage.getItem(SELECTED_REGULATION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function clearSelectedRegulation() {
  try {
    localStorage.removeItem(SELECTED_REGULATION_KEY)
  } catch (e) {
    // ignore
  }
}

export default {
  fetchRegulations,
  saveSelectedRegulation,
  getSelectedRegulation,
  clearSelectedRegulation,
}
