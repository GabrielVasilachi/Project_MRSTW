import { useEffect, useState } from 'react'
import axios from 'axios'
import { getAllPackages } from '../../api/packagesApi'
import type { PackageResponse } from '../../api/types/package'
import KpiCard from '../../components/dashboard/KpiCard'
import { formatBytes } from '../../utils/format'
import type { AdminDashboardUser, AdminDocumentRow } from './admin/adminData'
import { useAdminDashboardData } from './admin/adminData'

const STATUS_ROWS = [
    { label: 'Active', color: 'bg-emerald-600' },
    { label: 'Temporare', color: 'bg-amber-500' },
    { label: 'Expirate', color: 'bg-red-600' },
] as const

const PACKAGE_STATUS_LABELS: Record<number, string> = {
    0: 'În așteptare',
    1: 'Așteaptă documente',
    2: 'În verificare',
    3: 'Taxe calculate',
    4: 'Gata de plată',
    5: 'Plătit',
    6: 'Eliberat',
    7: 'Respins',
}

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

export default function DashboardAdmin() {
    const { users, documents, loading, error } = useAdminDashboardData()
    const [packages, setPackages] = useState<PackageResponse[]>([])
    const [packagesLoading, setPackagesLoading] = useState(true)
    const [packagesError, setPackagesError] = useState<string | null>(null)

    useEffect(() => {
        getAllPackages()
            .then(data => {
                setPackages(data ?? [])
                setPackagesError(null)
            })
            .catch(err => {
                if (axios.isAxiosError(err) && typeof err.response?.data === 'string') {
                    setPackagesError(err.response.data)
                } else {
                    setPackagesError('Nu s-au putut încărca coletele.')
                }
            })
            .finally(() => setPackagesLoading(false))
    }, [])

    const individualUsers = users.filter(user => user.role === 'individual')
    const businessUsers = users.filter(user => user.role === 'business')
    const totalDocumentSize = documents.reduce((sum, document) => sum + document.fileSize, 0)
    const usersWithDocuments = new Set(documents.map(document => document.userId)).size
    const statusSummary = getStatusSummary(users)
    const todayDocuments = getTodayDocuments(documents)
    const packagesWithDeclaration = packages.filter(packageItem => packageItem.hasDeclaration)
    const packagesWithoutDeclaration = packages.filter(packageItem => !packageItem.hasDeclaration)
    const packageDeclarationPercent = percent(packagesWithDeclaration.length, packages.length)
    const recentPackagesWithoutDeclaration = [...packagesWithoutDeclaration]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6)
    const recentPackages = [...packages]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    if (loading || packagesLoading) {
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
                <p className="mt-1 text-sm text-gray-500">Monitorizare operațională pentru colete, declarații, documente și conturi.</p>
            </div>

            {error || packagesError ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                    {error ?? packagesError}
                </div>
            ) : null}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Colete totale" value={String(packages.length)} sub={`${packageDeclarationPercent}% cu declarație`} />
                <KpiCard label="Fără declarație" value={String(packagesWithoutDeclaration.length)} sub="Necesită atenție" />
                <KpiCard label="Utilizatori" value={String(users.length)} sub={`${individualUsers.length} fizici · ${businessUsers.length} juridici`} />
                <KpiCard label="Documente azi" value={String(todayDocuments.length)} sub={`${documents.length} total · ${formatBytes(totalDocumentSize)}`} />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-5 xl:col-span-2">
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-base font-semibold text-gray-900">Flux colete</p>
                            <p className="mt-0.5 text-sm text-gray-500">Acoperire declarații pentru coletele scanate</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Cu declarație</p>
                            <p className="text-sm font-semibold text-gray-900">{packagesWithDeclaration.length} / {packages.length}</p>
                        </div>
                    </div>

                    <div className="space-y-5 border-b border-gray-100 pb-5">
                        <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="text-gray-700">Colete cu declarație</span>
                                <span className="font-medium text-gray-900">{packageDeclarationPercent}%</span>
                            </div>
                            <div className="h-3 rounded-full bg-gray-100">
                                <div className="h-3 rounded-full bg-emerald-600" style={{ width: `${packageDeclarationPercent}%` }} />
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-md border border-gray-100 bg-gray-50 px-3 py-3">
                                <p className="text-xs text-gray-500">Cu declarație</p>
                                <p className="mt-1 text-lg font-semibold text-gray-900">{packagesWithDeclaration.length}</p>
                            </div>
                            <div className="rounded-md border border-amber-100 bg-amber-50 px-3 py-3">
                                <p className="text-xs text-amber-700">Fără declarație</p>
                                <p className="mt-1 text-lg font-semibold text-amber-900">{packagesWithoutDeclaration.length}</p>
                            </div>
                            <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-3">
                                <p className="text-xs text-blue-700">Utilizatori cu documente</p>
                                <p className="mt-1 text-lg font-semibold text-blue-900">{usersWithDocuments}</p>
                            </div>
                        </div>
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
                    <p className="text-base font-semibold text-gray-900">Colete fără declarație</p>
                    <p className="mt-0.5 text-sm text-gray-500">Cele mai recente colete care trebuie urmărite</p>

                    {recentPackagesWithoutDeclaration.length === 0 ? (
                        <p className="mt-5 rounded-md border border-green-100 bg-green-50 px-3 py-4 text-sm text-green-700">Toate coletele au declarații asociate.</p>
                    ) : (
                        <div className="mt-5 divide-y divide-gray-100">
                            {recentPackagesWithoutDeclaration.map(packageItem => (
                                <div key={packageItem.id} className="py-3">
                                    <p className="font-mono text-xs font-semibold text-gray-900">{packageItem.trackingCode}</p>
                                    <p className="mt-1 truncate text-xs text-gray-500">{packageItem.companyName || packageItem.fullName || packageItem.contactPerson || 'Utilizator neidentificat'}</p>
                                    <p className="mt-1 text-xs text-amber-700">{PACKAGE_STATUS_LABELS[packageItem.status] ?? `Status ${packageItem.status}`}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <p className="text-base font-semibold text-gray-900">Status conturi</p>
                    <p className="mt-0.5 text-sm text-gray-500">Activare, tokenuri și roluri</p>

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
                </div>

                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 px-5 py-4">
                        <p className="text-base font-semibold text-gray-900">Ultimele colete scanate</p>
                        <p className="mt-0.5 text-sm text-gray-500">Activitate recentă din fluxul de colete</p>
                    </div>

                    {recentPackages.length === 0 ? (
                        <p className="px-5 py-8 text-center text-sm text-gray-400">Nu există colete scanate.</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {recentPackages.map(packageItem => (
                                <div key={packageItem.id} className="flex items-center justify-between gap-4 px-5 py-3">
                                    <div className="min-w-0">
                                        <p className="truncate font-mono text-xs font-semibold text-gray-800">{packageItem.trackingCode}</p>
                                        <p className="mt-1 text-xs text-gray-500">{packageItem.companyName || packageItem.fullName || packageItem.locationAdress}</p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className={`text-xs font-medium ${packageItem.hasDeclaration ? 'text-green-700' : 'text-amber-700'}`}>
                                            {packageItem.hasDeclaration ? 'Cu declarație' : 'Fără declarație'}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">{new Date(packageItem.createdAt).toLocaleDateString('ro-RO')}</p>
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
