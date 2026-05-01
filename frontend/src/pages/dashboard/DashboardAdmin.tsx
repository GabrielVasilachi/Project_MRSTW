import KpiCard from '../../components/dashboard/KpiCard'
import AllUsersTable from '../../components/dashboard/AllUsersTable'
import { formatBytes } from '../../utils/format'
import { useAdminDashboardData } from './admin/adminData'

export default function DashboardAdmin() {
    const { users, documents, loading, error } = useAdminDashboardData()
    const individualUsers = users.filter(user => user.role === 'individual')
    const businessUsers = users.filter(user => user.role === 'business')
    const adminUsers = users.filter(user => user.role === 'admin')
    const totalDocumentSize = documents.reduce((sum, document) => sum + document.fileSize, 0)

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Se încarcă datele din backend...
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Panou de administrare</h1>
                <p className="mt-1 text-sm text-gray-500">Vizualizare completă a utilizatorilor și documentelor din backend</p>
            </div>

            {error ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Utilizatori totali"
                    value={String(users.length)}
                    sub={`${individualUsers.length} fizici · ${businessUsers.length} juridici · ${adminUsers.length} admin`} />
                <KpiCard label="Documente totale" value={String(documents.length)} />
                <KpiCard label="Spațiu documente" value={formatBytes(totalDocumentSize)} />
                <KpiCard label="Conturi active" value={String(users.filter(user => !user.isTemporary).length)} />
            </div>

            <AllUsersTable users={users} />
        </div>
    )
}
