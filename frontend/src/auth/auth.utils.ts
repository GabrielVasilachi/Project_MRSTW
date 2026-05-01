import { paths } from '../routes/paths'
import type { UserRole } from './auth.types'

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
