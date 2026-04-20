import { useState } from 'react'
import physicalData from '../../../_mock/mock_persoana_fizica.json'
import { getSession } from '../../../auth/auth.session'
import { isSetupCompleted } from '../../../auth/setup.status'
import type { PhysicalUser } from '../../../types/user'
import AccountVerificationBanner from '../../../components/dashboard/AccountVerificationBanner'

export default function IndividualSettings() {
    const users = physicalData.users as PhysicalUser[]
    const session = getSession()
    const user = users.find(u => u.id === session?.userId) ?? users[0]
    const setupCompleted = isSetupCompleted(user?.id || '')

    const fields: [string, string, boolean][] = user
        ? [
            ['Nume complet', user.full_name, false],
            ['IDNP', user.idnp, true],
            ['Email', user.email, true],
            ['Telefon', user.phone, false],
            ['Adresă', user.address, false],
        ]
        : []

    const [editValues, setEditValues] = useState<Record<string, string>>(
        fields.reduce((acc, [label, value]) => ({ ...acc, [label]: value }), {})
    )

    if (!user) return null

    return (
        <div className="space-y-8">
            <AccountVerificationBanner />

            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Setări cont</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Informațiile personale asociate contului tău.
                </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 divide-y divide-gray-100">
                <p className="pb-3 text-base font-semibold text-gray-900">Date personale</p>
                {fields.map(([label, value, isRequired]) => (
                    <div key={label} className="flex justify-between py-3 text-sm">
                        <div className="flex items-center gap-2">
                            <span className={`w-36 ${isRequired ? 'text-red-700 font-medium' : 'text-gray-500'}`}>{label}</span>
                            {isRequired && (
                                <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                                    Obligatoriu
                                </span>
                            )}
                        </div>
                        <span className={`font-medium flex-1 text-right ${isRequired ? 'text-red-700' : 'text-gray-900'}`}>{value}</span>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
                <p className="text-base font-semibold text-gray-900">Modificare date</p>

                {fields.map(([label, value, isRequired]) => (
                    <div key={label}>
                        <div className="flex items-center gap-2 mb-1">
                            <label className={`block text-xs font-medium ${isRequired ? 'text-red-600' : 'text-gray-600'}`}>
                                {label}
                            </label>
                            {isRequired && (
                                <span className="text-red-500 text-xs font-bold">*</span>
                            )}
                        </div>
                        <input
                            type={label === 'Email' ? 'email' : label === 'Telefon' ? 'tel' : 'text'}
                            value={editValues[label] || value}
                            onChange={(e) => setEditValues({ ...editValues, [label]: e.target.value })}
                            className={`w-full rounded-lg border ${
                                isRequired
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300'
                            } px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 ${
                                isRequired ? 'focus:ring-red-500/20' : 'focus:ring-gray-500/20'
                            }`}
                        />
                        {isRequired && (
                            <p className="text-xs text-red-600 mt-1">
                                Acest câmp este obligatoriu pentru validarea contului
                            </p>
                        )}
                    </div>
                ))}

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Parolă nouă</label>
                    <input type="password" placeholder="••••••••"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20" />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Confirmare parolă nouă</label>
                    <input type="password" placeholder="••••••••"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20" />
                </div>

                <button type="button"
                    className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
                    Salvează modificările
                </button>

                {!setupCompleted && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">Notă:</span> După ce completaţi și salvați datele obligatorii, 
                            secțiunea de setup din dashboard va dispărea.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
