import physicalData from '../../../_mock/mock_persoana_fizica.json'
import juridicalData from '../../../_mock/mock_persoana_juridica.json'
import type { Declaration } from '../../../types/declaration'
import type { PhysicalUser, JuridicalUser } from '../../../types/user'
import KpiCard from '../../../components/dashboard/KpiCard'
import AllUsersTable from '../../../components/dashboard/AllUsersTable'

export default function AdminUsers() {
    const physicalUsers = physicalData.users as PhysicalUser[]
    const juridicalUsers = juridicalData.users as JuridicalUser[]
    const allDeclarations = [
        ...physicalData.declarations as Declaration[],
        ...juridicalData.declarations as Declaration[],
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Utilizatori</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Gestionați toate conturile (persoane fizice și juridice) – modificați roluri sau suspendați conturi.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total utilizatori" value={String(physicalUsers.length + juridicalUsers.length)} />
                <KpiCard label="Persoane fizice" value={String(physicalUsers.length)} />
                <KpiCard label="Persoane juridice" value={String(juridicalUsers.length)} />
                <KpiCard label="Total declarații" value={String(allDeclarations.length)} sub="toate conturile" />
            </div>

            <AllUsersTable
                physicalUsers={physicalUsers}
                juridicalUsers={juridicalUsers}
                decCountFor={id => allDeclarations.filter(d => d.user_id === id).length}
            />
        </div>
    )
}
