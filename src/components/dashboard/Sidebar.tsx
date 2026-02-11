import { NavLink } from 'react-router-dom'

import { paths } from '../../routes/paths'

function linkClass(isActive: boolean) {
	return [
		'block w-full rounded-md px-3 py-2 text-sm text-gray-700',
		isActive ? 'bg-gray-100 font-medium text-gray-900' : 'hover:bg-gray-50',
	].join(' ')
}

function itemClass() {
	return 'block w-full rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left'
}

export default function Sidebar() {
	return (
		<aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
			<div className="flex h-full min-h-0 flex-col p-4">
				<div className="mb-4 text-base font-semibold text-gray-900">COMANDA</div>

				<nav className="flex-1 space-y-1 overflow-y-auto">
					<button type="button" className={itemClass()} aria-disabled="true" title="Neimplementat momentan">
						Caută AWB
					</button>
					<button type="button" className={itemClass()} aria-disabled="true" title="Neimplementat momentan">
						Lista AWB-uri
					</button>
					<button type="button" className={itemClass()} aria-disabled="true" title="Neimplementat momentan">
						AWB-uri p. juridice
					</button>
					<button type="button" className={itemClass()} aria-disabled="true" title="Neimplementat momentan">
						AWB-uri MRN
					</button>

					<div className="py-2" />

					<button type="button" className={itemClass()} aria-disabled="true" title="Neimplementat momentan">
						Comenzi
					</button>
					<button type="button" className={itemClass()} aria-disabled="true" title="Neimplementat momentan">
						Borderou de intrare
					</button>
					<button type="button" className={itemClass()} aria-disabled="true" title="Neimplementat momentan">
						Borderou de ieșire
					</button>
					<button type="button" className={itemClass()} aria-disabled="true" title="Neimplementat momentan">
						Taxe vamale
					</button>

					<div className="py-2" />

					<NavLink to={paths.Dashboard_Admin} end className={({ isActive }) => linkClass(isActive)}>
						Dashboard Admin
					</NavLink>
					<NavLink to={paths.Dashboard_Business} className={({ isActive }) => linkClass(isActive)}>
						Dashboard Business
					</NavLink>
					<NavLink to={paths.Dashboard_Individual} className={({ isActive }) => linkClass(isActive)}>
						Dashboard Individual
					</NavLink>
				</nav>

				<div className="mt-4 border-t border-gray-200 pt-4 space-y-1">
					<NavLink to={paths.DashboardSettings} className={({ isActive }) => linkClass(isActive)}>
						Contul meu
					</NavLink>
					<button type="button" className={itemClass()}>
						Deconectare
					</button>
				</div>
			</div>
		</aside>
	)
}

