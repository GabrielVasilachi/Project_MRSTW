import type { Declaration } from '../../../types/declaration'
import KpiCard from '../../../components/dashboard/KpiCard'
import { fmt } from '../../../utils/format'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'
import BusinessVerificationBanner from '../../../components/dashboard/BusinessVerificationBanner'
import { useBusinessProfileName } from './businessProfileData'

export default function BusinessDeclarations() {
    const companyName = useBusinessProfileName()
    const companyDeclarations: Declaration[] = []

    return (
        <div className="space-y-8">
            <BusinessVerificationBanner />

            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Declarații companie</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Declarațiile firmei <strong>{companyName}</strong> vor apărea aici când backend-ul le va expune.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Total declarații" value={String(companyDeclarations.length)} />
                <KpiCard label="Valoare vamală totală" value={fmt(companyDeclarations.reduce((s, d) => s + d.customs_value, 0))} />
                <KpiCard label="Taxe totale" value={fmt(companyDeclarations.reduce((s, d) => s + d.total_taxes, 0))} />
            </div>

            <DeclarationsTable declarations={companyDeclarations} />
        </div>
    )
}
