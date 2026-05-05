import KpiCard from '../../components/dashboard/KpiCard'
import { formatBytes } from '../../utils/format'
import type { AdminDashboardUser, AdminDocumentRow } from './admin/adminData'
import { useAdminDashboardData } from './admin/adminData'

const ROLE_COLORS: Record<string, string> = {
    individual: 'bg-blue-600',
    business: 'bg-emerald-600',
    admin: 'bg-gray-900',
}

const STATUS_ROWS = [
    { label: 'Active', color: 'bg-emerald-600' },
    { label: 'Temporare', color: 'bg-amber-500' },
    { label: 'Expirate', color: 'bg-red-600' },
] as const

function percent(value: number, total: number) {
    return total ? Math.round((value / total) * 100) : 0
}

function hasExpiredActivationToken(user: AdminDashboardUser) {
    if (user.hasExpiredActivationToken) return true
    if (!user.activationTokenExpiresAt) return false

    const expiresAt = new Date(user.activationTokenExpiresAt).getTime()
    return Number.isFinite(expiresAt) && expiresAt < Date.now()
}

function getStatusSummary(users: AdminDashboardUser[]) {
    const expired = users.filter(hasExpiredActivationToken).length
    const temporary = users.filter(user => user.isTemporary && !hasExpiredActivationToken(user)).length
    const active = users.length - temporary - expired

    return { active, temporary, expired }
}

function getTodayDocuments(documents: AdminDocumentRow[]) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return documents.filter(document => new Date(document.uploadedAt) >= today)
}

function getLastSevenDays(documents: AdminDocumentRow[]) {
    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        date.setDate(date.getDate() - (6 - index))

        const nextDate = new Date(date)
        nextDate.setDate(date.getDate() + 1)

        return {
            label: date.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' }),
            count: documents.filter(document => {
                const uploadedAt = new Date(document.uploadedAt)
                return uploadedAt >= date && uploadedAt < nextDate
            }).length,
        }
    })
}

export default function DashboardAdmin() {
    const { users, documents, loading, error } = useAdminDashboardData()
    const individualUsers = users.filter(user => user.role === 'individual')
    const businessUsers = users.filter(user => user.role === 'business')
    const adminUsers = users.filter(user => user.role === 'admin')
    const totalDocumentSize = documents.reduce((sum, document) => sum + document.fileSize, 0)
    const usersWithDocuments = new Set(documents.map(document => document.userId)).size
    const statusSummary = getStatusSummary(users)
    const todayDocuments = getTodayDocuments(documents)
    const lastSevenDays = getLastSevenDays(documents)
    const maxDailyDocuments = Math.max(...lastSevenDays.map(day => day.count), 1)
    const recentDocuments = [...documents]
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(0, 5)
    const roleRows = [
        { label: 'Persoane fizice', role: 'individual', count: individualUsers.length },
        { label: 'Persoane juridice', role: 'business', count: businessUsers.length },
        { label: 'Administratori', role: 'admin', count: adminUsers.length },
    ]

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
                <p className="mt-1 text-sm text-gray-500">Privire generală asupra conturilor, documentelor și activității recente.</p>
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
                <KpiCard label="Conturi active" value={String(statusSummary.active)} sub={`${percent(statusSummary.active, users.length)}% din total`} />
                <KpiCard label="Tokenuri expirate" value={String(statusSummary.expired)} sub="Necesită regenerare" />
                <KpiCard label="Documente azi" value={String(todayDocuments.length)} sub={`${documents.length} total · ${formatBytes(totalDocumentSize)}`} />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-5 xl:col-span-2">
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-base font-semibold text-gray-900">Activitate documente</p>
                            <p className="mt-0.5 text-sm text-gray-500">Ultimele 7 zile</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Utilizatori cu documente</p>
                            <p className="text-sm font-semibold text-gray-900">{usersWithDocuments}</p>
                        </div>
                    </div>

                    <div className="flex h-44 items-end gap-3 border-b border-gray-100 pb-3">
                        {lastSevenDays.map(day => {
                            const height = day.count ? Math.max(14, Math.round((day.count / maxDailyDocuments) * 100)) : 0

                            return (
                                <div key={day.label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                                    <div className="flex h-32 w-full items-end">
                                        <div
                                            className="w-full rounded-t bg-blue-600 transition-all"
                                            style={{ height: `${height}%` }}
                                            title={`${day.count} documente`}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-semibold text-gray-900">{day.count}</p>
                                        <p className="text-[11px] text-gray-500">{day.label}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-sm">
                        <div>
                            <p className="text-xs text-blue-700">Documente</p>
                            <p className="mt-1 font-semibold text-gray-900">{documents.length}</p>
                        </div>
                        <div>
                            <p className="text-xs text-emerald-700">Spațiu total</p>
                            <p className="mt-1 font-semibold text-gray-900">{formatBytes(totalDocumentSize)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-amber-700">Upload azi</p>
                            <p className="mt-1 font-semibold text-gray-900">{todayDocuments.length}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <p className="text-base font-semibold text-gray-900">Status conturi</p>
                    <p className="mt-0.5 text-sm text-gray-500">Activare și tokenuri</p>

                    <div className="mt-5 space-y-4">
                        {STATUS_ROWS.map(row => {
                            const count = row.label === 'Active'
                                ? statusSummary.active
                                : row.label === 'Temporare'
                                    ? statusSummary.temporary
                                    : statusSummary.expired
                            const pct = percent(count, users.length)

                            return (
                                <div key={row.label}>
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span className="text-gray-700">{row.label}</span>
                                        <span className="font-medium text-gray-900">{count} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100">
                                        <div className={`h-2 rounded-full ${row.color}`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-6 border-t border-red-100 pt-4">
                        <p className="text-sm font-semibold text-red-800">{statusSummary.expired} conturi expirate</p>
                        <p className="mt-1 text-xs text-red-700">Conturile cu token expirat pot fi regenerate din pagina Utilizatori.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <p className="text-base font-semibold text-gray-900">Distribuție utilizatori</p>
                    <p className="mt-0.5 text-sm text-gray-500">Structură pe roluri</p>

                    <div className="mt-5 space-y-4">
                        {roleRows.map(row => {
                            const pct = percent(row.count, users.length)

                            return (
                                <div key={row.role}>
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span className="text-gray-700">{row.label}</span>
                                        <span className="font-medium text-gray-900">{row.count} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100">
                                        <div className={`h-2 rounded-full ${ROLE_COLORS[row.role]}`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 px-5 py-4">
                        <p className="text-base font-semibold text-gray-900">Ultimele documente</p>
                        <p className="mt-0.5 text-sm text-gray-500">Cele mai recente uploaduri</p>
                    </div>

                    {recentDocuments.length === 0 ? (
                        <p className="px-5 py-8 text-center text-sm text-gray-400">Nu există documente încărcate.</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {recentDocuments.map(document => (
                                <div key={document.id} className="flex items-center justify-between gap-4 px-5 py-3">
                                    <div className="min-w-0">
                                        <p className="truncate font-mono text-xs font-semibold text-gray-800">{document.fileName}</p>
                                        <p className="mt-1 text-xs text-gray-500">{document.userName} · {document.userRole}</p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="text-xs font-medium text-gray-900">{formatBytes(document.fileSize)}</p>
                                        <p className="mt-1 text-xs text-gray-500">{new Date(document.uploadedAt).toLocaleDateString('ro-RO')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
