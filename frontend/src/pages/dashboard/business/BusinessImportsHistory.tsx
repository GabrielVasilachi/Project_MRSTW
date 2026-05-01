import type { Declaration } from '../../../types/declaration'
import KpiCard from '../../../components/dashboard/KpiCard'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'
import BusinessVerificationBanner from '../../../components/dashboard/BusinessVerificationBanner'
import { fmt } from '../../../utils/format'
import { useBusinessProfileName } from './businessProfileData'

export default function BusinessImportsHistory() {
    const companyName = useBusinessProfileName()
    const companyDeclarations: Declaration[] = []
    const finalized = companyDeclarations.filter(d => d.status === 'Approved' || d.status === 'Rejected')
    const totalImportValue = finalized.reduce((s, d) => s + d.customs_value, 0)
    const totalTaxesPaid = finalized.filter(d => d.status === 'Approved').reduce((s, d) => s + d.total_taxes, 0)

    return (
        <div className="space-y-8">
            <BusinessVerificationBanner />

            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Importuri / Istoric</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Istoricul firmei <strong>{companyName}</strong> va apărea când backend-ul va expune declarațiile finalizate.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total importuri" value={String(companyDeclarations.length)} />
                <KpiCard label="Finalizate" value={String(finalized.length)} sub={`${companyDeclarations.length - finalized.length} în curs`} />
                <KpiCard label="Valoare totală" value={fmt(totalImportValue)} sub="declarații finalizate" />
                <KpiCard label="Taxe achitate" value={fmt(totalTaxesPaid)} />
            </div>

            <DeclarationsTable declarations={companyDeclarations} />
        </div>
    )
}
