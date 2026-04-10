import { useState } from 'react'
import juridicalData from '../../_mock/mock_persoana_juridica.json'
import { getSession } from '../../auth/auth.session'
import { isSetupCompleted } from '../../auth/setup.status'
import type { Declaration } from '../../types/declaration'
import type { JuridicalUser } from '../../types/user'
import KpiCard from '../../components/dashboard/KpiCard'
import { fmt } from '../../utils/format'
import DeclarationsTable from '../../components/dashboard/DeclarationsTable'
import BusinessSetupModal from '../../components/dashboard/BusinessSetupModal'
import BusinessVerificationBanner from '../../components/dashboard/BusinessVerificationBanner'

export default function DashboardBusiness() {
    const companies = juridicalData.users as JuridicalUser[]
    const declarations = juridicalData.declarations as Declaration[]
    const session = getSession()

    const company = companies.find(u => u.id === session?.userId) ?? companies[0]
    const setupCompleted = company ? isSetupCompleted(company.id) : false
    const [showSetupModal, setShowSetupModal] = useState(() => !setupCompleted)

    if (!company) return null

    const companyDeclarations = declarations.filter(d => d.user_id === company.id)

    const handleSetupComplete = () => {
        setShowSetupModal(false)
    }

    if (showSetupModal && !setupCompleted) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <BusinessSetupModal 
                    userId={company.id} 
                    onComplete={handleSetupComplete}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <BusinessVerificationBanner />

            <div>
                <h1 className="text-2xl font-bold text-gray-900">{company.company_name}</h1>
                <p className="mt-1 text-sm text-gray-500">Persoană juridică · {company.email}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 divide-y divide-gray-100">
                <p className="pb-3 text-base font-semibold text-gray-900">Date companie</p>
                {([['ID fiscal', company.tax_id, false], ['EORI', company.eori, true], ['Email', company.email, true], ['Telefon', company.phone, false], ['Adresă', company.address, false]] as [string, string, boolean][]).map(([label, value, isRequired]) => (
                    <div key={label} className={`flex justify-between py-3 text-sm ${isRequired ? 'bg-red-50' : ''}`}>
                        <div className="flex items-center gap-2">
                            <span className={isRequired ? 'text-red-700 font-medium' : 'text-gray-600'}>{label}</span>
                            {isRequired && (
                                <span className="text-red-500 text-xs font-bold">*</span>
                            )}
                        </div>
                        <span className={`font-medium ${isRequired ? 'text-red-700' : 'text-gray-900'}`}>{value}</span>
                    </div>
                ))}
                <div className="flex justify-between py-3 text-sm">
                    <span className="text-gray-600">Plătitor TVA</span>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${company.vat_registered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {company.vat_registered ? 'Da' : 'Nu'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Declarații" value={String(companyDeclarations.length)} />
                <KpiCard label="Valoare vamală totală" value={fmt(companyDeclarations.reduce((s, d) => s + d.customs_value, 0))} />
                <KpiCard label="Taxe totale" value={fmt(companyDeclarations.reduce((s, d) => s + d.total_taxes, 0))} />
            </div>

            <DeclarationsTable declarations={companyDeclarations} />
        </div>
    )
}
