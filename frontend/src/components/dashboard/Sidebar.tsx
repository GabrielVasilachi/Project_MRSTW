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

type NavIcon = 'dashboard' | 'declarations' | 'users' | 'scan' | 'packages' | 'documents' | 'reports' | 'audit' | 'settings' | 'logout'
type NavItem = { label: string; to?: string; showBadge?: boolean; icon: NavIcon }

type SidebarProps = {
	onNavigate?: () => void
	className?: string
}

const NAV_ITEMS: Record<string, NavItem[]> = {
	admin: [
		{ label: 'Dashboard',          to: paths.Dashboard_Admin, icon: 'dashboard' },
		{ label: 'Declarații',         to: paths.Admin_Declarations, icon: 'declarations' },
		{ label: 'Utilizatori',        to: paths.Admin_Users, icon: 'users' },
		{ label: 'Scanare Colete',     to: paths.Admin_AccountCreations, icon: 'scan' },
		{ label: 'Colete',             to: paths.Admin_Packages, icon: 'packages' },
		{ label: 'Documente',          to: paths.Admin_Documents, icon: 'documents' },
		{ label: 'Rapoarte',           to: paths.Admin_Reports, icon: 'reports' },
		{ label: 'Audit Log',          to: paths.Admin_AuditLog, icon: 'audit' },
	],
	individual: [
		{ label: 'Dashboard',           to: paths.Dashboard_Individual, icon: 'dashboard' },
		{ label: 'Coletele mele',       to: paths.Individual_Packages, icon: 'packages' },
		{ label: 'Declarațiile mele',   to: paths.Individual_Declarations, icon: 'declarations' },
		{ label: 'Documentele mele',    to: paths.Individual_Documents, icon: 'documents' },
		{ label: 'Setări cont',         to: paths.Individual_Settings, showBadge: true, icon: 'settings' },
	],
	business: [
		{ label: 'Dashboard',            to: paths.Dashboard_Business, icon: 'dashboard' },
		{ label: 'Colete companie',      to: paths.Business_Packages, icon: 'packages' },
		{ label: 'Declarații companie',  to: paths.Business_Declarations, icon: 'declarations' },
		{ label: 'Documente companie',   to: paths.Business_Documents, icon: 'documents' },
		{ label: 'Setări companie',      to: paths.Business_Settings, showBadge: true, icon: 'settings' },
	],
}

function SidebarIcon({ icon }: { icon: NavIcon }) {
	const pathsByIcon: Record<NavIcon, string> = {
		dashboard: 'M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z',
		declarations: 'M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5M9 12h8M9 16h8M9 20h5',
		users: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0M18 9.5a3 3 0 0 1 0 5M21 21a5 5 0 0 0-3-4.5',
		scan: 'M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3M8 8h8v8H8V8Zm3 3h2v2h-2v-2Z',
		packages: 'M3 7.5 12 3l9 4.5-9 4.5-9-4.5Zm0 0V16l9 5 9-5V7.5M12 12v9',
		documents: 'M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5M9 13h8M9 17h6',
		reports: 'M5 20V10M12 20V4M19 20v-7',
		audit: 'M12 3l8 4v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Zm-3 9 2 2 4-5',
		settings: 'M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Zm0-13v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
		logout: 'M10 17l5-5-5-5M15 12H3M21 3v18h-8',
	}

	return (
		<svg className="h-4 w-4 shrink-0 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<path d={pathsByIcon[icon]} />
		</svg>
	)
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

	const renderNavItem = ({ label, to, showBadge, icon }: NavItem) => {
		const hasBadge = Boolean(showBadge && hasMissingProfileData)

		if (!to) {
			return (
				<button key={label} type="button" className="flex items-center justify-between w-full rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left" aria-disabled="true">
					<span className="flex min-w-0 items-center gap-2">
						<SidebarIcon icon={icon} />
						<span className="truncate">{label}</span>
					</span>
					{hasBadge && (
						<span className="w-2 h-2 bg-red-500 rounded-full"></span>
					)}
				</button>
			)
		}

		return (
			<NavLink key={label} to={to} onClick={onNavigate} className={({ isActive }) => linkClass(isActive)}>
				<span className="flex min-w-0 items-center gap-2">
					<SidebarIcon icon={icon} />
					<span className="truncate">{label}</span>
				</span>
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
						<span className="flex min-w-0 items-center gap-2">
							<SidebarIcon icon="logout" />
							<span>Deconectare</span>
						</span>
					</NavLink>
				</div>
			</div>
		</aside>
	)
}
