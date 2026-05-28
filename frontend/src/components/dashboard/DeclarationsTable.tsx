import { useState } from 'react'
import type { MouseEvent } from 'react'
import axios from 'axios'
import type { Declaration } from '../../types/declaration'
import type { TaxCategory } from '../../api/types/taxCalculator'
import StatusBadge from './StatusBadge'
import { STATUS_COLORS, STATUS_LABELS_RO } from './statusColors'
import RowDetailModal, { ModalField, ModalBadge, ModalSection, TaxesTable } from './RowDetailModal'
import { fmt } from '../../utils/format'

const STATUSES = ['Toate', 'Approved', 'Pending Documents', 'Under Review', 'Rejected']
const EDIT_STATUSES = [
    { value: 0, label: 'În revizuire' },
    { value: 1, label: 'Aprobat' },
    { value: 2, label: 'Respins' },
    { value: 3, label: 'Documente necesare' },
]
const CURRENCIES = [
    { value: 0, label: 'EUR' },
    { value: 1, label: 'USD' },
    { value: 2, label: 'MDL' },
    { value: 3, label: 'RON' },
]

export type DeclarationEditValues = {
    trackingCode: string
    productName: string
    productURL: string
    senderName: string
    hsCode: string
    category: number
    quantity: number
    totalCost: number
    currency: number
    status: number
}

type Props = {
    declarations: Declaration[]
    resolveUser?: (userId: string) => { name: string; type: string } | undefined
    resolveDeclarationInfo?: (declaration: Declaration) => { documentsCount: number; packageOwner: string; personType: string } | undefined
    onOpenDeclaration?: (declaration: Declaration) => Promise<void>
    onDeleteDeclaration?: (declaration: Declaration) => Promise<void>
    onUpdateDeclaration?: (declaration: Declaration, values: DeclarationEditValues) => Promise<void>
    productCategories?: TaxCategory[]
    canEditStatus?: boolean
}

