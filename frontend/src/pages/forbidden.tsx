import { Link } from 'react-router-dom'
import { paths } from '../routes/paths'

export default function ForbiddenPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
			<div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
				<p className="text-sm font-medium text-red-600">403 Forbidden</p>
				<h1 className="mt-2 text-2xl font-semibold text-slate-900">Acces interzis</h1>
				<p className="mt-3 text-sm text-slate-500">
					Contul autentificat nu are rolul necesar pentru această pagină.
				</p>
				<Link
					to={paths.LoginPage}
					className="mt-6 inline-flex rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
				>
					Înapoi la autentificare
				</Link>
			</div>
		</div>
	)
}
