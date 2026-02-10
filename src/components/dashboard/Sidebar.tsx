import { NavLink } from 'react-router-dom'

function linkClass(isActive: boolean) {
	return [
		'block w-full text-left rounded px-3 py-2 text-sm',
		isActive ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50',
	].join(' ')
}

export default function Sidebar() {
	return (
		<aside className="w-56 min-h-screen border-r bg-white p-4">
			<div className="text-lg font-semibold mb-4">Dashboard</div>
			<nav className="space-y-2">
				<NavLink to="/dashboard" end className={({ isActive }) => linkClass(isActive)}>
					Main
				</NavLink>

				<NavLink to="/dashboard/settings" className={({ isActive }) => linkClass(isActive)}>
					Settings
				</NavLink>
			</nav>
		</aside>
	)
}

