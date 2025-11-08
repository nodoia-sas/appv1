// Helper utilities for managing user documents in localStorage
const DOCUMENTS_KEY = 'transit-user-documents'

export const DEFAULT_DOCUMENTS = [
  { id: 'licencia', name: 'Licencia de Conducción', dueDate: '2025-06-15', uploaded: false },
  { id: 'soat', name: 'SOAT', dueDate: '2025-03-20', uploaded: false },
  { id: 'propiedad', name: 'Tarjeta de Propiedad', dueDate: '2026-01-10', uploaded: false },
]

export function loadDocuments() {
  try {
    if (typeof window === 'undefined') return DEFAULT_DOCUMENTS.slice()
    const raw = localStorage.getItem(DOCUMENTS_KEY)
    if (!raw) return DEFAULT_DOCUMENTS.slice()
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : DEFAULT_DOCUMENTS.slice()
  } catch (e) {
    console.warn('loadDocuments failed', e)
    return DEFAULT_DOCUMENTS.slice()
  }
}

export function saveDocuments(docs) {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs))
  } catch (e) {
    console.warn('saveDocuments failed', e)
  }
}

export function addDocument({ name, dueDate, uploaded = false }) {
  const newDoc = { id: Date.now().toString(), name, dueDate, uploaded }
  const current = loadDocuments()
  const updated = [...current, newDoc]
  saveDocuments(updated)
  return newDoc
}

export function deleteDocument(id) {
  const current = loadDocuments()
  const updated = current.filter((d) => d.id !== id)
  saveDocuments(updated)
  return updated
}

export function restoreDefaults() {
  saveDocuments(DEFAULT_DOCUMENTS.slice())
  return DEFAULT_DOCUMENTS.slice()
}

export default { loadDocuments, saveDocuments, addDocument, deleteDocument, restoreDefaults }
