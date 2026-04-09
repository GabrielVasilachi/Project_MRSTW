import { useState } from 'react'

import { createUserAccount } from '../../../auth/auth.mock'
import type { UserRole } from '../../../auth/auth.types'

export default function AdminAccountCreations() {
	const [role, setRole] = useState<UserRole>('individual')
	
	// Individual fields
	const [individualsPackageID, setIndividualsPackageID] = useState('')
	const [individualFullName, setIndividualFullName] = useState('')
	const [individualPhoneNumber, setIndividualPhoneNumber] = useState('')

	// Business fields
	const [businessPackageID, setBusinessPackageID] = useState('')
	const [businessCompanyName, setBusinessCompanyName] = useState('')
	const [businessFiscalCode, setBusinessFiscalCode] = useState('')
	const [businessLegalAddress, setBusinessLegalAddress] = useState('')
	const [businessContactPerson, setBusinessContactPerson] = useState('')
	const [businessPhoneNumber, setBusinessPhoneNumber] = useState('')

	// Admin fields
	const [adminName, setAdminName] = useState('')
	const [adminPhoneNumber, setAdminPhoneNumber] = useState('')
	const [adminEmail, setAdminEmail] = useState('')

	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setSuccessMessage(null)
		setErrorMessage(null)

		const result = createUserAccount({
			role,
			email: role === 'admin' ? adminEmail : role === 'business' ? businessCompanyName : individualFullName,
			phoneNumber: role === 'individual' ? individualPhoneNumber : role === 'business' ? businessPhoneNumber : adminPhoneNumber,
			packageID: role === 'individual' ? individualsPackageID : businessPackageID
		})

		if (!result.ok) {
			setErrorMessage(result.error)
			return
		}

		setSuccessMessage('Cont creat cu succes!')
		
		// Reset all fields
		setIndividualsPackageID('')
		setIndividualFullName('')
		setIndividualPhoneNumber('')
		setBusinessPackageID('')
		setBusinessCompanyName('')
		setBusinessFiscalCode('')
		setBusinessLegalAddress('')
		setBusinessContactPerson('')
		setBusinessPhoneNumber('')
		setAdminName('')
		setAdminPhoneNumber('')
		setAdminEmail('')
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Creare cont</h1>
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

				{/* Individual Fields */}
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
							<label className="block text-sm font-medium text-gray-700">Număr de telefon</label>
							<input
								type="tel"
								value={individualPhoneNumber}
								onChange={(e) => setIndividualPhoneNumber(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="+37368916121"
								required
							/>
						</div>
					</>
				)}

				{/* Business Fields */}
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
							<label className="block text-sm font-medium text-gray-700">Fiscal Code</label>
							<input
								type="text"
								value={businessFiscalCode}
								onChange={(e) => setBusinessFiscalCode(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="ex: 1234567890"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Legal Address</label>
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
							<label className="block text-sm font-medium text-gray-700">Persoana de contact</label>
							<input
								type="text"
								value={businessContactPerson}
								onChange={(e) => setBusinessContactPerson(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="ex: Ionescu Maria"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Număr de telefon</label>
							<input
								type="tel"
								value={businessPhoneNumber}
								onChange={(e) => setBusinessPhoneNumber(e.target.value)}
								className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
								placeholder="+37368916121"
								required
							/>
						</div>
					</>
				)}

				{/* Admin Fields */}
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
						className="rounded-lg bg-blue-700 px-6 py-3 text-base font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer"
					>
						Creează
					</button>
				</div>
			</form>
		</div>
	)
}

