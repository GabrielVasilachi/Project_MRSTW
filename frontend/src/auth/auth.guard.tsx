import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { paths } from '../routes/paths'
import { clearSession, getSession } from './auth.session'
import type { UserRole } from './auth.types'
import { getRoleFromToken, isTokenExpired } from './auth.utils'

type Props = {
	allowedRoles?: UserRole[]
	children: ReactNode
}

export default function AuthGuard({ allowedRoles, children }: Props) {
	const location = useLocation()
	const session = getSession()

	if (!session?.token) {
		return <Navigate to={paths.LoginPage} replace state={{ from: location.pathname }} />
	}

	if (isTokenExpired(session.token)) {
		clearSession()
		return <Navigate to={paths.LoginPage} replace state={{ from: location.pathname }} />
	}

	const role = getRoleFromToken(session.token) ?? session.role

	if (allowedRoles && !allowedRoles.includes(role)) {
		return <Navigate to={paths.Forbidden} replace />
	}

	return <>{children}</>
}
