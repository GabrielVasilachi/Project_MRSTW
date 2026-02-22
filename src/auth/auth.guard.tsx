import { Navigate, useLocation } from 'react-router-dom'

import { paths } from '../routes/paths'
import { getDashboardPathByRole } from './auth.mock'
import { getSession } from './auth.session'
import type { UserRole } from './auth.types'

type Props = {
	allowedRoles?: UserRole[]
	children: React.ReactNode
}

export default function AuthGuard({ allowedRoles, children }: Props) {
	const location = useLocation()
	const session = getSession()

	if (!session) {
		return <Navigate to={paths.LoginPage} replace state={{ from: location.pathname }} />
	}

	if (allowedRoles && !allowedRoles.includes(session.role)) {
		return <Navigate to={getDashboardPathByRole(session.role)} replace />
	}

	return <>{children}</>
}
