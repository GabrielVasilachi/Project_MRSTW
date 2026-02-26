import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../public/images/Logo.svg";

import { getDashboardPathByRole, loginMock } from "../auth/auth.mock";
import { setSession } from "../auth/auth.session";

export default function LoginPage() {
	const navigate = useNavigate()
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [error, setError] = React.useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null)

		const result = await loginMock(email, password)
		if (!result.ok) {
			setError(result.error)
			return
		}

		setSession(result.session)
		navigate(getDashboardPathByRole(result.session.role), { replace: true })
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
			<div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-8">
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 rounded-md bg-slate-100 flex items-center justify-center">
						{/* cube icon */}
						<img src={Logo} alt="Logo" className="w-6 h-6" />
					</div>

					<h1 className="text-2xl font-semibold text-slate-800">Autentificare</h1>
					<p className="text-sm text-slate-500">Accesați contul dvs. Portal Vamal</p>
				</div>

				<form onSubmit={handleSubmit} className="mt-6">
					<label className="block text-sm font-medium text-slate-700">Email</label>
					<input
						type="email"
						placeholder="exemplu@email.com"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
					/>

					<div className="flex items-center justify-between mt-4">
						<label className="block text-sm font-medium text-slate-700">Parolă</label>
						<Link to="#" className="text-sm text-sky-600 hover:underline">Ai uitat parola?</Link>
					</div>

					<input
						type="password"
						placeholder="********"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
					/>

					{error ? (
						<div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
							{error}
						</div>
					) : null}

					<button
						type="submit"
						className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded-md shadow-sm cursor-pointer"
					>
						Autentificare
					</button>
				</form>

				<div className="mt-6 text-center text-sm text-slate-600">
					Nu aveți cont? <Link to="#" className="text-sky-600 hover:underline">Înregistrați-vă</Link>
				</div>
			</div>
		</div>
	);
};