function DeclarationModal({ d, user, onClose, onSave, productCategories, canEditStatus }: {
    d: Declaration
    user?: { name: string; type: string }
    onClose: () => void
    onSave?: (declaration: Declaration, values: DeclarationEditValues) => Promise<void>
    productCategories?: TaxCategory[]
    canEditStatus?: boolean
}) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [values, setValues] = useState<DeclarationEditValues>({
        trackingCode: d.awb_number,
        productName: d.description,
        productURL: d.product_url ?? '',
        senderName: d.sender_name ?? '',
        hsCode: d.hs_code === 'N/A' ? '' : d.hs_code,
        category: d.category ?? 12,
        quantity: d.quantity,
        totalCost: d.customs_value,
        currency: d.currency_value ?? 2,
        status: d.status_value ?? 0,
    })

    const statusColor =
        d.status === 'Approved' ? 'bg-green-100 text-green-800' :
        d.status === 'Rejected' ? 'bg-red-100 text-red-800' :
        d.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
        'bg-yellow-100 text-yellow-800'

    const updateValue = (field: keyof DeclarationEditValues, value: string | number) => {
        setValues((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        if (!onSave || isSaving) return

        if (!values.trackingCode.trim() || !values.productName.trim() || !values.productURL.trim()) {
            setSaveError('Completează câmpurile obligatorii.')
            return
        }

        if (d.declaration_type === 'legal' && (!values.senderName.trim() || !values.hsCode.trim())) {
            setSaveError('Completează expeditorul și codul HS.')
            return
        }

        if (values.quantity <= 0 || values.totalCost < 0) {
            setSaveError('Cantitatea și valoarea vamală trebuie să fie valide.')
            return
        }

        setIsSaving(true)
        setSaveError(null)

        try {
            await onSave(d, values)
            setIsEditing(false)
            onClose()
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && typeof error.response?.data === 'string') {
                setSaveError(error.response.data)
            } else {
                setSaveError('Nu s-a putut modifica declarația.')
            }
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <RowDetailModal title={`Detalii declarație - Tracking Code: ${d.awb_number}`} onClose={onClose}>
            {isEditing && onSave ? (
                <div className="px-6 py-5">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        {canEditStatus ? (
                            <label className="col-span-2">
                                <span className="text-sm text-gray-500">Status:</span>
                                <select
                                    value={values.status}
                                    onChange={(event) => updateValue('status', Number(event.target.value))}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                >
                                    {EDIT_STATUSES.map((status) => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </label>
                        ) : (
                            <div className="col-span-2">
                                <ModalBadge label="Status" value={STATUS_LABELS_RO[d.status] ?? d.status} color={statusColor} />
                            </div>
                        )}
                        <label>
                            <span className="text-sm text-gray-500">Tracking Code:</span>
                            <input value={values.trackingCode} onChange={(event) => updateValue('trackingCode', event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </label>
                        <label>
                            <span className="text-sm text-gray-500">Descriere:</span>
                            <input value={values.productName} onChange={(event) => updateValue('productName', event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </label>
                        {d.declaration_type === 'legal' ? (
                            <>
                                <label>
                                    <span className="text-sm text-gray-500">Expeditor:</span>
                                    <input value={values.senderName} onChange={(event) => updateValue('senderName', event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                                </label>
                                <label>
                                    <span className="text-sm text-gray-500">Cod HS:</span>
                                    <input value={values.hsCode} onChange={(event) => updateValue('hsCode', event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                                </label>
                            </>
                        ) : null}
                        <label>
                            <span className="text-sm text-gray-500">Categorie:</span>
                            <select
                                value={values.category}
                                onChange={(event) => updateValue('category', Number(event.target.value))}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            >
                                {(productCategories ?? []).map((category) => (
                                    <option key={category.value} value={category.value}>{category.label}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <span className="text-sm text-gray-500">Cantitate:</span>
                            <input type="number" min={1} value={values.quantity} onChange={(event) => updateValue('quantity', Number(event.target.value))} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </label>
                        <label>
                            <span className="text-sm text-gray-500">Valoare vamală:</span>
                            <input type="number" min={0} value={values.totalCost} onChange={(event) => updateValue('totalCost', Number(event.target.value))} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </label>
                        <label>
                            <span className="text-sm text-gray-500">Valută:</span>
                            <select
                                value={values.currency}
                                onChange={(event) => updateValue('currency', Number(event.target.value))}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            >
                                {CURRENCIES.map((currency) => (
                                    <option key={currency.value} value={currency.value}>{currency.label}</option>
                                ))}
                            </select>
                        </label>
                        <label className="col-span-2">
                            <span className="text-sm text-gray-500">URL Produs:</span>
                            <input value={values.productURL} onChange={(event) => updateValue('productURL', event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </label>
                    </div>

                    {saveError ? (
                        <p className="mt-4 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{saveError}</p>
                    ) : null}

                    <div className="mt-5 flex justify-end gap-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                            Anulează
                        </button>
                        <button type="button" onClick={handleSave} disabled={isSaving} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60">
                            {isSaving ? 'Se salvează...' : 'Salvează'}
                        </button>
                    </div>
                </div>
            ) : (
                <ModalSection>
                    <ModalBadge label="Status" value={STATUS_LABELS_RO[d.status] ?? d.status} color={statusColor} />
                    {user
                        ? <ModalField label="Utilizator" value={`${user.name} (${user.type})`} />
                        : <div />
                    }
                    {d.hs_code && d.hs_code !== 'N/A' && <ModalField label="Cod HS" value={d.hs_code} mono />}
                    <ModalField label="Descriere" value={d.description} />
                    {d.sender_name && <ModalField label="Expeditor" value={d.sender_name} />}
                    {d.category_label && <ModalField label="Categorie" value={d.category_label} />}
                    <ModalField label="Cantitate" value={d.quantity} />
                    <ModalField label="Valoare vamală" value={`${d.customs_value} ${d.currency}`} />
                    {d.product_url && (
                        <div className="col-span-2">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">URL Produs</p>
                            <a href={d.product_url} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:underline break-all">{d.product_url}</a>
                        </div>
                    )}
                </ModalSection>
            )}

            <div className="px-6 pb-5">
                <p className="mb-3 text-base font-semibold text-gray-900">Taxe estimate</p>
                <TaxesTable
                    rows={[
                        { label: 'TVA', amount: d.vat },
                        { label: 'Taxă vamală', amount: d.customs_duty },
                        ...(d.excise > 0 ? [{ label: 'Accize', amount: d.excise }] : []),
                    ]}
                    total={d.total_taxes}
                    currency={d.currency}
                />
                {onSave && !isEditing ? (
                    <div className="mt-4 flex justify-end">
                        <button type="button" onClick={() => setIsEditing(true)} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                            Modifică declarația
                        </button>
                    </div>
                ) : null}
            </div>
        </RowDetailModal>
    )
}

export default function DeclarationsTable({ declarations, resolveUser, resolveDeclarationInfo, onOpenDeclaration, onDeleteDeclaration, onUpdateDeclaration, productCategories, canEditStatus }: Props) {
    const [filter, setFilter] = useState('Toate')
    const [selected, setSelected] = useState<Declaration | null>(null)
    const [openingId, setOpeningId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [openError, setOpenError] = useState<string | null>(null)
    const filtered = filter === 'Toate' ? declarations : declarations.filter(d => d.status === filter)

    const handleRowClick = async (declaration: Declaration) => {
        if (openingId) return
        if (!onOpenDeclaration) {
            setSelected(declaration)
            return
        }

        setOpeningId(declaration.id)
        setOpenError(null)

        try {
            await onOpenDeclaration(declaration)
            setSelected(declaration)
        } catch {
            setOpenError('Nu s-a putut deschide declarația.')
        } finally {
            setOpeningId(null)
        }
    }

    const handleDeleteClick = async (event: MouseEvent<HTMLButtonElement>, declaration: Declaration) => {
        event.stopPropagation()

        if (!onDeleteDeclaration || deletingId) return

        setDeletingId(declaration.id)
        setOpenError(null)

        try {
            await onDeleteDeclaration(declaration)
            if (selected?.id === declaration.id) {
                setSelected(null)
            }
        } catch {
            setOpenError('Nu s-a putut șterge declarația.')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <>
            <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <p className="mb-4 text-base font-semibold text-gray-900">Distribuție după status</p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {STATUSES.slice(1).map(s => (
                            <div key={s} className={`rounded-lg px-4 py-3 ${STATUS_COLORS[s]}`}>
                                <p className="text-lg font-bold">{declarations.filter(d => d.status === s).length}</p>
                                <p className="text-xs font-medium">{STATUS_LABELS_RO[s] ?? s}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
                        <div>
                            <p className="text-base font-semibold text-gray-900">Declarații</p>
                            <p className="mt-0.5 text-sm text-gray-500">{filtered.length} din {declarations.length} înregistrări</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {STATUSES.map(s => (
                                <button key={s} onClick={() => setFilter(s)}
                                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                        filter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}>
                                    {STATUS_LABELS_RO[s] ?? s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {openError ? (
                        <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">
                            {openError}
                        </div>
                    ) : null}

                    {filtered.length === 0 ? (
                        <p className="px-6 py-8 text-center text-sm text-gray-400">Nu există declarații pentru filtrul selectat.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Tracking Code</th>
                                        {resolveDeclarationInfo ? <th className="px-6 py-3 font-medium">Proprietar</th> : null}
                                        {resolveDeclarationInfo ? <th className="px-6 py-3 font-medium">Tip</th> : null}
                                        <th className="px-6 py-3 font-medium">Descriere</th>
                                        {resolveDeclarationInfo ? <th className="px-6 py-3 font-medium">Documente</th> : null}
                                        <th className="px-6 py-3 font-medium">Cantitate</th>
                                        <th className="px-6 py-3 font-medium">Valoare vamală</th>
                                        <th className="px-6 py-3 font-medium">Taxă vamală</th>
                                        <th className="px-6 py-3 font-medium">TVA</th>
                                        <th className="px-6 py-3 font-medium">Valoarea totală</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        {onDeleteDeclaration ? <th className="px-6 py-3 font-medium">Acțiuni</th> : null}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filtered.map(d => {
                                        const isOpening = openingId === d.id
                                        const isDeleting = deletingId === d.id
                                        const declarationInfo = resolveDeclarationInfo?.(d)
                                        return (
                                            <tr
                                                key={d.id}
                                                className={`cursor-pointer transition-colors ${
                                                    isOpening ? 'opacity-60' : 'hover:bg-blue-50'
                                                }`}
                                                onClick={() => handleRowClick(d)}
                                            >
                                                <td className="px-6 py-3 font-mono text-xs font-medium text-gray-900">{d.awb_number}</td>
                                                {resolveDeclarationInfo ? (
                                                    <td className="px-6 py-3 text-gray-700 whitespace-nowrap">{declarationInfo?.packageOwner ?? '—'}</td>
                                                ) : null}
                                                {resolveDeclarationInfo ? (
                                                    <td className="px-6 py-3 whitespace-nowrap">
                                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            declarationInfo?.personType === 'Persoană Fizică'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                            {declarationInfo?.personType ?? '—'}
                                                        </span>
                                                    </td>
                                                ) : null}
                                                <td className="px-6 py-3 text-gray-700">{d.description}</td>
                                                {resolveDeclarationInfo ? (
                                                    <td className="px-6 py-3 whitespace-nowrap">
                                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            declarationInfo?.documentsCount
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {declarationInfo?.documentsCount
                                                                ? `${declarationInfo.documentsCount} atașat(e)`
                                                                : 'Fără documente'}
                                                        </span>
                                                    </td>
                                                ) : null}
                                                <td className="px-6 py-3 text-gray-700">{d.quantity}</td>
                                                <td className="px-6 py-3 text-gray-700">{fmt(d.customs_value, d.currency)}</td>
                                                <td className="px-6 py-3 text-gray-700">{fmt(d.customs_duty, d.currency)}</td>
                                                <td className="px-6 py-3 text-gray-700">{fmt(d.vat, d.currency)}</td>
                                                <td className="px-6 py-3 font-medium text-gray-900">{fmt(d.total_taxes, d.currency)}</td>
                                                <td className="px-6 py-3"><StatusBadge status={d.status} /></td>
                                                {onDeleteDeclaration ? (
                                                    <td className="px-6 py-3">
                                                        <button
                                                            type="button"
                                                            onClick={(event) => handleDeleteClick(event, d)}
                                                            disabled={isDeleting}
                                                            className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {isDeleting ? 'Se șterge...' : 'Șterge'}
                                                        </button>
                                                    </td>
                                                ) : null}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                                <tfoot className="border-t-2 border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800">
                                    <tr>
                                        <td colSpan={resolveDeclarationInfo ? 6 : 3} className="px-6 py-3 text-right text-xs uppercase tracking-wide text-gray-500">
                                            Total ({filtered.length}):
                                        </td>
                                        <td className="px-6 py-3">{fmt(filtered.reduce((s, d) => s + d.customs_value, 0))}</td>
                                        <td className="px-6 py-3">{fmt(filtered.reduce((s, d) => s + d.customs_duty, 0))}</td>
                                        <td className="px-6 py-3">{fmt(filtered.reduce((s, d) => s + d.vat, 0))}</td>
                                        <td className="px-6 py-3">{fmt(filtered.reduce((s, d) => s + d.total_taxes, 0))}</td>
                                        <td colSpan={onDeleteDeclaration ? 2 : 1} />
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {selected && (
                <DeclarationModal
                    d={selected}
                    user={resolveUser?.(selected.user_id)}
                    onClose={() => setSelected(null)}
                    onSave={onUpdateDeclaration}
                    productCategories={productCategories}
                    canEditStatus={canEditStatus}
                />
            )}
        </>
    )
}
