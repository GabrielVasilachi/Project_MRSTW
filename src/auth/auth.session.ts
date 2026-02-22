import type { AuthSession } from './auth.types'

const SESSION_KEY = 'pv.session'
// seteaza sesiunea in localStorage daca utilizatorul este sau nu auttentificat, in inspect la Aplicatio la Local storage
export function setSession(session: AuthSession) {
	localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getSession(): AuthSession | null {
	const raw = localStorage.getItem(SESSION_KEY)
	if (!raw) return null

	try {
		return JSON.parse(raw) as AuthSession
	} catch {
		return null
	}
}
// se sterge sesiunea cand utilizatorul este deconenctat
export function clearSession() {
	localStorage.removeItem(SESSION_KEY)
}
