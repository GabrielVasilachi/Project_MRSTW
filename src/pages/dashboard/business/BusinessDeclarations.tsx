import juridicalData from '../../../_mock/mock_persoana_juridica.json'
import { getSession } from '../../../auth/auth.session'
import type { Declaration } from '../../../types/declaration'
import type { JuridicalUser } from '../../../types/user'
import KpiCard from '../../../components/dashboard/KpiCard'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'

export default function BusinessDeclarations() {
    const companies = juridicalData.users as JuridicalUser[]
    const declarations = juridicalData.declarations as Declaration[]

    const session = getSession()
    const company = companies.find(u => u.id === session?.userId) ?? companies[0]
    if (!company) return null

    const companyDeclarations = declarations.filter(d => d.user_id === company.id)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Declarații companie</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Toate declarațiile vamale create în numele firmei <strong>{company.company_name}</strong>.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Total declarații" value={String(companyDeclarations.length)} />
                <KpiCard label="Valoare vamală totală" value={`${companyDeclarations.reduce((s, d) => s + d.customs_value, 0)} MDL`} />
                <KpiCard label="Taxe totale" value={`${companyDeclarations.reduce((s, d) => s + d.total_taxes, 0)} MDL`} />
            </div>

            <DeclarationsTable declarations={companyDeclarations} />
        </div>
    )
}
