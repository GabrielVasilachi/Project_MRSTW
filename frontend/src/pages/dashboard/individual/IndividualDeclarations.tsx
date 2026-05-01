import type { Declaration } from '../../../types/declaration'
import KpiCard from '../../../components/dashboard/KpiCard'
import { fmt } from '../../../utils/format'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'
import AccountVerificationBanner from '../../../components/dashboard/AccountVerificationBanner'

export default function IndividualDeclarations() {
    const userDeclarations: Declaration[] = []

    return (
        <div className="space-y-8">
            <AccountVerificationBanner />

            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Declarațiile mele</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Declarațiile vor apărea aici când backend-ul va expune datele pentru contul autentificat.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Total declarații" value={String(userDeclarations.length)} />
                <KpiCard label="Valoare vamală totală" value={fmt(userDeclarations.reduce((s, d) => s + d.customs_value, 0))} />
                <KpiCard label="Taxe totale" value={fmt(userDeclarations.reduce((s, d) => s + d.total_taxes, 0))} />
            </div>

            <DeclarationsTable declarations={userDeclarations} />
        </div>
    )
}
