import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { createAdminProfile } from '../../../api/adminProfilesApi'
import { scanBusinessProfiles, scanPhysicalProfiles } from '../../../api/packagesApi'
import type { UserRole } from '../../../auth/auth.types'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5242/api'

function getApiMessage(payload: unknown, fallback: string): string {
	if (typeof payload === 'string' && payload.trim().length > 0) {
		return payload
	}

	if (payload && typeof payload === 'object' && 'message' in payload) {
		const message = (payload as { message?: unknown }).message

		if (typeof message === 'string' && message.trim().length > 0) {
			return message
		}
	}

	return fallback
}

export default function AdminAccountCreations() {
	const [role, setRole] = useState<UserRole>('individual')

	const [individualsPackageID, setIndividualsPackageID] = useState('')
	const [individualFullName, setIndividualFullName] = useState('')
	const [individualAddress, setIndividualAddress] = useState('')
	const [individualPhoneNumber, setIndividualPhoneNumber] = useState('')

	const [businessPackageID, setBusinessPackageID] = useState('')
	const [businessCompanyName, setBusinessCompanyName] = useState('')
	const [businessLegalAddress, setBusinessLegalAddress] = useState('')
	const [businessPhoneNumber, setBusinessPhoneNumber] = useState('')
	const [businessContactPerson, setBusinessContactPerson] = useState('')

	const [adminPhoneNumber, setAdminPhoneNumber] = useState('')
	const [adminPassword, setAdminPassword] = useState('')
	const [showAdminPassword, setShowAdminPassword] = useState(false)

	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [activationLink, setActivationLink] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	function handleReset() {
		setIndividualsPackageID('')
		setIndividualFullName('')
		setIndividualAddress('')
		setIndividualPhoneNumber('')
		setBusinessPackageID('')
		setBusinessCompanyName('')
		setBusinessLegalAddress('')
		setBusinessPhoneNumber('')
		setBusinessContactPerson('')
		setAdminPhoneNumber('')
		setAdminPassword('')
		setShowAdminPassword(false)
		setSuccessMessage(null)
		setErrorMessage(null)
		setActivationLink(null)
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()
		setSuccessMessage(null)
		setErrorMessage(null)
		setActivationLink(null)
		setIsSubmitting(true)

		try {
			if (role === 'individual') {
				const data = await scanPhysicalProfiles({
					trackingCode: individualsPackageID.trim(),
					fullName: individualFullName.trim(),
					locationAdress: individualAddress.trim(),
					phoneNumber: individualPhoneNumber.trim()
				})

				setSuccessMessage(getApiMessage(data, 'Contul individual a fost creat cu succes.'))
				setActivationLink(data.activationLink ?? null)
			} else if (role === 'business') {
				const data = await scanBusinessProfiles({
					trackingCode: businessPackageID.trim(),
					companyName: businessCompanyName.trim(),
					locationAdress: businessLegalAddress.trim(),
					phoneNumber: businessPhoneNumber.trim(),
					contactPerson: businessContactPerson.trim() || null
				})

				setSuccessMessage(getApiMessage(data, 'Contul business a fost creat cu succes.'))
				setActivationLink(data.activationLink ?? null)
			} else if (role === 'admin') {
				await createAdminProfile({
					phoneNumber: adminPhoneNumber.trim(),
					password: adminPassword.trim()
				})

				setSuccessMessage('Contul admin a fost creat cu succes. Te poți autentifica folosind numărul de telefon și parola setată.')
			}

			setIndividualsPackageID('')
			setIndividualFullName('')
			setIndividualAddress('')
			setIndividualPhoneNumber('')
			setBusinessPackageID('')
			setBusinessCompanyName('')
			setBusinessLegalAddress('')
			setBusinessPhoneNumber('')
			setBusinessContactPerson('')
			setAdminPhoneNumber('')
			setAdminPassword('')
		} catch (error) {
			if (axios.isAxiosError(error) && typeof error.response?.data === 'string') {
				setErrorMessage(error.response.data)
			} else if (axios.isAxiosError(error) && error.response?.data) {
				setErrorMessage(getApiMessage(error.response.data, 'Nu s-a putut crea contul.'))
			} else if (axios.isAxiosError(error) && !error.response) {
				setErrorMessage(`Nu s-a putut realiza conexiunea cu serverul API (${API_URL}). Verifica daca backend-ul ruleaza.`)
			} else if (error instanceof Error) {
				if (error.message.toLowerCase().includes('failed to fetch')) {
					setErrorMessage(`Nu s-a putut realiza conexiunea cu serverul API (${API_URL}). Verifica daca backend-ul ruleaza.`)
				} else {
					setErrorMessage(error.message)
				}
			} else {
				setErrorMessage('A aparut o eroare neasteptata.')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="flex justify-center px-4 py-8">
			<div className="w-full max-w-3xl space-y-6">
				<div>
					<h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Creare Utilizator Nou</h1>
					<p className="mt-2 text-sm text-slate-500">
						Completeaza informatiile pentru a adauga un utilizator nou in sistem. Toate campurile marcate sunt obligatorii.
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
				>
					<div className="space-y-6">
						{(role === 'individual' || role === 'business') && (
							<section className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/40 p-4">
								<div className="flex items-start gap-3">
									<div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
										<svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
											<path
												fill="currentColor"
												d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 14.5h-2v-2h2Zm0-4h-2V7h2Z"
											/>
										</svg>
									</div>
									<div>
										<h2 className="text-sm font-semibold text-slate-900">Informatii Pachet</h2>
										<p className="text-xs text-slate-500">
											Introduceti ID-ul pachetului asociat acestui utilizator.
										</p>
									</div>
								</div>

								<div>
									<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">ID Pachet</label>
									<div className="relative mt-2">
										<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
											<svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
												<path
													fill="currentColor"
													d="M15.5 14h-.8l-.3-.3a6 6 0 1 0-.8.8l.3.3v.7L20 21l1-1Zm-5.5 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
												/>
											</svg>
										</span>
										<input
											value={role === 'individual' ? individualsPackageID : businessPackageID}
											onChange={(e) =>
												role === 'individual'
													? setIndividualsPackageID(e.target.value)
													: setBusinessPackageID(e.target.value)
											}
											className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
											placeholder="ex. PKG-2024-00123"
											required
										/>
									</div>
								</div>
							</section>
						)}

						<section className="space-y-4 rounded-xl border border-slate-100 bg-white p-4">
							<div className="flex items-start gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
									<svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
										<path
											fill="currentColor"
											d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4Z"
										/>
									</svg>
								</div>
								<div>
									<h2 className="text-sm font-semibold text-slate-900">Informatii Utilizator</h2>
									<p className="text-xs text-slate-500">
										Completati datele utilizatorului in functie de tipul contului.
									</p>
								</div>
							</div>

							<div>
								<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Rol</label>
								<select
									value={role}
									onChange={(e) => setRole(e.target.value as UserRole)}
									className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
								>
									<option className="bg-gray-50" value="individual">persoana fizica</option>
									<option value="business">business</option>
									<option value="admin">admin</option>
								</select>
							</div>

							{role === 'individual' && (
								<div className="grid gap-4 md:grid-cols-2">
									<div className="md:col-span-2">
										<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Nume complet</label>
										<input
											type="text"
											value={individualFullName}
											onChange={(e) => setIndividualFullName(e.target.value)}
											className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
											placeholder="ex. Ion Popescu"
											required
										/>
									</div>

									<div className="md:col-span-2">
										<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Adresa</label>
										<input
											type="text"
											value={individualAddress}
											onChange={(e) => setIndividualAddress(e.target.value)}
											className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
											placeholder="ex. Str. Dacia 20, Chisinau"
											required
										/>
									</div>

									<div>
										<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Telefon</label>
										<input
											type="tel"
											value={individualPhoneNumber}
											onChange={(e) => setIndividualPhoneNumber(e.target.value)}
											className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
											placeholder="+37368914512"
											required
										/>
									</div>
								</div>
							)}

							{role === 'business' && (
								<div className="grid gap-4 md:grid-cols-2">
									<div className="md:col-span-2">
										<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Denumire companie</label>
										<input
											type="text"
											value={businessCompanyName}
											onChange={(e) => setBusinessCompanyName(e.target.value)}
											className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
											placeholder="ex. Tech Solutions SRL"
											required
										/>
									</div>

									<div className="md:col-span-2">
										<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Adresa</label>
										<input
											type="text"
											value={businessLegalAddress}
											onChange={(e) => setBusinessLegalAddress(e.target.value)}
											className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
											placeholder="ex. Str. Dacia 20, Chisinau"
											required
										/>
									</div>

									<div>
										<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Telefon</label>
										<input
											type="tel"
											value={businessPhoneNumber}
											onChange={(e) => setBusinessPhoneNumber(e.target.value)}
											className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
											placeholder="+37368916121"
											required
										/>
									</div>

									<div>
										<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Persoana contact</label>
										<input
											type="text"
											value={businessContactPerson}
											onChange={(e) => setBusinessContactPerson(e.target.value)}
											className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
											placeholder="ex. Ionescu Maria"
										/>
									</div>
								</div>
							)}

							{role === 'admin' && (
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Telefon</label>
										<input
											type="tel"
											value={adminPhoneNumber}
											onChange={(e) => setAdminPhoneNumber(e.target.value)}
											className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
											placeholder="+37368916121"
											required
										/>
									</div>

									<div>
										<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Parola admin</label>
										<div className="relative mt-2">
											<input
												type={showAdminPassword ? 'text' : 'password'}
												value={adminPassword}
												onChange={(e) => setAdminPassword(e.target.value)}
												className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-11 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
												placeholder="Seteaza parola contului admin"
												required
											/>
											<button
												type="button"
												onClick={() => setShowAdminPassword((prev) => !prev)}
												className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-slate-100"
												aria-label={showAdminPassword ? 'Ascunde parola' : 'Afiseaza parola'}
											>
												<img
													src={showAdminPassword ? '/images/noviewpass.svg' : '/images/viewpass.svg'}
													alt=""
													className="h-5 w-5"
												/>
											</button>
										</div>
									</div>
								</div>
							)}
						</section>

						{errorMessage ? (
							<div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
								{errorMessage}
							</div>
						) : null}
						{successMessage ? (
							<div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
								{successMessage}
							</div>
						) : null}
						{activationLink ? (
							<div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
								<p className="font-medium">Link activare cont:</p>
								<a href={activationLink} target="_blank" rel="noreferrer" className="mt-1 block break-all underline">
									{activationLink}
								</a>
							</div>
						) : null}

						<div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
							<button
								type="button"
								onClick={handleReset}
								className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
							>
								Reset
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
							>
								{isSubmitting ? 'Se creeaza...' : 'Creeaza Utilizator'}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
