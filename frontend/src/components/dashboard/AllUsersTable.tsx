import { useState } from 'react'
import axios from 'axios'

import { deleteDocument, downloadDocumentFile } from '../../api/documentsApi'
import { updateBusinessProfile, updatePhysicalProfile } from '../../api/profilesApi'
import { regenerateActivationToken, updateUser } from '../../api/usersApi'
import type { AdminDashboardUser } from '../../pages/dashboard/admin/adminData'
import { formatBytes } from '../../utils/format'
import RowDetailModal, { ModalBadge, ModalField, ModalSection } from './RowDetailModal'

type Props = {
    users: AdminDashboardUser[]
}

type UserPatch = Partial<AdminDashboardUser>

type UserEditForm = {
    name: string
    email: string
    phoneNumber: string
    address: string
    idnp: string
    idnoCode: string
    eoriCode: string
    tvaCode: string
    contactPerson: string
}

const TABS = ['Toți', 'Persoane fizice', 'Persoane juridice', 'Administratori'] as const
type Tab = typeof TABS[number]

const ACCOUNT_COLORS: Record<string, string> = {
    Activ: 'bg-green-100 text-green-800',
    Temporar: 'bg-yellow-100 text-yellow-800',
    Expirat: 'bg-red-100 text-red-800',
}

function empty(value: string | number | null | undefined) {
    return value === null || value === undefined || value === '' ? '—' : value
}

function toNullable(value: string) {
    const trimmed = value.trim()
    return trimmed ? trimmed : null
}

function getApiErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error) && typeof error.response?.data === 'string') {
        return error.response.data
    }

    return fallback
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

function hasExpiredActivationToken(user: AdminDashboardUser) {
    if (user.hasExpiredActivationToken) return true
    if (!user.activationTokenExpiresAt) return false

    const expiresAt = new Date(user.activationTokenExpiresAt).getTime()
    return Number.isFinite(expiresAt) && expiresAt < Date.now()
}

function getAccountStatus(user: AdminDashboardUser) {
    if (hasExpiredActivationToken(user)) return 'Expirat'
    return user.isTemporary ? 'Temporar' : 'Activ'
}

function createForm(user: AdminDashboardUser): UserEditForm {
    return {
        name: user.name ?? '',
        email: user.email ?? '',
        phoneNumber: user.phoneNumber ?? '',
        address: user.address ?? '',
        idnp: user.idnp ?? '',
        idnoCode: user.idnoCode ?? '',
        eoriCode: user.eoriCode ?? '',
        tvaCode: user.tvaCode ?? '',
        contactPerson: user.contactPerson ?? '',
    }
}

function EditField({ label, value, onChange, required, mono }: {
    label: string
    value: string
    onChange: (value: string) => void
    required?: boolean
    mono?: boolean
}) {
    return (
        <label>
            <span className="text-sm text-gray-500">{label}{required ? ' *' : ''}:</span>
            <input
                value={value}
                onChange={event => onChange(event.target.value)}
                className={`mt-0.5 w-full rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 outline-none transition-colors focus:border-blue-500 ${mono ? 'font-mono' : ''}`}
            />
        </label>
    )
}

