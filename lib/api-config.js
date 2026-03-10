/**
 * Configuración de endpoints por ambiente
 * Por defecto apunta al ambiente de desarrollo
 */

const API_ENVIRONMENTS = {
  local: {
    baseUrl: 'http://localhost:8010',
    basePath: '/transitia/api/v1',
    name: 'Local Development'
  },
  dev: {
    baseUrl: 'https://api-dev.transitia.com',
    basePath: '/transitia/api/v1',
    name: 'Development'
  },
  staging: {
    baseUrl: 'https://api-staging.transitia.com',
    basePath: '/transitia/api/v1',
    name: 'Staging'
  },
  production: {
    baseUrl: 'https://api.transitia.com',
    basePath: '/transitia/api/v1',
    name: 'Production'
  }
}

/**
 * Obtiene el ambiente actual basado en variables de entorno
 * Prioridad: NODE_ENV -> NEXT_PUBLIC_APP_ENV -> 'dev' (por defecto)
 */
function getCurrentEnvironment() {
  // Permitir override explícito del ambiente
  if (process.env.NEXT_PUBLIC_APP_ENV) {
    return process.env.NEXT_PUBLIC_APP_ENV
  }
  
  // Mapeo automático basado en NODE_ENV
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'dev' // Por defecto dev, no local
    case 'production':
      return 'production'
    case 'test':
      return 'staging'
    default:
      return 'dev' // Siempre dev por defecto
  }
}

/**
 * Obtiene la configuración del ambiente actual
 */
export function getEnvironmentConfig() {
  const env = getCurrentEnvironment()
  const config = API_ENVIRONMENTS[env]
  
  if (!config) {
    console.warn(`[API Config] Ambiente '${env}' no encontrado, usando 'dev'`)
    return API_ENVIRONMENTS.dev
  }
  
  return {
    ...config,
    environment: env
  }
}

/**
 * Obtiene la URL base de la API para el ambiente actual
 * Permite override manual con API_URL
 */
export function getApiBase() {
  // Override manual tiene prioridad
  if (process.env.API_URL) {
    return process.env.API_URL
  }
  
  const config = getEnvironmentConfig()
  return `${config.baseUrl}${config.basePath}`
}

/**
 * Obtiene información completa del ambiente actual
 */
export function getApiInfo() {
  const config = getEnvironmentConfig()
  const finalUrl = getApiBase()
  
  return {
    environment: config.environment,
    name: config.name,
    baseUrl: config.baseUrl,
    basePath: config.basePath,
    finalUrl,
    isOverridden: !!process.env.API_URL
  }
}

/**
 * Valida si un endpoint está disponible
 */
export async function validateEndpoint(endpoint = '/health') {
  try {
    const baseUrl = getApiBase()
    const url = new URL(endpoint, baseUrl)
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    
    return {
      available: response.ok,
      status: response.status,
      url: url.toString()
    }
  } catch (error) {
    return {
      available: false,
      error: error.message,
      url: `${getApiBase()}${endpoint}`
    }
  }
}

export default {
  getEnvironmentConfig,
  getApiBase,
  getApiInfo,
  validateEndpoint,
  environments: API_ENVIRONMENTS
}