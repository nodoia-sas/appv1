import { getApiInfo, validateEndpoint } from "../../../shared/utils";

/**
 * Endpoint de diagnóstico para verificar la configuración del ambiente
 * GET /api/config/environment
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiInfo = getApiInfo();

    // Validar conectividad (opcional, puede ser lento)
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
        appEnv: process.env.NEXT_PUBLIC_APP_ENV || null,
      },
      api: {
        baseUrl: apiInfo.baseUrl,
        basePath: apiInfo.basePath,
        finalUrl: apiInfo.finalUrl,
        isOverridden: apiInfo.isOverridden,
        overrideValue: process.env.API_URL || null,
      },
      validation: validation || {
        message: "Add ?validate=true to test connectivity",
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("[api/config/environment] Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
