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
	if (roleEnum === 2 || roleEnum === 'Admin') {
		return 'admin'
	}

	if (roleEnum === 1 || roleEnum === 'Business') {
		return 'business'
	}

	return 'individual'
}
