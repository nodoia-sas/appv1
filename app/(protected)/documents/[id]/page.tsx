"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { validateAndSanitizeId } from "@/lib/route-validation";

interface Document {
  id: string;
  name: string;
  type: string;
  number?: string;
  expirationDate?: string;
  issueDate?: string;
  vehicleId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Dynamic Document Detail Page - Protected route for specific document
 *
 * This page displays detailed information about a specific document
 * identified by the [id] parameter. Requires authentication.
 *
 * Requirements: 6.4, 6.5
 */
export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        // Check if params and params.id exist
        if (!params?.id) {
          notFound();
          return;
        }

        // Validate the ID parameter
        const validation = validateAndSanitizeId(params.id, {
          type: "string",
        });

        if (!validation.isValid) {
          console.error("Invalid document ID:", validation.error);
          notFound();
          return;
        }

        const response = await fetch("/api/hooks/documents/list");
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const documents = await response.json();
        const foundDocument = documents.find(
          (doc: Document) => doc.id === validation.sanitizedId
        );

        if (!foundDocument) {
          notFound();
          return;
        }

        setDocument(foundDocument);
      } catch (error) {
        console.error("Error loading document:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return null; // notFound() will handle this
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDocumentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "license":
      case "licencia":
        return "🪪";
      case "cedula":
      case "id":
        return "🆔";
      case "passport":
      case "pasaporte":
        return "📘";
      default:
        return "📄";
    }
  };

  const isExpired = (expirationDate: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Volver a Documentos
        </button>
      </nav>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{getDocumentIcon(document.type)}</div>
              <div>
                <h1 className="text-2xl font-bold">{document.name}</h1>
                <p className="text-blue-100 capitalize">{document.type}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {document.number && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Número:</span>
                <span className="text-gray-900 font-mono">
                  {document.number}
                </span>
              </div>
            )}

            {document.issueDate && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">
                  Fecha de Expedición:
                </span>
                <span className="text-gray-900">
                  {formatDate(document.issueDate)}
                </span>
              </div>
            )}

            {document.expirationDate && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">
                  Fecha de Vencimiento:
                </span>
                <span
                  className={`font-medium ${
                    isExpired(document.expirationDate)
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {formatDate(document.expirationDate)}
                  {isExpired(document.expirationDate) && (
                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      VENCIDO
                    </span>
                  )}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Registrado:</span>
              <span className="text-gray-900">
                {formatDate(document.createdAt)}
              </span>
            </div>

            {document.updatedAt !== document.createdAt && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">
                  Última Actualización:
                </span>
                <span className="text-gray-900">
                  {formatDate(document.updatedAt)}
                </span>
              </div>
            )}

            {document.vehicleId && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <span className="text-lg">🚗</span>
                  <span className="font-medium">
                    Documento asociado a vehículo
                  </span>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  ID del vehículo: {document.vehicleId}
                </p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <button
              onClick={() => router.push("/documents")}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Ver todos los documentos
            </button>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/hooks/documents/list`
    );

    if (!response.ok) {
      return {
        title: "Documento no encontrado - TransitIA",
        description: "El documento solicitado no existe.",
      };
    }

    const documents = await response.json();
    const document = documents.find((doc: any) => doc.id === params.id);

    if (!document) {
      return {
        title: "Documento no encontrado - TransitIA",
        description: "El documento solicitado no existe.",
      };
    }

    return {
      title: `${document.name} - TransitIA`,
      description: `Detalles del documento ${document.name} (${document.type})`,
      openGraph: {
        title: `${document.name} - TransitIA`,
        description: `Detalles del documento ${document.name} (${document.type})`,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${document.name} - TransitIA`,
        description: `Detalles del documento ${document.name} (${document.type})`,
      },
    };
  } catch (error) {
    return {
      title: "Error - TransitIA",
      description: "Error al cargar el documento.",
    };
  }
}