function UserDetailModal({ user, onClose, onUserUpdated, onDocumentsChanged, onActivationTokenRegenerated }: {
    user: AdminDashboardUser
    onClose: () => void
    onUserUpdated: (user: AdminDashboardUser) => void
    onDocumentsChanged: (userId: number, documents: AdminDashboardUser['documents']) => void
    onActivationTokenRegenerated: (userId: number, expiresAt: string) => void
}) {
    const accountStatus = getAccountStatus(user)
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState<UserEditForm>(() => createForm(user))
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [saveMessage, setSaveMessage] = useState<string | null>(null)
    const [downloadingId, setDownloadingId] = useState<number | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [downloadError, setDownloadError] = useState<string | null>(null)
    const [regenerating, setRegenerating] = useState(false)
    const [regenerateError, setRegenerateError] = useState<string | null>(null)
    const [activationLink, setActivationLink] = useState<string | null>(null)

    function updateField(field: keyof UserEditForm, value: string) {
        setForm(current => ({ ...current, [field]: value }))
    }

    function cancelEditing() {
        setForm(createForm(user))
        setIsEditing(false)
        setSaveError(null)
        setSaveMessage(null)
    }

    async function saveUser() {
        const name = form.name.trim()
        const phoneNumber = form.phoneNumber.trim()
        const address = form.address.trim()
        const email = toNullable(form.email)

        setSaving(true)
        setSaveError(null)
        setSaveMessage(null)

        if (!name) {
            setSaveError(user.role === 'business' ? 'Denumirea companiei este obligatorie.' : 'Numele este obligatoriu.')
            setSaving(false)
            return
        }

        if (!phoneNumber) {
            setSaveError('Numărul de telefon este obligatoriu.')
            setSaving(false)
            return
        }

        if (user.role === 'individual' && !address) {
            setSaveError('Adresa este obligatorie pentru persoanele fizice.')
            setSaving(false)
            return
        }

        try {
            if (user.role === 'individual') {
                await updatePhysicalProfile(user.userId, {
                    password: '',
                    fullName: name,
                    phoneNumber,
                    locationAddress: address,
                    idnp: toNullable(form.idnp),
                    email,
                })
            } else if (user.role === 'business') {
                await updateBusinessProfile(user.userId, {
                    password: '',
                    companyName: name,
                    phoneNumber,
                    idnoCode: toNullable(form.idnoCode),
                    locationAdress: toNullable(form.address),
                    tvaCode: toNullable(form.tvaCode),
                    email,
                    contactPerson: toNullable(form.contactPerson),
                    responsiblePerson: null,
                    eoriCode: toNullable(form.eoriCode),
                })
            } else {
                await updateUser(user.userId, {
                    fullName: name,
                    phoneNumber,
                    email,
                })
            }

            const updatedUser: AdminDashboardUser = {
                ...user,
                name,
                email,
                phoneNumber,
                address: user.role === 'individual' ? address : toNullable(form.address),
                idnp: user.role === 'individual' ? toNullable(form.idnp) : user.idnp,
                idnoCode: user.role === 'business' ? toNullable(form.idnoCode) : user.idnoCode,
                eoriCode: user.role === 'business' ? toNullable(form.eoriCode) : user.eoriCode,
                tvaCode: user.role === 'business' ? toNullable(form.tvaCode) : user.tvaCode,
                contactPerson: user.role === 'business' ? toNullable(form.contactPerson) : user.contactPerson,
            }

            onUserUpdated(updatedUser)
            setSaveMessage('Datele au fost salvate.')
            setIsEditing(false)
        } catch (error: unknown) {
            setSaveError(getApiErrorMessage(error, 'Nu s-au putut salva datele.'))
        } finally {
            setSaving(false)
        }
    }

    async function downloadDocument(id: number, fileName: string) {
        setDownloadingId(id)
        setDownloadError(null)

        try {
            const file = await downloadDocumentFile(id)
            const fileUrl = URL.createObjectURL(file)
            const a = document.createElement('a')
            a.href = fileUrl
            a.download = fileName
            a.click()
            window.setTimeout(() => URL.revokeObjectURL(fileUrl), 0)
        } catch {
            setDownloadError('Nu s-a putut descărca documentul.')
        } finally {
            setDownloadingId(null)
        }
    }

    async function removeDocument(id: number) {
        const confirmed = window.confirm('Ștergi acest document?')

        if (!confirmed) return

        setDeletingId(id)
        setDownloadError(null)

        try {
            await deleteDocument(id, user.userId)
            onDocumentsChanged(user.userId, user.documents.filter(document => document.id !== id))
        } catch (error: unknown) {
            setDownloadError(getApiErrorMessage(error, 'Nu s-a putut șterge documentul.'))
        } finally {
            setDeletingId(null)
        }
    }

    async function regenerateToken() {
        setRegenerating(true)
        setRegenerateError(null)
        setActivationLink(null)

        try {
            const response = await regenerateActivationToken(user.userId)
            setActivationLink(response.activationLink)
            onActivationTokenRegenerated(user.userId, response.expiresAt)
        } catch (error: unknown) {
            setRegenerateError(getApiErrorMessage(error, 'Nu s-a putut regenera linkul de activare.'))
        } finally {
            setRegenerating(false)
        }
    }

    return (
        <RowDetailModal title={`Detalii cont - ${user.name}`} onClose={onClose}>
            <ModalSection title={user.roleLabel}>
                <ModalBadge label="Rol" value={user.roleLabel} color="bg-blue-100 text-blue-800" />
                <ModalBadge label="Status cont" value={accountStatus} color={ACCOUNT_COLORS[accountStatus]} />
                <ModalField label="ID utilizator" value={user.userId} mono />
                {isEditing ? (
                    <>
                        <EditField
                            label={user.role === 'business' ? 'Companie' : 'Nume'}
                            value={form.name}
                            onChange={value => updateField('name', value)}
                            required
                        />
                        <EditField label="Email" value={form.email} onChange={value => updateField('email', value)} />
                        <EditField label="Telefon" value={form.phoneNumber} onChange={value => updateField('phoneNumber', value)} required />
                        <EditField
                            label="Adresă"
                            value={form.address}
                            onChange={value => updateField('address', value)}
                            required={user.role === 'individual'}
                        />
                        {user.role === 'individual' ? (
                            <EditField label="IDNP" value={form.idnp} onChange={value => updateField('idnp', value)} mono />
                        ) : null}
                        {user.role === 'business' ? (
                            <>
                                <EditField label="IDNO" value={form.idnoCode} onChange={value => updateField('idnoCode', value)} mono />
                                <EditField label="EORI" value={form.eoriCode} onChange={value => updateField('eoriCode', value)} mono />
                                <EditField label="Cod TVA" value={form.tvaCode} onChange={value => updateField('tvaCode', value)} mono />
                                <EditField label="Persoană contact" value={form.contactPerson} onChange={value => updateField('contactPerson', value)} />
                            </>
                        ) : null}
                    </>
                ) : (
                    <>
                        <ModalField label="Nume" value={empty(user.name)} />
                        <ModalField label="Email" value={empty(user.email)} />
                        <ModalField label="Telefon" value={empty(user.phoneNumber)} />
                        <ModalField label="Adresă" value={empty(user.address)} />
                        {user.role === 'individual' ? <ModalField label="IDNP" value={empty(user.idnp)} mono /> : null}
                        {user.role === 'business' ? <ModalField label="IDNO" value={empty(user.idnoCode)} mono /> : null}
                        {user.role === 'business' ? <ModalField label="EORI" value={empty(user.eoriCode)} mono /> : null}
                        {user.role === 'business' ? <ModalField label="Cod TVA" value={empty(user.tvaCode)} mono /> : null}
                        {user.role === 'business' ? <ModalField label="Persoană contact" value={empty(user.contactPerson)} /> : null}
                    </>
                )}
                <ModalField label="Documente încărcate" value={user.documents.length} />
            </ModalSection>

            <div className="px-6 pb-5">
                <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={saveUser}
                                disabled={saving}
                                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                            >
                                {saving ? 'Se salvează...' : 'Salvează'}
                            </button>
                            <button
                                type="button"
                                onClick={cancelEditing}
                                disabled={saving}
                                className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                            >
                                Anulează
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-50"
                        >
                            Modificare
                        </button>
                    )}
                </div>
                {saveError ? (
                    <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {saveError}
                    </div>
                ) : null}
                {saveMessage ? (
                    <div className="mt-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                        {saveMessage}
                    </div>
                ) : null}
            </div>

            {accountStatus === 'Expirat' ? (
                <div className="px-6 pb-5">
                    <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                        <p className="text-sm font-semibold text-red-800">Token de activare expirat</p>
                        <p className="mt-1 text-xs text-red-700">
                            {user.activationTokenExpiresAt
                                ? `Tokenul anterior a expirat la ${new Date(user.activationTokenExpiresAt).toLocaleString('ro-RO')}.`
                                : 'Nu există un token de activare valid pentru acest cont.'}
                        </p>
                        {regenerateError ? (
                            <p className="mt-2 text-xs font-medium text-red-700">{regenerateError}</p>
                        ) : null}
                        <button
                            type="button"
                            onClick={regenerateToken}
                            disabled={regenerating}
                            className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                        >
                            {regenerating ? 'Se regenerează...' : 'Regenerare link activare'}
                        </button>
                    </div>
                </div>
            ) : null}

            {activationLink ? (
                <div className="px-6 pb-5">
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                        <p className="text-sm font-semibold text-green-800">Link nou de activare</p>
                        <p className="mt-1 break-all font-mono text-xs text-gray-700">{activationLink}</p>
                    </div>
                </div>
            ) : null}

            <div className="px-6 pb-5">
                <p className="mb-3 text-base font-semibold text-gray-900">Documente ({user.documents.length})</p>
                {downloadError ? (
                    <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {downloadError}
                    </div>
                ) : null}
                {user.documents.length === 0 ? (
                    <p className="text-sm text-gray-400">Nu există documente încărcate pentru acest utilizator.</p>
                ) : (
                    <div className="space-y-2">
                        {user.documents.map(document => (
                            <div key={document.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                                <div>
                                    <p className="font-mono text-sm font-semibold text-gray-800">{document.fileName}</p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {document.contentType} · {formatBytes(document.fileSize)} · {new Date(document.uploadedAt).toLocaleDateString('ro-RO')}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => downloadDocument(document.id, document.fileName)}
                                        disabled={downloadingId === document.id}
                                        className="rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
                                    >
                                        {downloadingId === document.id ? 'Se descarcă...' : 'Descarcă'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeDocument(document.id)}
                                        disabled={deletingId === document.id}
                                        className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
                                    >
                                        {deletingId === document.id ? 'Se șterge...' : 'Șterge'}
                                    </button>
                                </div>
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
    const [userOverrides, setUserOverrides] = useState<Record<number, UserPatch>>({})

    function withUserOverride(user: AdminDashboardUser) {
        const override = userOverrides[user.userId]
        return override ? { ...user, ...override } : user
    }

    function userUpdated(updatedUser: AdminDashboardUser) {
        setUserOverrides(current => ({
            ...current,
            [updatedUser.userId]: {
                ...current[updatedUser.userId],
                ...updatedUser,
            },
        }))
        setSelected(updatedUser)
    }

    function documentsChanged(userId: number, documents: AdminDashboardUser['documents']) {
        setUserOverrides(current => ({
            ...current,
            [userId]: {
                ...current[userId],
                documents,
            },
        }))
        setSelected(current => current && current.userId === userId ? { ...current, documents } : current)
    }

    function activationTokenRegenerated(userId: number, expiresAt: string) {
        setUserOverrides(current => ({
            ...current,
            [userId]: {
                ...current[userId],
                hasExpiredActivationToken: false,
                activationTokenExpiresAt: expiresAt,
            },
        }))
        setSelected(current => current && current.userId === userId
            ? {
                ...current,
                hasExpiredActivationToken: false,
                activationTokenExpiresAt: expiresAt,
            }
            : current
        )
    }

    const displayedUsers = users.map(withUserOverride)
    const filteredUsers = displayedUsers.filter(user => tabMatchesUser(tab, user))

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
                                    const accountStatus = getAccountStatus(user)

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
                    user={withUserOverride(selected)}
                    onClose={() => setSelected(null)}
                    onUserUpdated={userUpdated}
                    onDocumentsChanged={documentsChanged}
                    onActivationTokenRegenerated={activationTokenRegenerated}
                />
            )}
        </>
    )
}
