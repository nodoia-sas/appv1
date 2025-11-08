"use client"
import React, { useEffect, useState, useCallback } from "react"
import Regulations from "./regulations"
import { fetchRegulations, saveSelectedRegulation } from "../lib/regulations-utils"

export default function RegulationsMain({ setActiveScreen, setSelectedRegulation }) {
  const [regulationsData, setRegulationsData] = useState([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const data = await fetchRegulations()
      if (mounted) setRegulationsData(data)
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleSelectRegulation = useCallback(
    (regulation) => {
      try {
        saveSelectedRegulation(regulation)
      } catch (e) {
        // ignore storage errors
      }
      if (typeof setSelectedRegulation === "function") setSelectedRegulation(regulation)
    },
    [setSelectedRegulation],
  )

  return (
    <Regulations
      regulationsData={regulationsData}
      setActiveScreen={setActiveScreen}
      setSelectedRegulation={handleSelectRegulation}
    />
  )
}
