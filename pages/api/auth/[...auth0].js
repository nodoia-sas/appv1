import { auth0 } from '../../../lib/auth0'

// Compatibility shim: proxy common /api/auth/* requests to the App Router middleware at /auth/*
// and provide a JSON /api/auth/me endpoint that returns the session user for pages-router clients.

export default async function handler(req, res) {
	try {
		const url = req.url || ''
		// Extract the part after /api/auth
		const rel = url.replace(/^\/api\/auth/, '') || '/'

		if (rel.startsWith('/login')) {
			const qs = url.indexOf('?') >= 0 ? url.slice(url.indexOf('?')) : ''
			res.writeHead(307, { Location: `/auth/login${qs}` })
			return res.end()
		}

		if (rel.startsWith('/logout')) {
			const qs = url.indexOf('?') >= 0 ? url.slice(url.indexOf('?')) : ''
			res.writeHead(307, { Location: `/auth/logout${qs}` })
			return res.end()
		}

		if (rel.startsWith('/me')) {
			// Return JSON session info (compatible with client code expecting /api/auth/me)
			const session = await auth0.getSession(req)
			if (!session) {
				return res.status(401).json({ error: 'No active session' })
			}
			return res.status(200).json({ user: session.user })
		}

		// Fallback: not found
		return res.status(404).json({ error: 'Not found' })
	} catch (err) {
		console.error('Auth API error:', err)
		return res.status(500).json({ error: String(err?.message || err) })
	}
}
