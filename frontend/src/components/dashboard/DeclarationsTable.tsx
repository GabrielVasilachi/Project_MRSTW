import { useState } from 'react'
import type { Declaration } from '../../types/declaration'
import StatusBadge, { STATUS_COLORS } from './StatusBadge'

const STATUSES = ['Toate', 'Approved', 'Pending Documents', 'Under Review', 'Rejected']

type Props = {
    declarations: Declaration[]
    resolveUser?: (userId: string) => { name: string; type: string }
}

export default function DeclarationsTable({ declarations, resolveUser }: Props) {
    const [filter, setFilter] = useState('Toate')
    const filtered = filter === 'Toate' ? declarations : declarations.filter(d => d.status === filter)
    const totalsCols = resolveUser ? 6 : 4

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="mb-4 text-base font-semibold text-gray-900">Distribuție după status</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {STATUSES.slice(1).map(s => (
                        <div key={s} className={`rounded-lg px-4 py-3 ${STATUS_COLORS[s]}`}>
                            <p className="text-lg font-bold">{declarations.filter(d => d.status === s).length}</p>
                            <p className="text-xs font-medium">{s}</p>
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
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-gray-400">Nu există declarații pentru filtrul selectat.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">AWB</th>
                                    {resolveUser && <th className="px-6 py-3 font-medium">Utilizator</th>}
                                    {resolveUser && <th className="px-6 py-3 font-medium">Tip</th>}
                                    <th className="px-6 py-3 font-medium">Descriere</th>
                                    <th className="px-6 py-3 font-medium">Cant.</th>
                                    <th className="px-6 py-3 font-medium">Greut. (kg)</th>
                                    <th className="px-6 py-3 font-medium">Valoare vamală</th>
                                    <th className="px-6 py-3 font-medium">TVA</th>
                                    <th className="px-6 py-3 font-medium">Taxe vamale</th>
                                    <th className="px-6 py-3 font-medium">Total taxe</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(d => {
                                    const user = resolveUser?.(d.user_id)
                                    return (
                                        <tr key={d.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 font-mono text-xs font-medium text-gray-900">{d.awb_number}</td>
                                            {user && <td className="px-6 py-3 font-medium text-gray-900">{user.name}</td>}
                                            {user && <td className="px-6 py-3 text-gray-500">{user.type}</td>}
                                            <td className="px-6 py-3 text-gray-700">{d.description}</td>
                                            <td className="px-6 py-3 text-gray-700">{d.quantity}</td>
                                            <td className="px-6 py-3 text-gray-700">{d.gross_weight}</td>
                                            <td className="px-6 py-3 text-gray-700">{d.customs_value} MDL</td>
                                            <td className="px-6 py-3 text-gray-700">{d.vat} MDL</td>
                                            <td className="px-6 py-3 text-gray-700">{d.customs_duty} MDL</td>
                                            <td className="px-6 py-3 font-medium text-gray-900">{d.total_taxes} MDL</td>
                                            <td className="px-6 py-3"><StatusBadge status={d.status} /></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot className="border-t-2 border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800">
                                <tr>
                                    <td colSpan={totalsCols} className="px-6 py-3 text-right text-xs uppercase tracking-wide text-gray-500">
                                        Total ({filtered.length}):
                                    </td>
                                    <td className="px-6 py-3">{filtered.reduce((s, d) => s + d.customs_value, 0)} MDL</td>
                                    <td className="px-6 py-3">{filtered.reduce((s, d) => s + d.vat, 0)} MDL</td>
                                    <td className="px-6 py-3">{filtered.reduce((s, d) => s + d.customs_duty, 0)} MDL</td>
                                    <td className="px-6 py-3">{filtered.reduce((s, d) => s + d.total_taxes, 0)} MDL</td>
                                    <td />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
