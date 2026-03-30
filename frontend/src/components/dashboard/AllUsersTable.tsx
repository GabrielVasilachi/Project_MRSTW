import { useState } from 'react'
import type { PhysicalUser, JuridicalUser } from '../../types/user'

type Props = {
    physicalUsers: PhysicalUser[]
    juridicalUsers: JuridicalUser[]
    decCountFor: (userId: string) => number
}

const TABS = ['Toți', 'Persoane fizice', 'Persoane juridice'] as const
type Tab = typeof TABS[number]

export default function AllUsersTable({ physicalUsers, juridicalUsers, decCountFor }: Props) {
    const [tab, setTab] = useState<Tab>('Toți')

    return (
        <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
                <p className="text-base font-semibold text-gray-900">Utilizatori</p>
            </div>

            <div className="flex gap-1 border-b border-gray-200 px-6 pb-0 pt-3">
                {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`rounded-t px-4 py-2 text-sm font-medium transition-colors ${
                            tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}>
                        {t}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto">
                {tab !== 'Persoane juridice' && (
                    <>
                        {tab === 'Toți' && <p className="px-6 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Persoane fizice</p>}
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    {['Nume', 'IDNP', 'Email', 'Telefon', 'Adresă', 'Declarații'].map(h => (
                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {physicalUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium text-gray-900">{u.full_name}</td>
                                        <td className="px-6 py-3 font-mono text-xs text-gray-600">{u.idnp}</td>
                                        <td className="px-6 py-3 text-gray-700">{u.email}</td>
                                        <td className="px-6 py-3 text-gray-700">{u.phone}</td>
                                        <td className="px-6 py-3 text-gray-700">{u.address}</td>
                                        <td className="px-6 py-3 text-gray-700">{decCountFor(u.id)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {tab !== 'Persoane fizice' && (
                    <>
                        {tab === 'Toți' && <p className="px-6 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Persoane juridice</p>}
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    {['Companie', 'ID Fiscal', 'EORI', 'Email', 'Telefon', 'TVA', 'Declarații'].map(h => (
                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {juridicalUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium text-gray-900">{u.company_name}</td>
                                        <td className="px-6 py-3 font-mono text-xs text-gray-600">{u.tax_id}</td>
                                        <td className="px-6 py-3 text-gray-600">{u.eori}</td>
                                        <td className="px-6 py-3 text-gray-700">{u.email}</td>
                                        <td className="px-6 py-3 text-gray-700">{u.phone}</td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${u.vat_registered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                {u.vat_registered ? 'Da' : 'Nu'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-gray-700">{decCountFor(u.id)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    )
}
