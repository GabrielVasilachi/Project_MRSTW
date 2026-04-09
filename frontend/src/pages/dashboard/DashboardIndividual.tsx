import { useState, useEffect } from 'react'
import physicalData from '../../_mock/mock_persoana_fizica.json'
import { getSession } from '../../auth/auth.session'
import { isSetupCompleted } from '../../auth/setup.status'
import type { Declaration } from '../../types/declaration'
import type { PhysicalUser } from '../../types/user'
import KpiCard from '../../components/dashboard/KpiCard'
import DeclarationsTable from '../../components/dashboard/DeclarationsTable'
import AccountSetupModal from '../../components/dashboard/AccountSetupModal'
import AccountVerificationBanner from '../../components/dashboard/AccountVerificationBanner'

export default function DashboardIndividual() {
    const users = physicalData.users as PhysicalUser[]
    const declarations = physicalData.declarations as Declaration[]
    const session = getSession()

    const [showSetupModal, setShowSetupModal] = useState(false)
    const [setupCompleted, setSetupCompleted] = useState(false)

    const user = users.find(u => u.id === session?.userId) ?? users[0]
    if (!user) return null

    useEffect(() => {
        const completed = isSetupCompleted(user.id)
        setSetupCompleted(completed)
        if (!completed) {
            setShowSetupModal(true)
        }
    }, [user.id])

    const userDeclarations = declarations.filter(d => d.user_id === user.id)

    const handleSetupComplete = () => {
        setShowSetupModal(false)
        setSetupCompleted(true)
    }

    if (showSetupModal && !setupCompleted) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <AccountSetupModal 
                    userId={user.id} 
                    onComplete={handleSetupComplete}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <AccountVerificationBanner />

            <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
                <p className="mt-1 text-sm text-gray-500">Persoană fizică · {user.email}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 divide-y divide-gray-100">
                <p className="pb-3 text-base font-semibold text-gray-900">Date personale</p>
                {([['IDNP', user.idnp, true], ['Email', user.email, true], ['Telefon', user.phone, false], ['Adresă', user.address, true]] as [string, string, boolean][]).map(([label, value, isRequired]) => (
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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Declarații" value={String(userDeclarations.length)} />
                <KpiCard label="Valoare vamală totală" value={`${userDeclarations.reduce((s, d) => s + d.customs_value, 0)} MDL`} />
                <KpiCard label="Taxe totale" value={`${userDeclarations.reduce((s, d) => s + d.total_taxes, 0)} MDL`} />
            </div>

            <DeclarationsTable declarations={userDeclarations} />
        </div>
    )
}
