"use strict"

import { STORAGE_KEYS } from './storage-keys'
const PQR_KEY = STORAGE_KEYS.PQR

export function fetchPqrs() {
  try {
    const raw = localStorage.getItem(PQR_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export function addPqr(pqr) {
  try {
    const current = fetchPqrs()
    const updated = [...current, pqr]
    localStorage.setItem(PQR_KEY, JSON.stringify(updated))
    return updated
  } catch (e) {
    return null
  }
}

export function clearPqrs() {
  try {
    localStorage.removeItem(PQR_KEY)
    return []
  } catch (e) {
    return null
  }
}

export default { fetchPqrs, addPqr }
