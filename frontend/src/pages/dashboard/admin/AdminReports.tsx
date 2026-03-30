import physicalData from '../../../_mock/mock_persoana_fizica.json'
import juridicalData from '../../../_mock/mock_persoana_juridica.json'
import type { Declaration } from '../../../types/declaration'
import KpiCard from '../../../components/dashboard/KpiCard'
import { STATUS_COLORS } from '../../../components/dashboard/StatusBadge'

const STATUSES = ['Approved', 'Under Review', 'Pending Documents', 'Rejected']

export default function AdminReports() {
    const physicalDeclarations = physicalData.declarations as Declaration[]
    const juridicalDeclarations = juridicalData.declarations as Declaration[]
    const allDeclarations = [...physicalDeclarations, ...juridicalDeclarations]

    const totalCustomsValue = allDeclarations.reduce((s, d) => s + d.customs_value, 0)
    const totalTaxes = allDeclarations.reduce((s, d) => s + d.total_taxes, 0)
    const totalVat = allDeclarations.reduce((s, d) => s + d.vat, 0)
    const totalDuty = allDeclarations.reduce((s, d) => s + d.customs_duty, 0)

    const topUsers = [
        ...physicalData.users.map(u => ({
            name: u.full_name, type: 'Fizică',
            count: allDeclarations.filter(d => d.user_id === u.id).length,
            taxes: allDeclarations.filter(d => d.user_id === u.id).reduce((s, d) => s + d.total_taxes, 0),
        })),
        ...juridicalData.users.map(u => ({
            name: u.company_name, type: 'Juridică',
            count: allDeclarations.filter(d => d.user_id === u.id).length,
            taxes: allDeclarations.filter(d => d.user_id === u.id).reduce((s, d) => s + d.total_taxes, 0),
        })),
    ].sort((a, b) => b.count - a.count)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Rapoarte</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Statistici și analize privind numărul declarațiilor, taxele colectate și activitatea utilizatorilor.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total declarații" value={String(allDeclarations.length)} sub={`${physicalDeclarations.length} fizice · ${juridicalDeclarations.length} juridice`} />
                <KpiCard label="Valoare vamală totală" value={`${totalCustomsValue.toLocaleString()} MDL`} />
                <KpiCard label="TVA total colectat" value={`${totalVat.toLocaleString()} MDL`} />
                <KpiCard label="Taxe vamale totale" value={`${totalDuty.toLocaleString()} MDL`} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Status breakdown */}
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <p className="mb-4 text-base font-semibold text-gray-900">Distribuție după status</p>
                    <div className="space-y-3">
                        {STATUSES.map(s => {
                            const count = allDeclarations.filter(d => d.status === s).length
                            const pct = allDeclarations.length ? Math.round((count / allDeclarations.length) * 100) : 0
                            return (
                                <div key={s}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[s] ?? 'bg-gray-100 text-gray-700'}`}>{s}</span>
                                        <span className="text-gray-600">{count} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100">
                                        <div className="h-2 rounded-full bg-gray-900 transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Tip utilizator breakdown */}
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <p className="mb-4 text-base font-semibold text-gray-900">Declarații pe tip de utilizator</p>
                    <div className="space-y-4">
                        {[
                            { label: 'Persoane fizice', declarations: physicalDeclarations, users: physicalData.users.length },
                            { label: 'Persoane juridice', declarations: juridicalDeclarations, users: juridicalData.users.length },
                        ].map(row => (
                            <div key={row.label} className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm font-semibold text-gray-900">{row.label}</p>
                                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
                                    <div>
                                        <p className="text-lg font-bold text-gray-900">{row.users}</p>
                                        <p>Utilizatori</p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-gray-900">{row.declarations.length}</p>
                                        <p>Declarații</p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-gray-900">{row.declarations.reduce((s, d) => s + d.total_taxes, 0).toLocaleString()}</p>
                                        <p>MDL taxe</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top users table */}
            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <p className="text-base font-semibold text-gray-900">Activitate utilizatori</p>
                    <p className="mt-0.5 text-sm text-gray-500">Ordonat după numărul de declarații</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                            <tr>
                                {['#', 'Utilizator', 'Tip cont', 'Declarații', 'Total taxe (MDL)'].map(h => (
                                    <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {topUsers.map((u, i) => (
                                <tr key={u.name} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                                    <td className="px-6 py-3 font-medium text-gray-900">{u.name}</td>
                                    <td className="px-6 py-3 text-gray-500">{u.type}</td>
                                    <td className="px-6 py-3 font-semibold text-gray-900">{u.count}</td>
                                    <td className="px-6 py-3 text-gray-700">{u.taxes.toLocaleString()} MDL</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t-2 border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800">
                            <tr>
                                <td colSpan={3} className="px-6 py-3 text-right text-xs uppercase tracking-wide text-gray-500">Total:</td>
                                <td className="px-6 py-3">{allDeclarations.length}</td>
                                <td className="px-6 py-3">{totalTaxes.toLocaleString()} MDL</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}
