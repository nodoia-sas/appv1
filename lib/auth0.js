import { Auth0Client } from '@auth0/nextjs-auth0/server'

// Read configuration from environment variables (support alternate names)
let domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL
const clientId = process.env.AUTH0_CLIENT_ID || process.env.AUTH0_CLIENTID || process.env.AUTH0_CLIENT_ID
const clientSecret = process.env.AUTH0_CLIENT_SECRET || process.env.AUTH0_CLIENTSECRET || process.env.AUTH0_CLIENT_SECRET
const secret = process.env.AUTH0_SECRET || process.env.AUTH0_COOKIE_SECRET || process.env.AUTH0_SECRET
// APP_BASE_URL / AUTH0_BASE_URL support; default to localhost in development
const appBaseUrl = process.env.APP_BASE_URL || process.env.AUTH0_BASE_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined)

// Normalize domain: if a full URL is provided, extract hostname
if (domain) {
	try {
		const parsed = new URL(domain)
		domain = parsed.hostname
	} catch (e) {
		// not a full URL, keep as-is
		domain = domain.replace(/\/+$/g, '')
	}
}

// Helpful debug output when variables are missing
const missing = []
if (!domain) missing.push('AUTH0_DOMAIN or AUTH0_ISSUER_BASE_URL')
if (!clientId) missing.push('AUTH0_CLIENT_ID')
if (!secret) missing.push('AUTH0_SECRET')
if (!appBaseUrl) missing.push('APP_BASE_URL or AUTH0_BASE_URL')
if (missing.length > 0) {
	console.warn(
		'WARNING: Missing Auth0 environment variables:',
		missing.join(', '),
		'\nSet them in .env.local (do NOT commit secrets) or in your hosting provider.'
	)
}

export const auth0 = new Auth0Client({
  domain,
  clientId,
  clientSecret,
  secret,
  appBaseUrl,
})
