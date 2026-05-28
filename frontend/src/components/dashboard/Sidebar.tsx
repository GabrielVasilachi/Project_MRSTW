import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { getBusinessProfileByUserId, getPhysicalProfileByUserId } from '../../api/profilesApi'
import { clearSession, getSession } from '../../auth/auth.session'
import { paths } from '../../routes/paths'
import { hasMissingBusinessProfileData, hasMissingPhysicalProfileData } from '../../utils/profileValidation'

function linkClass(isActive: boolean) {
	return [
		'flex items-center justify-between w-full rounded-md px-3 py-2 text-sm text-gray-700',
		isActive ? 'bg-gray-100 font-medium text-gray-900' : 'hover:bg-gray-50',
	].join(' ')
}

type NavItem = { label: string; to?: string; showBadge?: boolean }

type SidebarProps = {
	onNavigate?: () => void
	className?: string
}

const NAV_ITEMS: Record<string, NavItem[]> = {
	admin: [
		{ label: 'Dashboard',          to: paths.Dashboard_Admin },
		{ label: 'Declarații',         to: paths.Admin_Declarations },
		{ label: 'Utilizatori',        to: paths.Admin_Users },
		{ label: 'Scanare Colete',     to: paths.Admin_AccountCreations },
		{ label: 'Colete',             to: paths.Admin_Packages },
		{ label: 'Documente',          to: paths.Admin_Documents },
		{ label: 'Rapoarte',           to: paths.Admin_Reports },
		{ label: 'Audit Log',          to: paths.Admin_AuditLog },
	],
	individual: [
		{ label: 'Dashboard',           to: paths.Dashboard_Individual },
		{ label: 'Coletele mele',       to: paths.Individual_Packages },
		{ label: 'Declarațiile mele',   to: paths.Individual_Declarations },
		{ label: 'Documentele mele',    to: paths.Individual_Documents },
		{ label: 'Setări cont',         to: paths.Individual_Settings, showBadge: true },
	],
	business: [
		{ label: 'Dashboard',            to: paths.Dashboard_Business },
		{ label: 'Colete companie',      to: paths.Business_Packages },
		{ label: 'Declarații companie',  to: paths.Business_Declarations },
		{ label: 'Documente companie',   to: paths.Business_Documents },
		{ label: 'Setări companie',      to: paths.Business_Settings, showBadge: true },
	],
}

export default function Sidebar({ onNavigate, className = '' }: SidebarProps) {
	const session = getSession()
	const role = session?.role ?? 'individual'
	const parsedUserId = session?.userId ? Number(session.userId) : null
	const userId = parsedUserId && Number.isFinite(parsedUserId) ? parsedUserId : null
	const items = NAV_ITEMS[role] ?? []
	const profileStatusKey = `${role}:${userId ?? ''}`
	const [profileStatus, setProfileStatus] = useState<{ key: string; hasMissingProfileData: boolean } | null>(null)
	const hasMissingProfileData = profileStatus?.key === profileStatusKey
		? profileStatus.hasMissingProfileData
		: false

	useEffect(() => {
		let ignore = false

		async function loadProfileStatus() {
			try {
				if (role === 'individual' && userId) {
					const profile = await getPhysicalProfileByUserId(userId)

					if (!ignore) {
						setProfileStatus({
							key: profileStatusKey,
							hasMissingProfileData: hasMissingPhysicalProfileData(profile),
						})
					}
				}

				if (role === 'business' && userId) {
					const profile = await getBusinessProfileByUserId(userId)

					if (!ignore) {
						setProfileStatus({
							key: profileStatusKey,
							hasMissingProfileData: hasMissingBusinessProfileData(profile),
						})
					}
				}
			} catch {
				if (!ignore) {
					setProfileStatus({
						key: profileStatusKey,
						hasMissingProfileData: false,
					})
				}
			}
		}

		loadProfileStatus()
		window.addEventListener('profile-updated', loadProfileStatus)

		return () => {
			window.removeEventListener('profile-updated', loadProfileStatus)
			ignore = true
		}
	}, [profileStatusKey, role, userId])

	const renderNavItem = ({ label, to, showBadge }: NavItem) => {
		const hasBadge = Boolean(showBadge && hasMissingProfileData)

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
			<NavLink key={label} to={to} onClick={onNavigate} className={({ isActive }) => linkClass(isActive)}>
				<span>{label}</span>
				{hasBadge && (
					<span className="w-2 h-2 bg-red-500 rounded-full shrink-0"></span>
				)}
			</NavLink>
		)
	}

	return (
		<aside className={`w-64 shrink-0 border-r border-gray-200 bg-white ${className}`}>
			<div className="flex h-full min-h-0 flex-col p-4">
				<div className="mb-4 text-base font-semibold text-gray-900">MRSTW</div>

				<nav className="flex-1 space-y-1 overflow-y-auto">
					{items.map((item) => renderNavItem(item))}
				</nav>

				<div className="mt-4 border-t border-gray-200 pt-4 space-y-1">
					<NavLink
						to={paths.LandingPage}
						onClick={() => {
							clearSession()
							onNavigate?.()
						}}
						className={({ isActive }) => linkClass(isActive)}
					>
						<span>Deconectare</span>
					</NavLink>
				</div>
			</div>
		</aside>
	)
}
