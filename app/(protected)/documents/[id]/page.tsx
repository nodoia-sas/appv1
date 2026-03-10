import type React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { validateAndSanitizeId } from "@/lib/route-validation";
import {
  generateDynamicMetadata,
  PAGE_METADATA_CONFIGS,
} from "@/lib/metadata-utils";

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
 * This page displays the full details of a specific document
 * identified by the dynamic [id] parameter. It validates the ID
 * and shows a 404 page if the document doesn't exist.
 *
 * Requirements: 6.4, 6.5, 7.1, 7.6
 */
export default async function DocumentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // Validate the ID parameter
    const validation = validateAndSanitizeId(params.id, {
      type: "string",
    });

    if (!validation.isValid) {
      console.error("Invalid document ID:", validation.error);
      notFound();
    }

    // In a real app, you would fetch the document from your API
    // For now, we'll create a mock document
    const document: Document = {
      id: validation.sanitizedId!,
      name: `Documento ${validation.sanitizedId}`,
      type: "Licencia de Conducción",
      number: "LC123456789",
      expirationDate: "2025-12-31",
      issueDate: "2020-01-15",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <a
              href="/documents"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver a Documentos
            </a>
          </div>

          {/* Document details */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {document.name}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Información General
                  </h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Tipo:
                      </dt>
                      <dd className="text-sm text-gray-900">{document.type}</dd>
                    </div>
                    {document.number && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Número:
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {document.number}
                        </dd>
                      </div>
                    )}
                    {document.issueDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Fecha de Emisión:
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(document.issueDate).toLocaleDateString(
                            "es-CO"
                          )}
                        </dd>
                      </div>
                    )}
                    {document.expirationDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Fecha de Vencimiento:
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(document.expirationDate).toLocaleDateString(
                            "es-CO"
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Metadatos
                  </h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Creado:
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(document.createdAt).toLocaleDateString(
                          "es-CO"
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Actualizado:
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(document.updatedAt).toLocaleDateString(
                          "es-CO"
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading document:", error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    // In a real app, you would fetch the document from your API
    // For now, we'll create a mock document for metadata generation
    const mockDocument: Document = {
      id: params.id,
      name: `Documento ${params.id}`,
      type: "Licencia de Conducción",
      number: "LC123456789",
      expirationDate: "2025-12-31",
      issueDate: "2020-01-15",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    return generateDynamicMetadata(
      {
        ...PAGE_METADATA_CONFIGS.documents,
        author: "Usuario",
        section: "Documentos",
      },
      mockDocument.name,
      `Detalles del documento: ${mockDocument.type}`,
      params.id
    );
  } catch (error) {
    console.error("Error generating metadata for document:", error);
    return generateDynamicMetadata(
      PAGE_METADATA_CONFIGS.documents,
      "Error",
      "Error al cargar el documento.",
      params.id
    );
  }
}
