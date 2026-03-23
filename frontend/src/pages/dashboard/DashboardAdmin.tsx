import physicalData from '../../_mock/mock_persoana_fizica.json'
import juridicalData from '../../_mock/mock_persoana_juridica.json'
import type { Declaration } from '../../types/declaration'
import KpiCard from '../../components/dashboard/KpiCard'
import DeclarationsTable from '../../components/dashboard/DeclarationsTable'
import AllUsersTable from '../../components/dashboard/AllUsersTable'

export default function DashboardAdmin() {
    const allDeclarations = [
        ...physicalData.declarations as Declaration[],
        ...juridicalData.declarations as Declaration[],
    ]

    function resolveUser(userId: string) {
        const physical = physicalData.users.find(u => u.id === userId)
        if (physical) return { name: physical.full_name, type: 'Fizică' }
        const juridical = juridicalData.users.find(u => u.id === userId)
        return { name: juridical?.company_name ?? userId, type: 'Juridică' }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Panou de administrare</h1>
                <p className="mt-1 text-sm text-gray-500">Vizualizare completă a utilizatorilor și declarațiilor vamale</p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Utilizatori totali"
                    value={String(physicalData.users.length + juridicalData.users.length)}
                    sub={`${physicalData.users.length} fizici · ${juridicalData.users.length} juridici`} />
                <KpiCard label="Declarații totale" value={String(allDeclarations.length)} />
                <KpiCard label="Valoare vamală totală" value={`${allDeclarations.reduce((s, d) => s + d.customs_value, 0)} MDL`} />
                <KpiCard label="Taxe totale" value={`${allDeclarations.reduce((s, d) => s + d.total_taxes, 0)} MDL`} />
            </div>

            <AllUsersTable
                physicalUsers={physicalData.users}
                juridicalUsers={juridicalData.users}
                decCountFor={id => allDeclarations.filter(d => d.user_id === id).length}
            />

            <DeclarationsTable declarations={allDeclarations} resolveUser={resolveUser} />
        </div>
    )
}
