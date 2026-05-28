import axios from 'axios'
import { useState } from 'react'
import { changePassword } from '../../api/authApi'

export default function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPasswords, setShowPasswords] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    async function handleChangePassword() {
        setError(null)
        setSuccessMessage(null)

        if (!currentPassword.trim()) {
            setError('Parola curentă este obligatorie.')
            return
        }

        if (newPassword.length < 6) {
            setError('Parola nouă trebuie să conțină cel puțin 6 caractere.')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Confirmarea parolei nu coincide.')
            return
        }

        setIsSaving(true)

        try {
            const message = await changePassword({
                currentPassword,
                newPassword,
            })

            setSuccessMessage(message || 'Parola a fost modificată cu succes.')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && typeof err.response?.data === 'string') {
                setError(err.response.data)
            } else {
                setError('Nu s-a putut modifica parola.')
            }
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
            <div>
                <p className="text-base font-semibold text-gray-900">Modificare parolă</p>
                <p className="mt-1 text-sm text-gray-500">Actualizează parola contului folosind parola curentă.</p>
            </div>

            {([
                ['currentPassword', 'Parola curentă', currentPassword, setCurrentPassword],
                ['newPassword', 'Parola nouă', newPassword, setNewPassword],
                ['confirmPassword', 'Confirmă parola nouă', confirmPassword, setConfirmPassword],
            ] as [string, string, string, (value: string) => void][]).map(([key, label, value, setter]) => (
                <label key={String(key)} className="block">
                    <span className="text-xs font-medium text-gray-600">{String(label)}</span>
                    <input
                        type={showPasswords ? 'text' : 'password'}
                        value={value}
                        onChange={(event) => setter(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                </label>
            ))}

            <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                    type="checkbox"
                    checked={showPasswords}
                    onChange={(event) => setShowPasswords(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                />
                Afișează parolele
            </label>

            {error ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            ) : null}
            {successMessage ? (
                <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</div>
            ) : null}

            <button
                type="button"
                onClick={handleChangePassword}
                disabled={isSaving}
                className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
                {isSaving ? 'Se modifică...' : 'Modifică parola'}
            </button>
        </div>
    )
}
