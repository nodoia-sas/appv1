/**
 * API Configuration utilities
 * Handles environment-based API endpoint configuration
 */

interface ApiEnvironment {
  baseUrl: string;
  basePath: string;
  name: string;
}

interface ApiEnvironmentConfig extends ApiEnvironment {
  environment: string;
}

const API_ENVIRONMENTS: Record<string, ApiEnvironment> = {
  local: {
    baseUrl: "http://localhost:8010",
    basePath: "/transitia/api/v1",
    name: "Local Development",
  },
  dev: {
    baseUrl: "https://api-dev.transitia.com",
    basePath: "/transitia/api/v1",
    name: "Development",
  },
  staging: {
    baseUrl: "https://api-staging.transitia.com",
    basePath: "/transitia/api/v1",
    name: "Staging",
  },
  production: {
    baseUrl: "https://api.transitia.com",
    basePath: "/transitia/api/v1",
    name: "Production",
  },
};

/**
 * Gets the current environment based on environment variables
 * Priority: NODE_ENV -> NEXT_PUBLIC_APP_ENV -> 'dev' (default)
 */
function getCurrentEnvironment(): string {
  // Allow explicit override of environment
  if (process.env.NEXT_PUBLIC_APP_ENV) {
    return process.env.NEXT_PUBLIC_APP_ENV;
  }

  // Automatic mapping based on NODE_ENV
  switch (process.env.NODE_ENV) {
    case "development":
      return "dev"; // Default to dev, not local
    case "production":
      return "production";
    case "test":
      return "staging";
    default:
      return "dev"; // Always dev by default
  }
}

/**
 * Gets the configuration for the current environment
 */
export function getEnvironmentConfig(): ApiEnvironmentConfig {
  const env = getCurrentEnvironment();
  const config = API_ENVIRONMENTS[env];

  if (!config) {
    console.warn(`[API Config] Environment '${env}' not found, using 'dev'`);
    return {
      ...API_ENVIRONMENTS.dev,
      environment: "dev",
    };
  }

  return {
    ...config,
    environment: env,
  };
}

/**
 * Gets the base API URL for the current environment
 * Allows manual override with API_URL environment variable
 */
export function getApiBase(): string {
  // Manual override takes priority
  if (process.env.API_URL) {
    return process.env.API_URL;
  }

  const config = getEnvironmentConfig();
  return `${config.baseUrl}${config.basePath}`;
}

/**
 * Gets complete information about the current API environment
 */
export function getApiInfo() {
  const config = getEnvironmentConfig();
  const finalUrl = getApiBase();

  return {
    environment: config.environment,
    name: config.name,
    baseUrl: config.baseUrl,
    basePath: config.basePath,
    finalUrl,
    isOverridden: !!process.env.API_URL,
  };
}

/**
 * Validates if an API endpoint is available
 */
export async function validateEndpoint(endpoint = "/health") {
  try {
    const baseUrl = getApiBase();
    const url = new URL(endpoint, baseUrl);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    return {
      available: response.ok,
      status: response.status,
      url: url.toString(),
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : "Unknown error",
      url: `${getApiBase()}${endpoint}`,
    };
  }
}

export const apiConfig = {
  getEnvironmentConfig,
  getApiBase,
  getApiInfo,
  validateEndpoint,
  environments: API_ENVIRONMENTS,
};

export default apiConfig;
