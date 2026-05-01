import KpiCard from '../../../components/dashboard/KpiCard'
import AllUsersTable from '../../../components/dashboard/AllUsersTable'
import { useAdminDashboardData } from './adminData'

export default function AdminUsers() {
    const { users, loading, error } = useAdminDashboardData()
    const physicalUsers = users.filter(user => user.role === 'individual')
    const juridicalUsers = users.filter(user => user.role === 'business')
    const adminUsers = users.filter(user => user.role === 'admin')

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Se încarcă utilizatorii...
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Utilizatori</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Gestionați conturile încărcate din tabelul de users și profilurile asociate.
                </p>
            </div>

            {error ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total utilizatori" value={String(users.length)} />
                <KpiCard label="Persoane fizice" value={String(physicalUsers.length)} />
                <KpiCard label="Persoane juridice" value={String(juridicalUsers.length)} />
                <KpiCard label="Administratori" value={String(adminUsers.length)} />
            </div>

            <AllUsersTable users={users} />
        </div>
    )
}
