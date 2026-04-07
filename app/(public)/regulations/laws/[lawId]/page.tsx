import type { Metadata } from "next";
import LawArticlesClient from "./LawArticlesClient";

export function generateStaticParams() {
  return [{ lawId: "_" }];
}

export const metadata: Metadata = {
  title: "Artículos de Ley | TransitIA",
};

export default function LawArticlesPage({
  params,
}: {
  params: { lawId: string };
}) {
  return <LawArticlesClient params={params} />;
}
