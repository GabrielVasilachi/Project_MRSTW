import { paths } from '../routes/paths'
import type { UserRole } from './auth.types'

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
const NAME_IDENTIFIER_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
const EMAIL_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'

export function getDashboardPathByRole(role: UserRole) {
	switch (role) {
		case 'admin':
			return paths.Dashboard_Admin
		case 'business':
			return paths.Dashboard_Business
		case 'individual':
			return paths.Dashboard_Individual
	}
}

export function mapRoleEnumToUserRole(roleEnum: number | string): UserRole {
	const normalizedRole = String(roleEnum).toLowerCase()

	if (roleEnum === 2 || normalizedRole === '2' || normalizedRole === 'admin') {
		return 'admin'
	}

	if (roleEnum === 1 || normalizedRole === '1' || normalizedRole === 'business') {
		return 'business'
	}

	return 'individual'
}

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
	const payload = token.split('.')[1]

	if (!payload) {
		return null
	}

	try {
		const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
		const paddedPayload = normalizedPayload.padEnd(
			normalizedPayload.length + ((4 - normalizedPayload.length % 4) % 4),
			'=',
		)

		return JSON.parse(window.atob(paddedPayload)) as Record<string, unknown>
	} catch {
		return null
	}
}

function getStringClaim(payload: Record<string, unknown> | null, claimNames: string[]) {
	if (!payload) {
		return null
	}

	for (const claimName of claimNames) {
		const value = payload[claimName]

		if (typeof value === 'string' && value.trim()) {
			return value
		}
	}

	return null
}

export function getUserIdFromToken(token: string) {
	const payload = decodeJwtPayload(token)

	return getStringClaim(payload, ['userId', 'nameid', 'sub', NAME_IDENTIFIER_CLAIM])
}

export function getRoleFromToken(token: string): UserRole | null {
	const payload = decodeJwtPayload(token)
	const role = getStringClaim(payload, ['role', ROLE_CLAIM])

	if (!role) {
		return null
	}

	return mapRoleEnumToUserRole(role)
}

export function getEmailFromToken(token: string) {
	const payload = decodeJwtPayload(token)

	return getStringClaim(payload, ['email', EMAIL_CLAIM])
}

export function isTokenExpired(token: string) {
	const payload = decodeJwtPayload(token)
	const expiresAt = payload?.exp

	if (typeof expiresAt !== 'number') {
		return false
	}

	return Date.now() >= expiresAt * 1000
}
