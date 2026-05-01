import { useState } from 'react'

import type { AdminDashboardUser } from '../../pages/dashboard/admin/adminData'
import RowDetailModal, { ModalBadge, ModalField, ModalSection } from './RowDetailModal'

type Props = {
    users: AdminDashboardUser[]
}

const TABS = ['Toți', 'Persoane fizice', 'Persoane juridice', 'Administratori'] as const
type Tab = typeof TABS[number]

const ACCOUNT_COLORS: Record<string, string> = {
    Activ: 'bg-green-100 text-green-800',
    Temporar: 'bg-yellow-100 text-yellow-800',
}

function empty(value: string | number | null | undefined) {
    return value === null || value === undefined || value === '' ? '—' : value
}

function tabMatchesUser(tab: Tab, user: AdminDashboardUser) {
    if (tab === 'Persoane fizice') return user.role === 'individual'
    if (tab === 'Persoane juridice') return user.role === 'business'
    if (tab === 'Administratori') return user.role === 'admin'
    return true
}

function getIdentifier(user: AdminDashboardUser) {
    if (user.role === 'individual') return user.idnp
    if (user.role === 'business') return user.idnoCode ?? user.eoriCode
    return String(user.userId)
}

function UserDetailModal({ user, onClose }: {
    user: AdminDashboardUser
    onClose: () => void
}) {
    const accountStatus = user.isTemporary ? 'Temporar' : 'Activ'

    return (
        <RowDetailModal title={`Detalii cont - ${user.name}`} onClose={onClose}>
            <ModalSection title={user.roleLabel}>
                <ModalBadge label="Rol" value={user.roleLabel} color="bg-blue-100 text-blue-800" />
                <ModalBadge label="Status cont" value={accountStatus} color={ACCOUNT_COLORS[accountStatus]} />
                <ModalField label="ID utilizator" value={user.userId} mono />
                <ModalField label="Nume" value={empty(user.name)} />
                <ModalField label="Email" value={empty(user.email)} />
                <ModalField label="Telefon" value={empty(user.phoneNumber)} />
                <ModalField label="Adresă" value={empty(user.address)} />
                {user.role === 'individual' ? <ModalField label="IDNP" value={empty(user.idnp)} mono /> : null}
                {user.role === 'business' ? <ModalField label="IDNO" value={empty(user.idnoCode)} mono /> : null}
                {user.role === 'business' ? <ModalField label="EORI" value={empty(user.eoriCode)} mono /> : null}
                {user.role === 'business' ? <ModalField label="Cod TVA" value={empty(user.tvaCode)} mono /> : null}
                {user.role === 'business' ? <ModalField label="Persoană contact" value={empty(user.contactPerson)} /> : null}
                <ModalField label="Documente încărcate" value={user.documents.length} />
            </ModalSection>

            <div className="px-6 pb-5">
                <p className="mb-3 text-base font-semibold text-gray-900">Documente ({user.documents.length})</p>
                {user.documents.length === 0 ? (
                    <p className="text-sm text-gray-400">Nu există documente încărcate pentru acest utilizator.</p>
                ) : (
                    <div className="space-y-2">
                        {user.documents.map(document => (
                            <div key={document.id} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                                <p className="font-mono text-sm font-semibold text-gray-800">{document.fileName}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                    {document.contentType} · {new Date(document.uploadedAt).toLocaleDateString('ro-RO')}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </RowDetailModal>
    )
}

export default function AllUsersTable({ users }: Props) {
    const [tab, setTab] = useState<Tab>('Toți')
    const [selected, setSelected] = useState<AdminDashboardUser | null>(null)
    const filteredUsers = users.filter(user => tabMatchesUser(tab, user))

    return (
        <>
            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <p className="text-base font-semibold text-gray-900">Utilizatori</p>
                    <p className="mt-0.5 text-sm text-gray-500">{filteredUsers.length} din {users.length} conturi</p>
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

                {filteredUsers.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-gray-400">Nu există utilizatori pentru filtrul selectat.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    {['Nume', 'Rol', 'Email', 'Telefon', 'Identificator', 'Adresă', 'Documente', 'Status'].map(h => (
                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map(user => {
                                    const accountStatus = user.isTemporary ? 'Temporar' : 'Activ'

                                    return (
                                        <tr
                                            key={user.id}
                                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                                            onClick={() => setSelected(user)}
                                        >
                                            <td className="px-6 py-3 font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-3 text-gray-500">{user.roleLabel}</td>
                                            <td className="px-6 py-3 text-gray-700">{empty(user.email)}</td>
                                            <td className="px-6 py-3 text-gray-700">{empty(user.phoneNumber)}</td>
                                            <td className="px-6 py-3 font-mono text-xs text-gray-600">{empty(getIdentifier(user))}</td>
                                            <td className="px-6 py-3 text-gray-700">{empty(user.address)}</td>
                                            <td className="px-6 py-3 text-gray-700">{user.documents.length}</td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ACCOUNT_COLORS[accountStatus]}`}>
                                                    {accountStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selected && (
                <UserDetailModal
                    user={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </>
    )
}
