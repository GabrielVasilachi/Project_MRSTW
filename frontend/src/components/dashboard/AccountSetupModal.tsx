import { useState } from 'react'
import { markSetupCompleted } from '../../auth/setup.status'

interface AccountSetupModalProps {
	userId: string
	onComplete: () => void
}

export default function AccountSetupModal({ userId, onComplete }: AccountSetupModalProps) {
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleSetPassword = () => {
		setError('')

		if (!password.trim()) {
			setError('Parola este obligatorie')
			return
		}

		if (password.length < 8) {
			setError('Parola trebuie să conțină cel puțin 8 caractere')
			return
		}

		if (password !== confirmPassword) {
			setError('Parolele nu se potrivesc')
			return
		}

		setIsLoading(true)
		// Simulare API call
		setTimeout(() => {
			markSetupCompleted(userId)
			onComplete()
		}, 500)
	}

	return (
		<div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-2xl max-w-lg w-full">
				{/* Header - Blue */}
				<div className="bg-blue-500 px-8 py-6 rounded-t-lg">
					<h2 className="text-white font-semibold text-2xl">
						Setare parolă cont
					</h2>
					<p className="text-blue-100 text-sm mt-2">
						Vă rugăm să alegeți o parolă sigură pentru contul dumneavoastră
					</p>
				</div>

				{/* Content */}
				<div className="p-8">
					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-800 mb-2">
								Parolă
							</label>
							<input
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={isLoading}
								className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
							/>
							<p className="text-xs text-gray-600 mt-2">
								Minimum 8 caractere
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-800 mb-2">
								Confirma parolă
							</label>
							<input
								type="password"
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								disabled={isLoading}
								className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
							/>
						</div>
					</div>

					{/* Error */}
					{error && (
						<div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-lg">
							<p className="text-sm text-red-700 font-medium">{error}</p>
						</div>
					)}

					{/* Info */}
					<div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded-lg">
						<p className="text-sm text-blue-800">
							<span className="font-semibold">Notă:</span> După setarea parolei, 
							va trebui să completaţi IDNP-ul, email-ul și adresa în dashboard.
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className="bg-gray-50 px-8 py-4 rounded-b-lg border-t border-gray-200 flex gap-3 justify-end">
					<button
						onClick={handleSetPassword}
						disabled={isLoading}
						className="px-6 py-3 text-base font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
					>
						{isLoading ? 'Se procesează...' : 'Continuă'}
					</button>
				</div>
			</div>
		</div>
	)
}
