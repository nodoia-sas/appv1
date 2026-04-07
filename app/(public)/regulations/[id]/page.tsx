import type { Metadata } from "next";
import RegulationDetailClient from "./RegulationDetailClient";

/**
 * generateStaticParams requerido para output: export.
 * Los IDs reales se cargan en runtime desde el backend (cliente).
 * CloudFront debe configurarse con Custom Error Response 403/404 → /404.html
 */
export function generateStaticParams() {
  // IDs reales cargados en runtime desde el backend (client-side).
  // CloudFront debe responder 403/404 con Custom Error Response → /404.html
  return [{ id: "_" }];
}

export const metadata: Metadata = {
  title: "Detalle de Regulación | TransitIA",
};

export default function RegulationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <RegulationDetailClient params={params} />;
}
