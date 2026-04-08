import { useState } from 'react'
import type { PhysicalUser, JuridicalUser } from '../../types/user'
import type { Declaration } from '../../types/declaration'
import RowDetailModal, { ModalField, ModalBadge, ModalSection, TaxesTable } from './RowDetailModal'
import { STATUS_COLORS } from './StatusBadge'

type Props = {
    physicalUsers: PhysicalUser[]
    juridicalUsers: JuridicalUser[]
    decCountFor: (userId: string) => number
    declarationsFor: (userId: string) => Declaration[]
}

const TABS = ['Toți', 'Persoane fizice', 'Persoane juridice'] as const
type Tab = typeof TABS[number]

type SelectedUser =
    | { type: 'physical'; user: PhysicalUser }
    | { type: 'juridical'; user: JuridicalUser }

function UserDetailModal({ selected, declarations, onClose }: {
    selected: SelectedUser
    declarations: Declaration[]
    onClose: () => void
}) {
    const isPhysical = selected.type === 'physical'
    const u = selected.user
    const title = isPhysical ? (u as PhysicalUser).full_name : (u as JuridicalUser).company_name

    return (
        <RowDetailModal title={`Detalii cont – ${title}`} onClose={onClose}>
            {/* User info */}
            <ModalSection title={isPhysical ? 'Persoană fizică' : 'Persoană juridică'}>
                {isPhysical ? (
                    <>
                        <ModalField label="Nume complet" value={(u as PhysicalUser).full_name} />
                        <ModalField label="IDNP" value={(u as PhysicalUser).idnp} mono />
                        <ModalField label="Email" value={(u as PhysicalUser).email} />
                        <ModalField label="Telefon" value={(u as PhysicalUser).phone} />
                        <ModalField label="Adresă" value={(u as PhysicalUser).address} />
                    </>
                ) : (
                    <>
                        <ModalField label="Companie" value={(u as JuridicalUser).company_name} />
                        <ModalField label="ID Fiscal" value={(u as JuridicalUser).tax_id} mono />
                        <ModalField label="EORI" value={(u as JuridicalUser).eori} mono />
                        <ModalBadge
                            label="TVA"
                            value={(u as JuridicalUser).vat_registered ? 'Da' : 'Nu'}
                            color={(u as JuridicalUser).vat_registered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                        />
                        <ModalField label="Email" value={(u as JuridicalUser).email} />
                        <ModalField label="Telefon" value={(u as JuridicalUser).phone} />
                        <ModalField label="Adresă" value={(u as JuridicalUser).address} />
                    </>
                )}
            </ModalSection>

            {/* Declarations */}
            {declarations.length > 0 && (
                <div className="px-6 pb-5">
                    <p className="mb-3 text-base font-semibold text-gray-900">
                        Declarații ({declarations.length})
                    </p>
                    <div className="space-y-3">
                        {declarations.map(d => (
                            <div key={d.id} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-mono text-sm font-semibold text-gray-800">{d.awb_number}</span>
                                    <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${STATUS_COLORS[d.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {d.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-3">
                                    <span className="text-sm text-gray-500">Descriere: <span className="font-medium text-gray-800">{d.description}</span></span>
                                    <span className="text-sm text-gray-500">Cod HS: <span className="font-mono text-gray-800">{d.hs_code}</span></span>
                                    <span className="text-sm text-gray-500">Cantitate: <span className="font-medium text-gray-800">{d.quantity}</span></span>
                                    <span className="text-sm text-gray-500">Greutate: <span className="font-medium text-gray-800">{d.gross_weight} kg</span></span>
                                </div>
                                <TaxesTable
                                    rows={[
                                        { label: 'TVA', amount: d.vat },
                                        { label: 'Taxă vamală', amount: d.customs_duty },
                                        ...(d.excise > 0 ? [{ label: 'Accize', amount: d.excise }] : []),
                                    ]}
                                    total={d.total_taxes}
                                    currency={d.currency}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {declarations.length === 0 && (
                <p className="px-6 pb-5 text-sm text-gray-400">Nicio declarație.</p>
            )}
        </RowDetailModal>
    )
}

export default function AllUsersTable({ physicalUsers, juridicalUsers, decCountFor, declarationsFor }: Props) {
    const [tab, setTab] = useState<Tab>('Toți')
    const [selected, setSelected] = useState<SelectedUser | null>(null)

    return (
        <>
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
                                        <tr
                                            key={u.id}
                                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                                            onClick={() => setSelected({ type: 'physical', user: u })}
                                        >
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
                                        <tr
                                            key={u.id}
                                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                                            onClick={() => setSelected({ type: 'juridical', user: u })}
                                        >
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

            {selected && (
                <UserDetailModal
                    selected={selected}
                    declarations={declarationsFor(selected.user.id)}
                    onClose={() => setSelected(null)}
                />
            )}
        </>
    )
}
