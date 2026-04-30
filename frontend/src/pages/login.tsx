import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../public/images/Logo.svg";

import { login } from "../api/authApi";
import { setSession } from "../auth/auth.session";
import { getDashboardPathByRole, mapRoleEnumToUserRole } from "../auth/auth.utils";

export default function LoginPage() {
	const navigate = useNavigate()
	const [phoneNumber, setPhoneNumber] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [error, setError] = React.useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = React.useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null)
		setIsSubmitting(true)

		try {
			const response = await login({
				phoneNumber: phoneNumber.trim(),
				password: password.trim(),
			})
			const role = mapRoleEnumToUserRole(response.roleEnum)
			const session = {
				role,
				userId: String(response.id),
				email: response.email ?? null,
				phoneNumber: response.phoneNumber,
				fullName: response.fullName,
				token: response.token,
				loginAt: new Date().toISOString(),
				isTemporary: response.isTemporary,
				isPhoneConfirmed: response.isPhoneConfirmed,
			}

			setSession(session)
			navigate(getDashboardPathByRole(role), { replace: true })
		} catch (err: unknown) {
			if (axios.isAxiosError(err) && typeof err.response?.data === 'string') {
				setError(err.response.data)
			} else {
				setError('Număr de telefon sau parolă invalidă')
			}
		} finally {
			setIsSubmitting(false)
		}
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
					<label className="block text-sm font-medium text-slate-700">Număr de telefon</label>
					<input
						type="tel"
						placeholder="+373 6X XXX XXX"
						required
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
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
						disabled={isSubmitting}
						className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded-md shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:bg-sky-300"
					>
						{isSubmitting ? 'Se autentifică...' : 'Autentificare'}
					</button>
				</form>
			</div>
		</div>
	);
};
