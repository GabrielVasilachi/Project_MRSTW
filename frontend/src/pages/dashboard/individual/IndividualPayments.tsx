import physicalData from '../../../_mock/mock_persoana_fizica.json'
import { getSession } from '../../../auth/auth.session'
import type { Declaration } from '../../../types/declaration'
import type { PhysicalUser } from '../../../types/user'
import KpiCard from '../../../components/dashboard/KpiCard'
import StatusBadge from '../../../components/dashboard/StatusBadge'

function paymentStatus(status: string) {
    return status === 'Approved' ? 'Achitat' : status === 'Rejected' ? 'Anulat' : 'În așteptare'
}
const PAY_COLORS: Record<string, string> = {
    'Achitat': 'bg-green-100 text-green-800',
    'În așteptare': 'bg-yellow-100 text-yellow-800',
    'Anulat': 'bg-red-100 text-red-800',
}

export default function IndividualPayments() {
    const users = physicalData.users as PhysicalUser[]
    const declarations = physicalData.declarations as Declaration[]

    const session = getSession()
    const user = users.find(u => u.id === session?.userId) ?? users[0]
    if (!user) return null

    const userDeclarations = declarations.filter(d => d.user_id === user.id)
    const paid = userDeclarations.filter(d => d.status === 'Approved')
    const pending = userDeclarations.filter(d => d.status !== 'Approved' && d.status !== 'Rejected')

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Plăți</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Taxele calculate pentru fiecare declarație și istoricul plăților.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Total datorat" value={`${userDeclarations.reduce((s, d) => s + d.total_taxes, 0)} MDL`} />
                <KpiCard label="Achitat" value={`${paid.reduce((s, d) => s + d.total_taxes, 0)} MDL`} sub={`${paid.length} declarații`} />
                <KpiCard label="În așteptare" value={`${pending.reduce((s, d) => s + d.total_taxes, 0)} MDL`} sub={`${pending.length} declarații`} />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <p className="text-base font-semibold text-gray-900">Istoricul plăților</p>
                    <p className="mt-0.5 text-sm text-gray-500">{userDeclarations.length} declarații</p>
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
                            {userDeclarations.map((d, i) => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-mono text-xs text-gray-600">{`INV-2025-${String(i + 1).padStart(4, '0')}`}</td>
                                    <td className="px-6 py-3 font-mono text-xs font-medium text-gray-900">{d.awb_number}</td>
                                    <td className="px-6 py-3 text-gray-700">{d.description}</td>
                                    <td className="px-6 py-3 text-gray-700">{d.customs_value} MDL</td>
                                    <td className="px-6 py-3 text-gray-700">{d.vat} MDL</td>
                                    <td className="px-6 py-3 text-gray-700">{d.customs_duty} MDL</td>
                                    <td className="px-6 py-3 font-semibold text-gray-900">{d.total_taxes} MDL</td>
                                    <td className="px-6 py-3"><StatusBadge status={d.status} /></td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${PAY_COLORS[paymentStatus(d.status)]}`}>
                                            {paymentStatus(d.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t-2 border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800">
                            <tr>
                                <td colSpan={3} className="px-6 py-3 text-right text-xs uppercase tracking-wide text-gray-500">Total:</td>
                                <td className="px-6 py-3">{userDeclarations.reduce((s, d) => s + d.customs_value, 0)} MDL</td>
                                <td className="px-6 py-3">{userDeclarations.reduce((s, d) => s + d.vat, 0)} MDL</td>
                                <td className="px-6 py-3">{userDeclarations.reduce((s, d) => s + d.customs_duty, 0)} MDL</td>
                                <td className="px-6 py-3">{userDeclarations.reduce((s, d) => s + d.total_taxes, 0)} MDL</td>
                                <td /><td />
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}
