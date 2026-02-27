import physicalData from '../../../_mock/mock_persoana_fizica.json'
import { getSession } from '../../../auth/auth.session'
import type { PhysicalUser } from '../../../types/user'

export default function IndividualSettings() {
    const users = physicalData.users as PhysicalUser[]
    const session = getSession()
    const user = users.find(u => u.id === session?.userId) ?? users[0]
    if (!user) return null

    const fields: [string, string][] = [
        ['Nume complet', user.full_name],
        ['IDNP', user.idnp],
        ['Email', user.email],
        ['Telefon', user.phone],
        ['Adresă', user.address],
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Setări cont</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Informațiile personale asociate contului tău.
                </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 divide-y divide-gray-100">
                <p className="pb-3 text-base font-semibold text-gray-900">Date personale</p>
                {fields.map(([label, value]) => (
                    <div key={label} className="flex justify-between py-3 text-sm">
                        <span className="text-gray-500 w-36">{label}</span>
                        <span className="font-medium text-gray-900 flex-1 text-right">{value}</span>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
                <p className="text-base font-semibold text-gray-900">Modificare date</p>

                {fields.map(([label, value]) => (
                    <div key={label}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                        <input
                            type={label === 'Email' ? 'email' : label === 'Telefon' ? 'tel' : 'text'}
                            defaultValue={value}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none"
                        />
                    </div>
                ))}

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Parolă nouă</label>
                    <input type="password" placeholder="••••••••"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none" />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Confirmare parolă nouă</label>
                    <input type="password" placeholder="••••••••"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none" />
                </div>

                <button type="button"
                    className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
                    Salvează modificările
                </button>
            </div>
        </div>
    )
}
