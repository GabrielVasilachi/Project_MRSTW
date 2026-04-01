import { useState } from 'react'

import { createUserAccount } from '../../../auth/auth.mock'
import type { UserRole } from '../../../auth/auth.types'

export default function AdminAccountCreations() {
	const [role, setRole] = useState<UserRole>('individual')
	const [email, setEmail] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
    const [packageID, setPackageID] = useState('')
	

	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setSuccessMessage(null)
		setErrorMessage(null)

		const result = createUserAccount({
			role,
			email,
			phoneNumber,
			packageID
		})

		if (!result.ok) {
			setErrorMessage(result.error)
			return
		}

		setSuccessMessage('Cont creat cu succes!')
		setEmail('')
		setPhoneNumber('')
		setPackageID('')
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

				<div>
					<label className="block text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
						placeholder="exemplu@email.com"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">Număr de telefon</label>
					<input
						type="tel"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
						className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                        placeholder='+37368916121'
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">Package ID (opțional)</label>
					<input
						value={packageID}
						onChange={(e) => setPackageID(e.target.value)}
						className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
						placeholder="ex: RB123456789"
					/>
				</div>

				{errorMessage ? (
					<div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</div>
				) : null}
				{successMessage ? (
					<div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</div>
				) : null}

				<div className="pt-2">
					<button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white">
						Creează
					</button>
				</div>
			</form>
		</div>
	)
}

