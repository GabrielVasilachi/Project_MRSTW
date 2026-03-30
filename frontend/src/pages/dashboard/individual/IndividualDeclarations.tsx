import physicalData from '../../../_mock/mock_persoana_fizica.json'
import { getSession } from '../../../auth/auth.session'
import type { Declaration } from '../../../types/declaration'
import type { PhysicalUser } from '../../../types/user'
import KpiCard from '../../../components/dashboard/KpiCard'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'

export default function IndividualDeclarations() {
    const users = physicalData.users as PhysicalUser[]
    const declarations = physicalData.declarations as Declaration[]

    const session = getSession()
    const user = users.find(u => u.id === session?.userId) ?? users[0]
    if (!user) return null

    const userDeclarations = declarations.filter(d => d.user_id === user.id)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Declarațiile mele</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Vizualizează toate declarațiile create și accesează detaliile fiecăreia.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Total declarații" value={String(userDeclarations.length)} />
                <KpiCard label="Valoare vamală totală" value={`${userDeclarations.reduce((s, d) => s + d.customs_value, 0)} MDL`} />
                <KpiCard label="Taxe totale" value={`${userDeclarations.reduce((s, d) => s + d.total_taxes, 0)} MDL`} />
            </div>

            <DeclarationsTable declarations={userDeclarations} />
        </div>
    )
}
