import physicalData from '../../_mock/mock_persoana_fizica.json'
import { getSession } from '../../auth/auth.session'
import type { Declaration } from '../../types/declaration'
import type { PhysicalUser } from '../../types/user'
import KpiCard from '../../components/dashboard/KpiCard'
import DeclarationsTable from '../../components/dashboard/DeclarationsTable'

export default function DashboardIndividual() {
    const users = physicalData.users as PhysicalUser[]
    const declarations = physicalData.declarations as Declaration[]

    const session = getSession()
    const user = users.find(u => u.id === session?.userId) ?? users[0]
    if (!user) return null

    const userDeclarations = declarations.filter(d => d.user_id === user.id)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
                <p className="mt-1 text-sm text-gray-500">Persoană fizică · {user.email}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 divide-y divide-gray-100">
                <p className="pb-3 text-base font-semibold text-gray-900">Date personale</p>
                {([['IDNP', user.idnp], ['Email', user.email], ['Telefon', user.phone], ['Adresă', user.address]] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2 text-sm">
                        <span className="text-gray-600">{label}</span>
                        <span className="font-medium text-gray-900">{value}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Declarații" value={String(userDeclarations.length)} />
                <KpiCard label="Valoare vamală totală" value={`${userDeclarations.reduce((s, d) => s + d.customs_value, 0)} MDL`} />
                <KpiCard label="Taxe totale" value={`${userDeclarations.reduce((s, d) => s + d.total_taxes, 0)} MDL`} />
            </div>

            <DeclarationsTable declarations={userDeclarations} />
        </div>
    )
}
