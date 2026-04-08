import { useState } from 'react'
import physicalData from '../../../_mock/mock_persoana_fizica.json'
import { getSession } from '../../../auth/auth.session'
import type { Declaration } from '../../../types/declaration'
import type { PhysicalUser } from '../../../types/user'
import KpiCard from '../../../components/dashboard/KpiCard'
import { STATUS_COLORS } from '../../../components/dashboard/StatusBadge'
import StatusBadge from '../../../components/dashboard/StatusBadge'
import RowDetailModal, { ModalField, ModalBadge, ModalSection, TaxesTable } from '../../../components/dashboard/RowDetailModal'
import { fmt } from '../../../utils/format'

function paymentStatus(status: string) {
    return status === 'Approved' ? 'Achitat' : status === 'Rejected' ? 'Anulat' : 'În așteptare'
}
const PAY_COLORS: Record<string, string> = {
    'Achitat': 'bg-green-100 text-green-800',
    'În așteptare': 'bg-yellow-100 text-yellow-800',
    'Anulat': 'bg-red-100 text-red-800',
}

type PaymentRow = Declaration & { invoice_no: string }

function PaymentModal({ row, onClose }: { row: PaymentRow; onClose: () => void }) {
    const ps = paymentStatus(row.status)
    return (
        <RowDetailModal title={`Detalii factură ${row.invoice_no}`} onClose={onClose}>
            <ModalSection>
                <ModalBadge label="Status plată" value={ps} color={PAY_COLORS[ps]} />
                <ModalBadge label="Status declarație" value={row.status} color={STATUS_COLORS[row.status] ?? 'bg-gray-100 text-gray-700'} />
                <ModalField label="AWB" value={row.awb_number} mono />
                <ModalField label="Cod HS" value={row.hs_code} mono />
                <ModalField label="Descriere" value={row.description} />
                <ModalField label="Cantitate" value={row.quantity} />
                <ModalField label="Greutate brută" value={`${row.gross_weight} kg`} />
                <ModalField label="Valoare vamală" value={fmt(row.customs_value, row.currency)} />
            </ModalSection>

            <div className="px-6 pb-5">
                <p className="mb-3 text-base font-semibold text-gray-900">Taxe estimate</p>
                <TaxesTable
                    rows={[
                        { label: 'TVA', amount: row.vat },
                        { label: 'Taxă vamală', amount: row.customs_duty },
                        ...(row.excise > 0 ? [{ label: 'Accize', amount: row.excise }] : []),
                    ]}
                    total={row.total_taxes}
                    currency={row.currency}
                />
            </div>
        </RowDetailModal>
    )
}

export default function IndividualPayments() {
    const users = physicalData.users as PhysicalUser[]
    const declarations = physicalData.declarations as Declaration[]
    const [selected, setSelected] = useState<PaymentRow | null>(null)

    const session = getSession()
    const user = users.find(u => u.id === session?.userId) ?? users[0]
    if (!user) return null

    const userDeclarations = declarations.filter(d => d.user_id === user.id)
    const rows: PaymentRow[] = userDeclarations.map((d, i) => ({
        ...d,
        invoice_no: `INV-2025-${String(i + 1).padStart(4, '0')}`,
    }))

    const paid = userDeclarations.filter(d => d.status === 'Approved')
    const pending = userDeclarations.filter(d => d.status !== 'Approved' && d.status !== 'Rejected')

    return (
        <>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Plăți</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Taxele calculate pentru fiecare declarație și istoricul plăților.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <KpiCard label="Total datorat" value={fmt(userDeclarations.reduce((s, d) => s + d.total_taxes, 0))} />
                    <KpiCard label="Achitat" value={fmt(paid.reduce((s, d) => s + d.total_taxes, 0))} sub={`${paid.length} declarații`} />
                    <KpiCard label="În așteptare" value={fmt(pending.reduce((s, d) => s + d.total_taxes, 0))} sub={`${pending.length} declarații`} />
                </div>

                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <p className="text-base font-semibold text-gray-900">Istoricul plăților</p>
                        <p className="mt-0.5 text-sm text-gray-500">{rows.length} declarații</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    {['Nr. Factură', 'AWB', 'Descriere', 'Valoare vamală', 'TVA', 'Taxe vamale', 'Total', 'Status decl.', 'Status plată'].map(h => (
                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {rows.map(row => (
                                    <tr
                                        key={row.id}
                                        className="cursor-pointer hover:bg-blue-50 transition-colors"
                                        onClick={() => setSelected(row)}
                                    >
                                        <td className="px-6 py-3 font-mono text-xs text-gray-600">{row.invoice_no}</td>
                                        <td className="px-6 py-3 font-mono text-xs font-medium text-gray-900">{row.awb_number}</td>
                                        <td className="px-6 py-3 text-gray-700">{row.description}</td>
                                        <td className="px-6 py-3 text-gray-700">{fmt(row.customs_value, row.currency)}</td>
                                        <td className="px-6 py-3 text-gray-700">{fmt(row.vat, row.currency)}</td>
                                        <td className="px-6 py-3 text-gray-700">{fmt(row.customs_duty, row.currency)}</td>
                                        <td className="px-6 py-3 font-semibold text-gray-900">{fmt(row.total_taxes, row.currency)}</td>
                                        <td className="px-6 py-3"><StatusBadge status={row.status} /></td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${PAY_COLORS[paymentStatus(row.status)]}`}>
                                                {paymentStatus(row.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="border-t-2 border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800">
                                <tr>
                                    <td colSpan={3} className="px-6 py-3 text-right text-xs uppercase tracking-wide text-gray-500">Total:</td>
                                    <td className="px-6 py-3">{fmt(userDeclarations.reduce((s, d) => s + d.customs_value, 0))}</td>
                                    <td className="px-6 py-3">{fmt(userDeclarations.reduce((s, d) => s + d.vat, 0))}</td>
                                    <td className="px-6 py-3">{fmt(userDeclarations.reduce((s, d) => s + d.customs_duty, 0))}</td>
                                    <td className="px-6 py-3">{fmt(userDeclarations.reduce((s, d) => s + d.total_taxes, 0))}</td>
                                    <td /><td />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            {selected && <PaymentModal row={selected} onClose={() => setSelected(null)} />}
        </>
    )
}
