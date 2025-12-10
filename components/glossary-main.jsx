"use client"
import React, { useEffect, useState, useCallback } from "react"
import Glossary from "./glossary"
import { fetchGlossaryTerms } from "../lib/glossary-utils"

export default function GlossaryMain({ setActiveScreen }) {
  const [glossaryTerms, setGlossaryTerms] = useState([])
  const [glossarySearchTerm, setGlossarySearchTerm] = useState("")

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const data = await fetchGlossaryTerms()
      if (mounted) setGlossaryTerms(data)
    }
    load()
    return () => (mounted = false)
  }, [])

  const normalize = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  const filteredGlossaryTerms = glossaryTerms.filter((term) => {
    const search = normalize(glossarySearchTerm)
    return (
      normalize(term.term).includes(search) ||
      normalize(term.explanation).includes(search)
    )
  })

  const handleSetActive = useCallback((screen) => setActiveScreen(screen), [setActiveScreen])

  return (
    <Glossary
      glossarySearchTerm={glossarySearchTerm}
      setGlossarySearchTerm={setGlossarySearchTerm}
      filteredGlossaryTerms={filteredGlossaryTerms}
      setActiveScreen={handleSetActive}
    />
  )
}
