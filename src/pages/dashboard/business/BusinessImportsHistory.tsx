import juridicalData from '../../../_mock/mock_persoana_juridica.json'
import { getSession } from '../../../auth/auth.session'
import type { Declaration } from '../../../types/declaration'
import type { JuridicalUser } from '../../../types/user'
import KpiCard from '../../../components/dashboard/KpiCard'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'

export default function BusinessImportsHistory() {
    const companies = juridicalData.users as JuridicalUser[]
    const declarations = juridicalData.declarations as Declaration[]

    const session = getSession()
    const company = companies.find(u => u.id === session?.userId) ?? companies[0]
    if (!company) return null

    const companyDeclarations = declarations.filter(d => d.user_id === company.id)
    const finalized = companyDeclarations.filter(d => d.status === 'Approved' || d.status === 'Rejected')
    const totalImportValue = finalized.reduce((s, d) => s + d.customs_value, 0)
    const totalTaxesPaid = finalized.filter(d => d.status === 'Approved').reduce((s, d) => s + d.total_taxes, 0)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Importuri / Istoric</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Istoricul complet al importurilor și declarațiilor finalizate ale firmei <strong>{company.company_name}</strong>.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total importuri" value={String(companyDeclarations.length)} />
                <KpiCard label="Finalizate" value={String(finalized.length)} sub={`${companyDeclarations.length - finalized.length} în curs`} />
                <KpiCard label="Valoare totală" value={`${totalImportValue.toLocaleString()} MDL`} sub="declarații finalizate" />
                <KpiCard label="Taxe achitate" value={`${totalTaxesPaid.toLocaleString()} MDL`} />
            </div>

            <DeclarationsTable declarations={companyDeclarations} />
        </div>
    )
}
