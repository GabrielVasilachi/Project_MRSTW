import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export type DashboardProfile = 'business' | 'individual'

type DashboardHeaderProps = {
	title?: string
	value?: DashboardProfile
	onChange?: (next: DashboardProfile) => void
}

export default function Header({ title = 'Dashboard', value, onChange }: DashboardHeaderProps) {
	const location = useLocation()
	const navigate = useNavigate()

	const selected = useMemo<DashboardProfile>(() => {
		if (value) return value
		const params = new URLSearchParams(location.search)
		const profile = params.get('profile')
		return profile === 'individual' ? 'individual' : 'business'
	}, [location.search, value])

	const handleChange = useCallback(
		(next: DashboardProfile) => {
			if (onChange) {
				onChange(next)
				return
			}

			const params = new URLSearchParams(location.search)
			params.set('profile', next)
			navigate({ pathname: location.pathname, search: params.toString() }, { replace: true })
		},
		[location.pathname, location.search, navigate, onChange],
	)

	return (
		<header className="w-full border-b bg-white">
			<div className="flex items-center justify-between px-4 py-3">
				<div className="text-base font-semibold text-gray-900">{title}</div>

				<div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2">
					<span className="text-sm text-gray-600">Profile</span>
					<select
						className="bg-transparent text-sm font-medium text-gray-900 outline-none"
						value={selected}
						onChange={(e) => handleChange(e.target.value as DashboardProfile)}
						aria-label="Select profile type"
					>
						<option value="business">Business</option>
						<option value="individual">Individual</option>
					</select>
				</div>
			</div>
		</header>
	)
}

