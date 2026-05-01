import KpiCard from '../../../components/dashboard/KpiCard'
import { formatBytes } from '../../../utils/format'
import { useAdminDashboardData } from './adminData'

export default function AdminReports() {
    const { users, documents, loading, error } = useAdminDashboardData()
    const physicalUsers = users.filter(user => user.role === 'individual')
    const juridicalUsers = users.filter(user => user.role === 'business')
    const adminUsers = users.filter(user => user.role === 'admin')
    const usersByActivity = [...users].sort((a, b) => b.documents.length - a.documents.length)
    const totalDocumentSize = documents.reduce((sum, document) => sum + document.fileSize, 0)

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Se încarcă rapoartele...
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Rapoarte</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Statistici construite din utilizatorii și documentele returnate de backend.
                </p>
            </div>

            {error ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total utilizatori" value={String(users.length)} sub={`${physicalUsers.length} fizici · ${juridicalUsers.length} juridici`} />
                <KpiCard label="Administratori" value={String(adminUsers.length)} />
                <KpiCard label="Total documente" value={String(documents.length)} />
                <KpiCard label="Spațiu documente" value={formatBytes(totalDocumentSize)} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <p className="mb-4 text-base font-semibold text-gray-900">Distribuție utilizatori</p>
                    <div className="space-y-4">
                        {[
                            { label: 'Persoane fizice', count: physicalUsers.length },
                            { label: 'Persoane juridice', count: juridicalUsers.length },
                            { label: 'Administratori', count: adminUsers.length },
                        ].map(row => {
                            const pct = users.length ? Math.round((row.count / users.length) * 100) : 0

                            return (
                                <div key={row.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">{row.label}</span>
                                        <span className="text-gray-600">{row.count} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100">
                                        <div className="h-2 rounded-full bg-gray-900 transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <p className="mb-4 text-base font-semibold text-gray-900">Documente pe tip de cont</p>
                    <div className="space-y-4">
                        {[
                            { label: 'Persoane fizice', users: physicalUsers },
                            { label: 'Persoane juridice', users: juridicalUsers },
                            { label: 'Administratori', users: adminUsers },
                        ].map(row => {
                            const count = row.users.reduce((sum, user) => sum + user.documents.length, 0)
                            const size = row.users.flatMap(user => user.documents).reduce((sum, document) => sum + document.fileSize, 0)

                            return (
                                <div key={row.label} className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm font-semibold text-gray-900">{row.label}</p>
                                    <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
                                        <div>
                                            <p className="text-lg font-bold text-gray-900">{row.users.length}</p>
                                            <p>Utilizatori</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-gray-900">{count}</p>
                                            <p>Documente</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-gray-900">{formatBytes(size)}</p>
                                            <p>Spațiu</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <p className="text-base font-semibold text-gray-900">Activitate utilizatori</p>
                    <p className="mt-0.5 text-sm text-gray-500">Ordonat după numărul de documente încărcate</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                            <tr>
                                {['#', 'Utilizator', 'Tip cont', 'Documente', 'Spațiu utilizat'].map(h => (
                                    <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {usersByActivity.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">Nu există utilizatori returnați de backend.</td>
                                </tr>
                            ) : usersByActivity.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 text-gray-400">{index + 1}</td>
                                    <td className="px-6 py-3 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-3 text-gray-500">{user.roleLabel}</td>
                                    <td className="px-6 py-3 font-semibold text-gray-900">{user.documents.length}</td>
                                    <td className="px-6 py-3 text-gray-700">
                                        {formatBytes(user.documents.reduce((sum, document) => sum + document.fileSize, 0))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
