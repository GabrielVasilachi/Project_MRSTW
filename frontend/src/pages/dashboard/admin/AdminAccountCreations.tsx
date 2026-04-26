import { useState } from 'react'
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

async function readApiPayload(response: Response): Promise<unknown> {
	const rawText = await response.text()

	if (!rawText) {
		return null
	}

	try {
		return JSON.parse(rawText)
	} catch {
		return rawText
	}
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

	const [adminName, setAdminName] = useState('')
	const [adminPhoneNumber, setAdminPhoneNumber] = useState('')
	const [adminEmail, setAdminEmail] = useState('')

	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setSuccessMessage(null)
		setErrorMessage(null)
		setIsSubmitting(true)

		try {
			if (role === 'individual') {
				const response = await fetch(`${API_URL}/packages/scan-physical-profiles`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						trackingCode: individualsPackageID.trim(),
						fullName: individualFullName.trim(),
						locationAdress: individualAddress.trim(),
						phoneNumber: individualPhoneNumber.trim()
					})
				})

				const data = await readApiPayload(response)

				if (!response.ok) {
					throw new Error(getApiMessage(data, 'Nu s-a putut crea contul individual.'))
				}

				setSuccessMessage(getApiMessage(data, 'Contul individual a fost creat cu succes.'))
			} else if (role === 'business') {
				const response = await fetch(`${API_URL}/packages/scan-business-profiles`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						trackingCode: businessPackageID.trim(),
						companyName: businessCompanyName.trim(),
						locationAdress: businessLegalAddress.trim(),
						phoneNumber: businessPhoneNumber.trim(),
						contactPerson: businessContactPerson.trim() || null
					})
				})

				const data = await readApiPayload(response)

				if (!response.ok) {
					throw new Error(getApiMessage(data, 'Nu s-a putut crea contul business.'))
				}

				setSuccessMessage(getApiMessage(data, 'Contul business a fost creat cu succes.'))
			} else if (role === 'admin') {
				const response = await fetch(`${API_URL}/users`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						fullName: adminName.trim(),
						phoneNumber: adminPhoneNumber.trim(),
						email: adminEmail.trim()
					})
				})

				const data = await readApiPayload(response)

				if (!response.ok) {
					throw new Error(getApiMessage(data, 'Nu s-a putut crea contul admin.'))
				}

				setSuccessMessage(getApiMessage(data, 'Contul admin a fost creat cu succes.'))
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
			setAdminName('')
			setAdminPhoneNumber('')
			setAdminEmail('')
		} catch (error) {
			if (error instanceof Error) {
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
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Creare cont</h1>
				<p className="mt-1 text-sm text-gray-500">
					Creaza cont pentru utilizatorii mentionati de pe coletul vamal.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 space-y-4 max-w-xl">
				<div>
					<label className="block text-sm font-medium text-gray-700">Rol</label>
					<select
						value={role}
						onChange={(e) => setRole(e.target.value as UserRole)}
						className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
					>
						<option className='bg-gray-50' value="individual">individual</option>
						<option value="business">business</option>
						<option value="admin">admin</option>
					</select>
				</div>

				{role === 'individual' && (
					<>
						<div>
							<label className="block text-sm font-medium text-gray-700">Package ID</label>
							<input
								value={individualsPackageID}
								onChange={(e) => setIndividualsPackageID(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="ex: RB123456789"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Full Name</label>
							<input
								type="text"
								value={individualFullName}
								onChange={(e) => setIndividualFullName(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="ex: Popescu Andrei"
								required
							/>
						</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">Location Address</label>
								<input
									type="text"
									value={individualAddress}
									onChange={(e) => setIndividualAddress(e.target.value)}
									className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
									placeholder="ex: Str. Dacia 20, Chisinau"
									required
								/>
							</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Phone Number</label>
							<input
								type="tel"
								value={individualPhoneNumber}
								onChange={(e) => setIndividualPhoneNumber(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="+37368914512"
								required
							/>
						</div>
					</>
				)}

				{role === 'business' && (
					<>
						<div>
							<label className="block text-sm font-medium text-gray-700">Package ID</label>
							<input
								value={businessPackageID}
								onChange={(e) => setBusinessPackageID(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="ex: RB123456789"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Company Name</label>
							<input
								type="text"
								value={businessCompanyName}
								onChange={(e) => setBusinessCompanyName(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="ex: Tech Solutions SRL"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Location Address</label>
							<input
								type="text"
								value={businessLegalAddress}
								onChange={(e) => setBusinessLegalAddress(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="ex: Str. Dacia 20, Chisinau"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Phone Number</label>
							<input
								type="tel"
								value={businessPhoneNumber}
								onChange={(e) => setBusinessPhoneNumber(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="+37368916121"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Contact Person</label>
							<input
								type="text"
								value={businessContactPerson}
								onChange={(e) => setBusinessContactPerson(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="ex: Ionescu Maria"
							/>
						</div>
					</>
				)}

				{role === 'admin' && (
					<>
						<div>
							<label className="block text-sm font-medium text-gray-700">Name</label>
							<input
								type="text"
								value={adminName}
								onChange={(e) => setAdminName(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="ex: Popescu Adrian"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Număr de telefon</label>
							<input
								type="tel"
								value={adminPhoneNumber}
								onChange={(e) => setAdminPhoneNumber(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="+37368916121"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Email</label>
							<input
								type="email"
								value={adminEmail}
								onChange={(e) => setAdminEmail(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="exemplu@email.com"
								required
							/>
						</div>
					</>
				)}

				{errorMessage ? (
					<div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</div>
				) : null}
				{successMessage ? (
					<div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</div>
				) : null}

				<div className="pt-2">
					<button
						type="submit"
						disabled={isSubmitting}
						className="rounded-lg bg-blue-700 px-6 py-3 text-base font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-blue-300"
					>
						{isSubmitting ? 'Se creeaza...' : 'Creează'}
					</button>
				</div>
			</form>
		</div>
	)
}
