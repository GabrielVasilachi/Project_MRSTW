// DEV ONLY – safe to delete; not used in production logic
import { setSession } from '../auth/auth.session'
import type { AuthSession } from '../auth/auth.types'
import { paths } from '../routes/paths'

const ACCOUNTS: (AuthSession & { label: string; redirect: string })[] = [
	{ label: 'admin', role: 'admin',      userId: null, email: 'admin@gmail.com', loginAt: '', redirect: paths.Dashboard_Admin },
	{ label: 'p1',    role: 'individual', userId: 'p1', email: 'p1@gmail.com',    loginAt: '', redirect: paths.Dashboard_Individual },
	{ label: 'p2',    role: 'individual', userId: 'p2', email: 'p2@gmail.com',    loginAt: '', redirect: paths.Dashboard_Individual },
	{ label: 'p3',    role: 'individual', userId: 'p3', email: 'p3@gmail.com',    loginAt: '', redirect: paths.Dashboard_Individual },
	{ label: 'p4',    role: 'individual', userId: 'p4', email: 'p4@gmail.com',    loginAt: '', redirect: paths.Dashboard_Individual },
	{ label: 'j1',    role: 'business',   userId: 'j1', email: 'j1@gmail.com',    loginAt: '', redirect: paths.Dashboard_Business },
	{ label: 'j2',    role: 'business',   userId: 'j2', email: 'j2@gmail.com',    loginAt: '', redirect: paths.Dashboard_Business },
	{ label: 'j3',    role: 'business',   userId: 'j3', email: 'j3@gmail.com',    loginAt: '', redirect: paths.Dashboard_Business },
	{ label: 'j4',    role: 'business',   userId: 'j4', email: 'j4@gmail.com',    loginAt: '', redirect: paths.Dashboard_Business },
]

export default function SwitchingUsers() {
	function switchTo(acc: typeof ACCOUNTS[number]) {
		setSession({ role: acc.role, userId: acc.userId, email: acc.email, loginAt: new Date().toISOString() })
		window.location.href = acc.redirect
	}

	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-3 shadow-lg text-xs">
			<span className="mb-1 font-semibold text-gray-400 uppercase tracking-wide">Dev · Switch user</span>
			<div className="flex flex-wrap gap-1">
				{ACCOUNTS.map(acc => (
					<button
						key={acc.label}
						onClick={() => switchTo(acc)}
						className="rounded-md border border-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-100 active:bg-gray-200"
					>
						{acc.label}
					</button>
				))}
			</div>
		</div>
	)
}
