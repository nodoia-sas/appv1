/**
 * usePqr Hook
 * Manages PQR form state and submission
 */

import { useState } from "react";
import { pqrService } from "../services/pqrService";

export function usePqr() {
  const [pqrQuestion, setPqrQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!pqrQuestion.trim()) {
      setError("Por favor escribe tu pregunta");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const pqrData = {
        question: pqrQuestion.trim(),
        type: "question",
      };

      const result = pqrService.addPqr(pqrData);

      if (result) {
        setPqrQuestion("");
        setSubmitted(true);

        // Show success message (could be enhanced with toast notification)
        if (typeof window !== "undefined") {
          alert("¡Gracias por tu pregunta! La hemos recibido correctamente.");
        }
      } else {
        throw new Error("Failed to submit PQR");
      }
    } catch (err) {
      setError(err.message || "Error al enviar la pregunta");
      console.error("Error submitting PQR:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPqrQuestion("");
    setError(null);
    setSubmitted(false);
  };

  return {
    pqrQuestion,
    setPqrQuestion,
    loading,
    error,
    submitted,
    handleSubmit,
    resetForm,
  };
}
