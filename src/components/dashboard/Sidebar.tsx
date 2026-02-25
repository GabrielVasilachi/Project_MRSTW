import { NavLink } from 'react-router-dom'

import { clearSession, getSession } from '../../auth/auth.session'
import { paths } from '../../routes/paths'

function linkClass(isActive: boolean) {
	return [
		'block w-full rounded-md px-3 py-2 text-sm text-gray-700',
		isActive ? 'bg-gray-100 font-medium text-gray-900' : 'hover:bg-gray-50',
	].join(' ')
}

const NAV_ITEMS: Record<string, { label: string; to?: string }[]> = {
	admin: [
		{ label: 'Dashboard', to: paths.Dashboard_Admin },
		{ label: 'Declarații', to: paths.Admin_Declarations },
		{ label: 'Utilizatori', to: paths.Admin_Users },
		{ label: 'Plăți', to: paths.Admin_Payments },
		{ label: 'Rapoarte', to: paths.Admin_Reports },
		{ label: 'Setări', to: paths.DashboardSettings },
	],
	individual: [
		{ label: 'Dashboard', to: paths.Dashboard_Individual },
		{ label: 'Declarațiile mele', to: paths.Individual_Declarations },
		{ label: 'Tracking / Status', to: paths.Individual_Tracking },
		{ label: 'Plăți', to: paths.Individual_Payments },
		{ label: 'Profil', to: paths.Individual_Profile },
	],
	business: [
		{ label: 'Dashboard', to: paths.Dashboard_Business },
		{ label: 'Declarațiile mele', to: paths.Business_Declarations },
		{ label: 'Tracking / Status', to: paths.Business_Tracking },
		{ label: 'Plăți', to: paths.Business_Payments },
		{ label: 'Profil', to: paths.Business_Profile },
	],
}

export default function Sidebar() {
	const role = getSession()?.role ?? 'individual'
	const items = NAV_ITEMS[role] ?? []

	return (
		<aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
			<div className="flex h-full min-h-0 flex-col p-4">
				<div className="mb-4 text-base font-semibold text-gray-900">MRSTW</div>

				<nav className="flex-1 space-y-1 overflow-y-auto">
					{items.map(({ label, to }) =>
						to ? (
							<NavLink key={label} to={to} className={({ isActive }) => linkClass(isActive)}>
								{label}
							</NavLink>
						) : (
							<button key={label} type="button" className="block w-full rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left" aria-disabled="true" title="Neimplementat momentan">
								{label}
							</button>
						)
					)}
				</nav>

				<div className="mt-4 border-t border-gray-200 pt-4 space-y-1">
					<NavLink to={paths.LandingPage} onClick={clearSession} className={({ isActive }) => linkClass(isActive)}>
						Deconectare
					</NavLink>
				</div>
			</div>
		</aside>
	)
}

