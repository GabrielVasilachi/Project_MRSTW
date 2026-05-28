import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { getAllPackages } from '../../../api/packagesApi'
import type { PackageResponse } from '../../../api/types/package'
import { formatBytes } from '../../../utils/format'
import { useAdminDashboardData } from './adminData'

function percent(value: number, total: number) {
    return total ? Math.round((value / total) * 100) : 0
}

export default function AdminReports() {
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
                    setPackagesError('Nu s-au putut încărca datele despre colete.')
                }
            })
            .finally(() => setPackagesLoading(false))
    }, [])

    const physicalUsers = users.filter(user => user.role === 'individual')
    const juridicalUsers = users.filter(user => user.role === 'business')
    const adminUsers = users.filter(user => user.role === 'admin')
    const packagesWithDeclaration = packages.filter(packageItem => packageItem.hasDeclaration)
    const packagesWithoutDeclaration = packages.filter(packageItem => !packageItem.hasDeclaration)
    const totalDocumentSize = documents.reduce((sum, document) => sum + document.fileSize, 0)
    const usersWithDocuments = new Set(documents.map(document => document.userId)).size
    const declarationCoverage = percent(packagesWithDeclaration.length, packages.length)
    const documentCoverage = percent(usersWithDocuments, users.length)
    const usersByActivity = useMemo(
        () => [...users].sort((a, b) => b.documents.length - a.documents.length).slice(0, 5),
        [users],
    )

    if (loading || packagesLoading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Se încarcă rapoartele...
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Admin / Rapoarte</p>
                        <h1 className="mt-1 text-2xl font-bold" style={{ color: '#1B3A5F' }}>Raport general platformă</h1>
                        <p className="mt-1 text-sm text-gray-500">Sinteză pentru utilizatori, colete, declarații și documente.</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Generat: {new Date().toLocaleString('ro-RO')}
                    </div>
                </div>
            </div>

            {error || packagesError ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                    {error ?? packagesError}
                </div>
            ) : null}

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">
                <Metric label="Utilizatori" value={users.length} detail={`${physicalUsers.length} fizici`} />
                <Metric label="Companii" value={juridicalUsers.length} detail="persoane juridice" />
                <Metric label="Colete" value={packages.length} detail={`${packagesWithoutDeclaration.length} fără declarație`} />
                <Metric label="Declarații" value={packagesWithDeclaration.length} detail={`${declarationCoverage}% acoperire`} />
                <Metric label="Documente" value={documents.length} detail={formatBytes(totalDocumentSize)} />
                <Metric label="Admini" value={adminUsers.length} detail="conturi interne" />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <section className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="mb-5">
                        <p className="text-base font-semibold text-gray-900">Sumar executiv</p>
                        <p className="mt-0.5 text-sm text-gray-500">Indicatori care arată rapid unde sunt blocaje.</p>
                    </div>

                    <div className="space-y-5">
                        <ProgressRow label="Colete cu declarație" value={declarationCoverage} />
                        <ProgressRow label="Utilizatori cu documente" value={documentCoverage} />
                        <ProgressRow label="Colete fără declarație" value={percent(packagesWithoutDeclaration.length, packages.length)} tone="amber" />
                    </div>

                    <div className="mt-6 rounded-md border border-amber-100 bg-amber-50 px-4 py-3">
                        <p className="text-sm font-semibold text-amber-900">{packagesWithoutDeclaration.length} colete fără declarație</p>
                        <p className="mt-1 text-xs text-amber-800">Aceste colete sunt cele mai importante pentru monitorizare operațională.</p>
                    </div>
                </section>

                <section className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="mb-5">
                        <p className="text-base font-semibold text-gray-900">Distribuție utilizatori</p>
                        <p className="mt-0.5 text-sm text-gray-500">Structura conturilor din platformă.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <RoleBlock label="Persoane fizice" count={physicalUsers.length} total={users.length} color="bg-blue-600" />
                        <RoleBlock label="Persoane juridice" count={juridicalUsers.length} total={users.length} color="bg-emerald-600" />
                        <RoleBlock label="Administratori" count={adminUsers.length} total={users.length} color="bg-gray-900" />
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <section className="rounded-lg border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 px-5 py-4">
                        <p className="text-base font-semibold text-gray-900">Colete fără declarație</p>
                        <p className="mt-0.5 text-sm text-gray-500">Primele înregistrări care necesită urmărire.</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {packagesWithoutDeclaration.slice(0, 6).length === 0 ? (
                            <p className="px-5 py-8 text-sm text-green-700">Nu există colete fără declarație.</p>
                        ) : packagesWithoutDeclaration.slice(0, 6).map(packageItem => (
                            <div key={packageItem.id} className="flex items-center justify-between gap-4 px-5 py-3">
                                <div className="min-w-0">
                                    <p className="truncate font-mono text-xs font-semibold text-gray-900">{packageItem.trackingCode}</p>
                                    <p className="mt-1 truncate text-xs text-gray-500">{packageItem.companyName || packageItem.fullName || packageItem.locationAdress}</p>
                                </div>
                                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Fără declarație</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-lg border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 px-5 py-4">
                        <p className="text-base font-semibold text-gray-900">Top activitate utilizatori</p>
                        <p className="mt-0.5 text-sm text-gray-500">După numărul de documente încărcate.</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {usersByActivity.length === 0 ? (
                            <p className="px-5 py-8 text-sm text-gray-400">Nu există utilizatori returnați de backend.</p>
                        ) : usersByActivity.map(user => (
                            <div key={user.id} className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                                    <p className="mt-1 text-xs text-gray-500">{user.roleLabel}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">{user.documents.length}</p>
                                    <p className="mt-1 text-xs text-gray-500">{formatBytes(user.documents.reduce((sum, document) => sum + document.fileSize, 0))}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

function Metric({ label, value, detail }: { label: string; value: number; detail: string }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
            <p className="mt-1 truncate text-xs text-gray-500">{detail}</p>
        </div>
    )
}

function ProgressRow({ label, value, tone = 'green' }: { label: string; value: number; tone?: 'green' | 'amber' }) {
    const color = tone === 'amber' ? 'bg-amber-500' : 'bg-emerald-600'

    return (
        <div>
            <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-gray-700">{label}</span>
                <span className="font-medium text-gray-900">{value}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
                <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} />
            </div>
        </div>
    )
}

function RoleBlock({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
    const pct = percent(count, total)

    return (
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900">{label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{count}</p>
            <div className="mt-3 h-2 rounded-full bg-white">
                <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-xs text-gray-500">{pct}% din total</p>
        </div>
    )
}
