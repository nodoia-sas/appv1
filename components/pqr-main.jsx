"use client"
import React, { useEffect, useState, useCallback } from "react"
import Pqr from "./pqr"
import { fetchPqrs, addPqr } from "../lib/pqr-utils"

export default function PqrMain({ setActiveScreen, showNotification }) {
  const [pqrQuestion, setPqrQuestion] = useState("")
  const [pqrs, setPqrs] = useState([])

  useEffect(() => {
    const data = fetchPqrs()
    setPqrs(data)
  }, [])

  const handlePqrSubmit = useCallback(async () => {
    if (pqrQuestion.trim() === "") {
      if (typeof showNotification === "function") showNotification("Por favor, escribe tu pregunta antes de enviar.", "info")
      return
    }

    const pqrData = {
      id: Date.now().toString(),
      question: pqrQuestion,
      timestamp: new Date().toISOString(),
    }

    const updated = addPqr(pqrData)
    if (updated) {
      setPqrs(updated)
      if (typeof showNotification === "function") showNotification("¡Gracias! Tu pregunta ha sido enviada.", "success")
      setPqrQuestion("")
    } else {
      if (typeof showNotification === "function") showNotification("No se pudo guardar tu pregunta. Intenta de nuevo.", "error")
    }
  }, [pqrQuestion, showNotification])

  return (
    <Pqr
      setActiveScreen={setActiveScreen}
      pqrQuestion={pqrQuestion}
      setPqrQuestion={setPqrQuestion}
      handlePqrSubmit={handlePqrSubmit}
    />
  )
}
