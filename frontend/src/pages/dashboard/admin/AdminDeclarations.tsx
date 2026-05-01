import type { Declaration } from '../../../types/declaration'
import KpiCard from '../../../components/dashboard/KpiCard'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'

export default function AdminDeclarations() {
    const allDeclarations: Declaration[] = []
    const pending = allDeclarations.filter(d => d.status === 'Pending Documents').length
    const underReview = allDeclarations.filter(d => d.status === 'Under Review').length
    const approved = allDeclarations.filter(d => d.status === 'Approved').length
    const rejected = allDeclarations.filter(d => d.status === 'Rejected').length

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Declarații vamale</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Declarațiile vor fi afișate aici când backend-ul va expune datele pentru această resursă.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total declarații" value={String(allDeclarations.length)} />
                <KpiCard label="Aprobate" value={String(approved)} />
                <KpiCard label="În procesare" value={String(underReview + pending)} />
                <KpiCard label="Respinse" value={String(rejected)} />
            </div>

            <DeclarationsTable declarations={allDeclarations} />
        </div>
    )
}
