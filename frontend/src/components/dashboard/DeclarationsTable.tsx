import { useState } from 'react'
import type { Declaration } from '../../types/declaration'
import StatusBadge from './StatusBadge'
import { STATUS_COLORS, STATUS_LABELS_RO } from './statusColors'
import RowDetailModal, { ModalField, ModalBadge, ModalSection, TaxesTable } from './RowDetailModal'
import { fmt } from '../../utils/format'

const STATUSES = ['Toate', 'Approved', 'Pending Documents', 'Under Review', 'Rejected']

type Props = {
    declarations: Declaration[]
    resolveUser?: (userId: string) => { name: string; type: string }
    onOpenDeclaration?: (declaration: Declaration) => Promise<void>
}

function DeclarationModal({ d, user, onClose }: {
    d: Declaration
    user?: { name: string; type: string }
    onClose: () => void
}) {
    const statusColor =
        d.status === 'Approved' ? 'bg-green-100 text-green-800' :
        d.status === 'Rejected' ? 'bg-red-100 text-red-800' :
        d.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
        'bg-yellow-100 text-yellow-800'

    return (
        <RowDetailModal title={`Detalii declarație - Tracking Code: ${d.awb_number}`} onClose={onClose}>
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
            </div>
        </RowDetailModal>
    )
}

export default function DeclarationsTable({ declarations, resolveUser, onOpenDeclaration }: Props) {
    const [filter, setFilter] = useState('Toate')
    const [selected, setSelected] = useState<Declaration | null>(null)
    const [openingId, setOpeningId] = useState<string | null>(null)
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
                                        <th className="px-6 py-3 font-medium">Descriere</th>
                                        <th className="px-6 py-3 font-medium">Cantitate</th>
                                        <th className="px-6 py-3 font-medium">Valoare vamală</th>
                                        <th className="px-6 py-3 font-medium">Taxă vamală</th>
                                        <th className="px-6 py-3 font-medium">TVA</th>
                                        <th className="px-6 py-3 font-medium">Valoarea totală</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filtered.map(d => {
                                        const isOpening = openingId === d.id
                                        return (
                                            <tr
                                                key={d.id}
                                                className={`cursor-pointer transition-colors ${
                                                    isOpening ? 'opacity-60' : 'hover:bg-blue-50'
                                                }`}
                                                onClick={() => handleRowClick(d)}
                                            >
                                                <td className="px-6 py-3 font-mono text-xs font-medium text-gray-900">{d.awb_number}</td>
                                                <td className="px-6 py-3 text-gray-700">{d.description}</td>
                                                <td className="px-6 py-3 text-gray-700">{d.quantity}</td>
                                                <td className="px-6 py-3 text-gray-700">{fmt(d.customs_value, d.currency)}</td>
                                                <td className="px-6 py-3 text-gray-700">{fmt(d.customs_duty, d.currency)}</td>
                                                <td className="px-6 py-3 text-gray-700">{fmt(d.vat, d.currency)}</td>
                                                <td className="px-6 py-3 font-medium text-gray-900">{fmt(d.total_taxes, d.currency)}</td>
                                                <td className="px-6 py-3"><StatusBadge status={d.status} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                                <tfoot className="border-t-2 border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-3 text-right text-xs uppercase tracking-wide text-gray-500">
                                            Total ({filtered.length}):
                                        </td>
                                        <td className="px-6 py-3">{fmt(filtered.reduce((s, d) => s + d.customs_value, 0))}</td>
                                        <td className="px-6 py-3">{fmt(filtered.reduce((s, d) => s + d.customs_duty, 0))}</td>
                                        <td className="px-6 py-3">{fmt(filtered.reduce((s, d) => s + d.vat, 0))}</td>
                                        <td className="px-6 py-3">{fmt(filtered.reduce((s, d) => s + d.total_taxes, 0))}</td>
                                        <td />
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
                />
            )}
        </>
    )
}
