import { useState } from 'react'
import physicalData from '../../../_mock/mock_persoana_fizica.json'
import juridicalData from '../../../_mock/mock_persoana_juridica.json'
import type { Declaration } from '../../../types/declaration'
import KpiCard from '../../../components/dashboard/KpiCard'
import { STATUS_COLORS } from '../../../components/dashboard/StatusBadge'
import StatusBadge from '../../../components/dashboard/StatusBadge'
import RowDetailModal, { ModalField, ModalBadge, ModalSection, TaxesTable } from '../../../components/dashboard/RowDetailModal'
import { fmt } from '../../../utils/format'

type InvoiceStatus = 'Achitat' | 'În așteptare' | 'Restant'

function invoiceStatus(decStatus: string): InvoiceStatus {
    if (decStatus === 'Approved') return 'Achitat'
    if (decStatus === 'Under Review') return 'În așteptare'
    return 'Restant'
}

const INV_COLORS: Record<InvoiceStatus, string> = {
    'Achitat': 'bg-green-100 text-green-800',
    'În așteptare': 'bg-yellow-100 text-yellow-800',
    'Restant': 'bg-red-100 text-red-800',
}

type Invoice = Declaration & { invoice_no: string; payment_status: InvoiceStatus }

const ALL_FILTERS: (InvoiceStatus | 'Toate')[] = ['Toate', 'Achitat', 'În așteptare', 'Restant']

function InvoiceModal({ inv, user, onClose }: {
    inv: Invoice
    user: { name: string; type: string }
    onClose: () => void
}) {
    return (
        <RowDetailModal title={`Detalii factură ${inv.invoice_no}`} onClose={onClose}>
            <ModalSection>
                <ModalBadge label="Status plată" value={inv.payment_status} color={INV_COLORS[inv.payment_status]} />
                <ModalBadge label="Status declarație" value={inv.status} color={STATUS_COLORS[inv.status] ?? 'bg-gray-100 text-gray-700'} />
                <ModalField label="Utilizator" value={user.name} />
                <ModalField label="Tip cont" value={user.type} />
                <ModalField label="AWB" value={inv.awb_number} mono />
                <ModalField label="Cod HS" value={inv.hs_code} mono />
                <ModalField label="Descriere" value={inv.description} />
                <ModalField label="Cantitate" value={inv.quantity} />
                <ModalField label="Greutate brută" value={`${inv.gross_weight} kg`} />
                <ModalField label="Valoare vamală" value={fmt(inv.customs_value, inv.currency)} />
            </ModalSection>

            <div className="px-6 pb-5">
                <p className="mb-3 text-base font-semibold text-gray-900">Taxe estimate</p>
                <TaxesTable
                    rows={[
                        { label: 'TVA', amount: inv.vat },
                        { label: 'Taxă vamală', amount: inv.customs_duty },
                        ...(inv.excise > 0 ? [{ label: 'Accize', amount: inv.excise }] : []),
                    ]}
                    total={inv.total_taxes}
                    currency={inv.currency}
                />
            </div>
        </RowDetailModal>
    )
}

export default function AdminInvoices() {
    const [filter, setFilter] = useState<InvoiceStatus | 'Toate'>('Toate')
    const [selected, setSelected] = useState<Invoice | null>(null)

    const allDeclarations = [
        ...physicalData.declarations as Declaration[],
        ...juridicalData.declarations as Declaration[],
    ]

    function resolveUser(userId: string) {
        const ph = physicalData.users.find(u => u.id === userId)
        if (ph) return { name: ph.full_name, type: 'Fizică' }
        const ju = juridicalData.users.find(u => u.id === userId)
        return { name: ju?.company_name ?? userId, type: 'Juridică' }
    }

    const invoices: Invoice[] = allDeclarations.map((d, i) => ({
        ...d,
        invoice_no: `INV-2025-${String(i + 1).padStart(4, '0')}`,
        payment_status: invoiceStatus(d.status),
    }))

    const filtered = filter === 'Toate' ? invoices : invoices.filter(inv => inv.payment_status === filter)

    const totalAchitat = invoices.filter(i => i.payment_status === 'Achitat').reduce((s, i) => s + i.total_taxes, 0)
    const totalPending = invoices.filter(i => i.payment_status !== 'Achitat').reduce((s, i) => s + i.total_taxes, 0)

    return (
        <>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Invoice-uri</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Lista facturilor generate pentru declarații – verificați statusul plăților și confirmați încasările.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <KpiCard label="Total facturi" value={String(invoices.length)} />
                    <KpiCard label="Achitate" value={String(invoices.filter(i => i.payment_status === 'Achitat').length)} sub={fmt(totalAchitat)} />
                    <KpiCard label="În așteptare" value={String(invoices.filter(i => i.payment_status === 'În așteptare').length)} />
                    <KpiCard label="Restante" value={String(invoices.filter(i => i.payment_status === 'Restant').length)} sub={`${fmt(totalPending)} neîncasați`} />
                </div>

                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
                        <div>
                            <p className="text-base font-semibold text-gray-900">Facturi</p>
                            <p className="mt-0.5 text-sm text-gray-500">{filtered.length} din {invoices.length} înregistrări</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {ALL_FILTERS.map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                        filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    {['Nr. Factură', 'AWB', 'Utilizator', 'Tip', 'Valoare vamală', 'TVA', 'Taxe vamale', 'Total taxe', 'Status decl.', 'Status plată'].map(h => (
                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(inv => {
                                    const user = resolveUser(inv.user_id)
                                    return (
                                        <tr
                                            key={inv.id}
                                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                                            onClick={() => setSelected(inv)}
                                        >
                                            <td className="px-6 py-3 font-mono text-xs font-medium text-gray-900">{inv.invoice_no}</td>
                                            <td className="px-6 py-3 font-mono text-xs text-gray-600">{inv.awb_number}</td>
                                            <td className="px-6 py-3 font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-3 text-gray-500">{user.type}</td>
                                            <td className="px-6 py-3 text-gray-700">{fmt(inv.customs_value, inv.currency)}</td>
                                            <td className="px-6 py-3 text-gray-700">{fmt(inv.vat, inv.currency)}</td>
                                            <td className="px-6 py-3 text-gray-700">{fmt(inv.customs_duty, inv.currency)}</td>
                                            <td className="px-6 py-3 font-medium text-gray-900">{fmt(inv.total_taxes, inv.currency)}</td>
                                            <td className="px-6 py-3"><StatusBadge status={inv.status} /></td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${INV_COLORS[inv.payment_status]}`}>
                                                    {inv.payment_status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot className="border-t-2 border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800">
                                <tr>
                                    <td colSpan={4} className="px-6 py-3 text-right text-xs uppercase tracking-wide text-gray-500">
                                        Total ({filtered.length}):
                                    </td>
                                    <td className="px-6 py-3">{fmt(filtered.reduce((s, i) => s + i.customs_value, 0))}</td>
                                    <td className="px-6 py-3">{fmt(filtered.reduce((s, i) => s + i.vat, 0))}</td>
                                    <td className="px-6 py-3">{fmt(filtered.reduce((s, i) => s + i.customs_duty, 0))}</td>
                                    <td className="px-6 py-3">{fmt(filtered.reduce((s, i) => s + i.total_taxes, 0))}</td>
                                    <td /><td />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            {selected && (
                <InvoiceModal
                    inv={selected}
                    user={resolveUser(selected.user_id)}
                    onClose={() => setSelected(null)}
                />
            )}
        </>
    )
}
