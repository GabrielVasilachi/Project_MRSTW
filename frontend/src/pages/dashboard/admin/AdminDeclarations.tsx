import physicalData from '../../../_mock/mock_persoana_fizica.json'
import juridicalData from '../../../_mock/mock_persoana_juridica.json'
import type { Declaration } from '../../../types/declaration'
import KpiCard from '../../../components/dashboard/KpiCard'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'

export default function AdminDeclarations() {
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

    const pending = allDeclarations.filter(d => d.status === 'Pending Documents').length
    const underReview = allDeclarations.filter(d => d.status === 'Under Review').length
    const approved = allDeclarations.filter(d => d.status === 'Approved').length
    const rejected = allDeclarations.filter(d => d.status === 'Rejected').length

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Declarații vamale</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Vizualizați și gestionați toate declarațiile vamale – aprobare, respingere sau modificare status.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total declarații" value={String(allDeclarations.length)} />
                <KpiCard label="Aprobate" value={String(approved)} sub="status Approved" />
                <KpiCard label="În procesare" value={String(underReview + pending)} sub="Under Review + Pending" />
                <KpiCard label="Respinse" value={String(rejected)} sub="status Rejected" />
            </div>

            <DeclarationsTable declarations={allDeclarations} resolveUser={resolveUser} />
        </div>
    )
}
