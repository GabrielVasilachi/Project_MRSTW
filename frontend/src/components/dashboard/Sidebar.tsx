import { NavLink } from 'react-router-dom'

import { clearSession, getSession } from '../../auth/auth.session'
import { isSetupCompleted } from '../../auth/setup.status'
import { paths } from '../../routes/paths'

function linkClass(isActive: boolean) {
	return [
		'flex items-center justify-between w-full rounded-md px-3 py-2 text-sm text-gray-700',
		isActive ? 'bg-gray-100 font-medium text-gray-900' : 'hover:bg-gray-50',
	].join(' ')
}

type NavItem = { label: string; to?: string; showBadge?: boolean }

const NAV_ITEMS: Record<string, NavItem[]> = {
	admin: [
		{ label: 'Dashboard',          to: paths.Dashboard_Admin },
		{ label: 'Declarații',         to: paths.Admin_Declarations },
		{ label: 'Invoice-uri',        to: paths.Admin_Invoices },
		{ label: 'Utilizatori',        to: paths.Admin_Users },
		{ label: 'Creare Utilizatori', to: paths.Admin_AccountCreations },
		{ label: 'Documente',          to: paths.Admin_Documents },
		{ label: 'Rapoarte',           to: paths.Admin_Reports },
		{ label: 'Audit Log',          to: paths.Admin_AuditLog },
	],
	individual: [
		{ label: 'Dashboard',           to: paths.Dashboard_Individual },
		{ label: 'Declarațiile mele',   to: paths.Individual_Declarations },
		{ label: 'Tracking / Status',   to: paths.Individual_Tracking },
		{ label: 'Plăți',               to: paths.Individual_Payments },
		{ label: 'Documentele mele',    to: paths.Individual_Documents },
		{ label: 'Setări cont',         to: paths.Individual_Settings, showBadge: true },
	],
	business: [
		{ label: 'Dashboard',            to: paths.Dashboard_Business },
		{ label: 'Declarații companie',  to: paths.Business_Declarations },
		{ label: 'Plăți & Facturi',      to: paths.Business_Payments },
		{ label: 'Documente companie',   to: paths.Business_Documents },
		{ label: 'Importuri / Istoric',  to: paths.Business_Imports },
		{ label: 'Setări companie',      to: paths.Business_Settings },
	],
}

export default function Sidebar() {
	const session = getSession()
	const role = session?.role ?? 'individual'
	const items = NAV_ITEMS[role] ?? []

	const renderNavItem = ({ label, to, showBadge }: NavItem) => {
		const userId = session?.userId
		let hasBadge = false

		if (showBadge && role === 'individual' && userId) {
			hasBadge = !isSetupCompleted(userId)
		}

		if (!to) {
			return (
				<button key={label} type="button" className="flex items-center justify-between w-full rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left" aria-disabled="true">
					<span>{label}</span>
					{hasBadge && (
						<span className="w-2 h-2 bg-red-500 rounded-full"></span>
					)}
				</button>
			)
		}

		return (
			<NavLink key={label} to={to} className={({ isActive }) => linkClass(isActive)}>
				<span>{label}</span>
				{hasBadge && (
					<span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
				)}
			</NavLink>
		)
	}

	return (
		<aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
			<div className="flex h-full min-h-0 flex-col p-4">
				<div className="mb-4 text-base font-semibold text-gray-900">MRSTW</div>

				<nav className="flex-1 space-y-1 overflow-y-auto">
					{items.map((item) => renderNavItem(item))}
				</nav>

				<div className="mt-4 border-t border-gray-200 pt-4 space-y-1">
					<NavLink to={paths.LandingPage} onClick={clearSession} className={({ isActive }) => linkClass(isActive)}>
						<span>Deconectare</span>
					</NavLink>
				</div>
			</div>
		</aside>
	)
}

