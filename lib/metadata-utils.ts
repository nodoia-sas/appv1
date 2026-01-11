import type { Metadata } from "next";

/**
 * Metadata utilities for generating page-specific metadata
 * Supports Open Graph and Twitter Cards as per requirements 7.2, 7.3, 7.4, 7.5
 */

export interface PageMetadataConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

const DEFAULT_CONFIG = {
  siteName: "TransitIA",
  baseUrl: "https://transitia.app",
  defaultImage: "/icons/icon-512.png",
  locale: "es_CO",
  twitterHandle: "@TransitIA",
};

/**
 * Generates comprehensive metadata for a page
 * Requirements: 7.2, 7.3, 7.4, 7.5
 */
export function generatePageMetadata(config: PageMetadataConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = DEFAULT_CONFIG.defaultImage,
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    section,
  } = config;

  const fullTitle = `${title} - ${DEFAULT_CONFIG.siteName}`;
  const fullUrl = url
    ? `${DEFAULT_CONFIG.baseUrl}${url}`
    : DEFAULT_CONFIG.baseUrl;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: [
      ...keywords,
      "tránsito",
      "Colombia",
      "TransitIA",
      "normas de tránsito",
    ],
    authors: author ? [{ name: author }] : [{ name: "TransitIA Team" }],
    creator: "TransitIA",
    publisher: "TransitIA",
    openGraph: {
      type,
      locale: DEFAULT_CONFIG.locale,
      url: fullUrl,
      siteName: DEFAULT_CONFIG.siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 512,
          height: 512,
          alt: `${title} - ${DEFAULT_CONFIG.siteName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: DEFAULT_CONFIG.twitterHandle,
      creator: DEFAULT_CONFIG.twitterHandle,
      title: fullTitle,
      description,
      images: [image],
    },
  };

  // Add article-specific metadata
  if (type === "article") {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: author ? [author] : ["TransitIA Team"],
      section,
    };
  }

  return metadata;
}

/**
 * Predefined metadata configurations for common pages
 */
export const PAGE_METADATA_CONFIGS = {
  home: {
    title: "Inicio",
    description:
      "Tu asesor inteligente de tránsito en Colombia. Consulta normas, pico y placa, documentos vehiculares y más.",
    keywords: ["inicio", "asesor inteligente", "tránsito Colombia"],
    url: "/",
  },
  news: {
    title: "Noticias y Novedades",
    description:
      "Mantente informado sobre las últimas noticias y actualizaciones en normatividad de tránsito en Colombia.",
    keywords: ["noticias", "novedades", "actualizaciones", "normatividad"],
    url: "/news",
  },
  regulations: {
    title: "Regulaciones de Tránsito",
    description:
      "Consulta las regulaciones y normas de tránsito vigentes en Colombia. Información actualizada y oficial.",
    keywords: ["regulaciones", "normas", "código de tránsito", "leyes"],
    url: "/regulations",
  },
  glossary: {
    title: "Glosario de Términos",
    description:
      "Diccionario completo de términos relacionados con el tránsito y la movilidad en Colombia.",
    keywords: ["glosario", "términos", "definiciones", "diccionario"],
    url: "/glossary",
  },
  quiz: {
    title: "Quiz de Conocimientos",
    description:
      "Pon a prueba tus conocimientos sobre las normas de tránsito con nuestro quiz interactivo.",
    keywords: ["quiz", "examen", "conocimientos", "prueba"],
    url: "/quiz",
  },
  profile: {
    title: "Mi Perfil",
    description:
      "Gestiona tu información personal y configuración de cuenta en TransitIA.",
    keywords: ["perfil", "cuenta", "configuración", "usuario"],
    url: "/profile",
  },
  documents: {
    title: "Mis Documentos",
    description:
      "Administra tus documentos personales y vehiculares de forma segura y organizada.",
    keywords: ["documentos", "gestión", "personal", "vehicular"],
    url: "/documents",
  },
  vehicles: {
    title: "Mis Vehículos",
    description:
      "Registra y administra la información de tus vehículos, incluyendo documentación y recordatorios.",
    keywords: ["vehículos", "registro", "documentación", "administración"],
    url: "/vehicles",
  },
  pqr: {
    title: "PQR - Peticiones, Quejas y Reclamos",
    description:
      "Presenta tus peticiones, quejas y reclamos relacionados con tránsito de manera oficial.",
    keywords: ["PQR", "peticiones", "quejas", "reclamos"],
    url: "/pqr",
  },
  aiAssist: {
    title: "Asistente IA",
    description:
      "Obtén ayuda personalizada sobre temas de tránsito con nuestro asistente de inteligencia artificial.",
    keywords: ["IA", "asistente", "inteligencia artificial", "ayuda"],
    url: "/ai-assist",
  },
} as const;

/**
 * Generates dynamic metadata for content with ID
 * Requirements: 7.1, 7.6
 */
export function generateDynamicMetadata(
  baseConfig: PageMetadataConfig,
  contentTitle: string,
  contentDescription?: string,
  contentId?: string
): Metadata {
  const dynamicConfig: PageMetadataConfig = {
    ...baseConfig,
    title: contentTitle,
    description: contentDescription || baseConfig.description,
    url: contentId ? `${baseConfig.url}/${contentId}` : baseConfig.url,
    type: "article",
  };

  return generatePageMetadata(dynamicConfig);
}
