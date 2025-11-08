// Utilities for Pico y Placa - keep logic decoupled so it can fetch from an API later
// Export constants and helper functions. Consumers can override by passing props.

export const VEHICLE_TYPES = ["Carro", "Moto", "Taxi", "Bus", "Camión"]

export const COLOMBIAN_CITIES_WITH_PICO_Y_PLACA = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Manizales",
  "Ibagué",
  "Villavicencio",
]

// Simulated Pico y Placa logic kept here so it can be replaced by an API call later.
export function checkPicoYPlacaStatus(plate, vehicleType, city) {
  if (!plate || !vehicleType || !city) return "Datos incompletos para verificar Pico y Placa (simulado)."
  const lastDigit = Number.parseInt(String(plate).slice(-1))
  const today = new Date()
  const dayOfWeek = today.getDay() // Sunday - 0, Monday - 1, ..., Saturday - 6
  let status = "No tiene Pico y Placa hoy (simulado)."

  if (city === "Bogotá") {
    if (vehicleType === "Carro") {
      if (dayOfWeek === 1 && [0, 1, 2, 3, 4].includes(lastDigit)) {
        status = "Tiene Pico y Placa hoy (dígitos 0-4, simulado)."
      } else if (dayOfWeek === 2 && [5, 6, 7, 8, 9].includes(lastDigit)) {
        status = "Tiene Pico y Placa hoy (dígitos 5-9, simulado)."
      }
    } else if (vehicleType === "Moto") {
      if (dayOfWeek === 3 && [1, 2].includes(lastDigit)) {
        status = "Tiene Pico y Placa hoy (motos, dígitos 1-2 Miércoles, simulado)."
      }
    }
  } else if (city === "Medellín") {
    if (vehicleType === "Carro") {
      if (dayOfWeek === 1 && [0, 1].includes(lastDigit)) status = "Tiene Pico y Placa hoy (ejemplo: 0-1 Lunes, simulado)."
      else if (dayOfWeek === 2 && [2, 3].includes(lastDigit)) status = "Tiene Pico y Placa hoy (ejemplo: 2-3 Martes, simulado)."
      else if (dayOfWeek === 3 && [4, 5].includes(lastDigit)) status = "Tiene Pico y Placa hoy (ejemplo: 4-5 Miércoles, simulado)."
      else if (dayOfWeek === 4 && [6, 7].includes(lastDigit)) status = "Tiene Pico y Placa hoy (ejemplo: 6-7 Jueves, simulado)."
      else if (dayOfWeek === 5 && [8, 9].includes(lastDigit)) status = "Tiene Pico y Placa hoy (ejemplo: 8-9 Viernes, simulado)."
    } else {
      status = "Reglas específicas para motos o taxis en Medellín (simulado)."
    }
  }

  return status
}

// Placeholder to fetch remote pico-y-placa configuration in the future.
export async function fetchPicoConfig(apiUrl) {
  // Example: return await fetch(apiUrl).then(r => r.json())
  return {
    vehicleTypes: VEHICLE_TYPES,
    cities: COLOMBIAN_CITIES_WITH_PICO_Y_PLACA,
  }
}
