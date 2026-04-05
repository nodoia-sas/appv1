import { getApiInfo, validateEndpoint } from "../../../shared/utils";
import { auth0 } from "../../../lib/auth0";

/**
 * Endpoint de diagnóstico para verificar la configuración del ambiente.
 * Requiere sesión Auth0 activa. Solo disponible en ambientes no-producción.
 * GET /api/config/environment
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Solo disponible fuera de producción
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ error: "Not found" });
  }

  // Requiere sesión activa
  try {
    const session = await auth0.getSession(req, res);
    if (!session?.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
  } catch {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const apiInfo = getApiInfo();

    const shouldValidate = req.query.validate === "true";
    let validation = null;
    if (shouldValidate) {
      validation = await validateEndpoint("/health");
    }

    const response = {
      timestamp: new Date().toISOString(),
      environment: {
        current: apiInfo.environment,
        name: apiInfo.name,
        nodeEnv: process.env.NODE_ENV,
      },
      api: {
        baseUrl: apiInfo.baseUrl,
        basePath: apiInfo.basePath,
        isOverridden: apiInfo.isOverridden,
      },
      validation: validation || {
        message: "Add ?validate=true to test connectivity",
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("[api/config/environment] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
