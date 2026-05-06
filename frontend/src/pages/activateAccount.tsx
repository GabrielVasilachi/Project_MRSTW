import React from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import Logo from "../../public/images/Logo.svg";

import { setPassword } from "../api/authApi";
import { paths } from "../routes/paths";

export default function ActivateAccountPage() {
	const [searchParams] = useSearchParams()
	const token = searchParams.get('token')?.trim() ?? ''
	const [password, setPasswordValue] = React.useState('')
	const [confirmPassword, setConfirmPassword] = React.useState('')
	const [showPassword, setShowPassword] = React.useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
	const [error, setError] = React.useState<string | null>(token ? null : 'Tokenul de activare lipsește.')
	const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = React.useState(false)
	const isFormDisabled = !token || Boolean(successMessage)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setSuccessMessage(null)

		if (!token) {
			setError('Tokenul de activare lipsește.')
			return
		}

		if (!password.trim()) {
			setError('Parola este obligatorie.')
			return
		}

		if (password.length < 8) {
			setError('Parola trebuie să conțină cel puțin 8 caractere.')
			return
		}

		if (password !== confirmPassword) {
			setError('Parolele nu se potrivesc.')
			return
		}

		setIsSubmitting(true)

		try {
			const response = await setPassword({
				token,
				password,
			})

			setPasswordValue('')
			setConfirmPassword('')
			setSuccessMessage(response || 'Contul a fost activat cu succes.')
		} catch (err: unknown) {
			if (axios.isAxiosError(err) && typeof err.response?.data === 'string') {
				setError(err.response.data)
			} else {
				setError('Nu s-a putut activa contul.')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
			<div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-8">
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 rounded-md bg-slate-100 flex items-center justify-center">
						<img src={Logo} alt="Logo" className="w-6 h-6" />
					</div>

					<h1 className="text-2xl font-semibold text-slate-800">Activare cont</h1>
					<p className="text-sm text-slate-500">Setați parola pentru contul dvs. Portal Vamal</p>
				</div>

				<form onSubmit={handleSubmit} className="mt-6">
					<label className="block text-sm font-medium text-slate-700">Parolă</label>
					<div className="relative mt-2">
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Minim 8 caractere"
							required
							value={password}
							onChange={(e) => setPasswordValue(e.target.value)}
							disabled={isFormDisabled}
							className="w-full px-3 py-2 pr-11 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-slate-50"
						/>
						<button
							type="button"
							onClick={() => setShowPassword((prev) => !prev)}
							disabled={isFormDisabled}
							className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-slate-100 disabled:opacity-50"
							aria-label={showPassword ? "Ascunde parola" : "Afiseaza parola"}
						>
							<img
								src={showPassword ? "/images/noviewpass.svg" : "/images/viewpass.svg"}
								alt=""
								className="h-5 w-5"
							/>
						</button>
					</div>

					<label className="mt-4 block text-sm font-medium text-slate-700">Confirmă parola</label>
					<div className="relative mt-2">
						<input
							type={showConfirmPassword ? "text" : "password"}
							placeholder="Reintroduceți parola"
							required
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							disabled={isFormDisabled}
							className="w-full px-3 py-2 pr-11 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-slate-50"
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword((prev) => !prev)}
							disabled={isFormDisabled}
							className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-slate-100 disabled:opacity-50"
							aria-label={showConfirmPassword ? "Ascunde parola" : "Afiseaza parola"}
						>
							<img
								src={showConfirmPassword ? "/images/noviewpass.svg" : "/images/viewpass.svg"}
								alt=""
								className="h-5 w-5"
							/>
						</button>
					</div>

					{error ? (
						<div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
							{error}
						</div>
					) : null}

					{successMessage ? (
						<div className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
							{successMessage}
						</div>
					) : null}

					<button
						type="submit"
						disabled={isSubmitting || isFormDisabled}
						className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded-md shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:bg-sky-300"
					>
						{isSubmitting ? 'Se activează...' : 'Activează contul'}
					</button>
				</form>

				<div className="mt-4 text-center text-sm text-slate-600">
					Aveți deja cont activ? <Link to={paths.LoginPage} className="text-sky-600 hover:underline">Autentificați-vă</Link>
				</div>
			</div>
		</div>
	)
}
