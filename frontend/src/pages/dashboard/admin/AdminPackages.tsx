import axios from 'axios'
import { useEffect, useState } from 'react'
import { getAllPackages } from '../../../api/packagesApi'
import type { PackageResponse } from '../../../api/types/package'
import KpiCard from '../../../components/dashboard/KpiCard'
import PackagesTable from '../../../components/dashboard/PackagesTable'

export default function AdminPackages() {
    const [packages, setPackages] = useState<PackageResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getAllPackages()
            .then(data => {
                setPackages(data ?? [])
                setError(null)
            })
            .catch(err => {
                if (axios.isAxiosError(err) && typeof err.response?.data === 'string') {
                    setError(err.response.data)
                } else {
                    setError('Nu s-au putut încărca coletele.')
                }
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Se încarcă coletele...
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Colete</h1>
                <p className="mt-1 text-sm text-gray-500">Toate coletele scanate și datele preluate din fiecare colet.</p>
            </div>

            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <KpiCard label="Total colete" value={String(packages.length)} />
                <KpiCard label="Cu declarație" value={String(packages.filter(item => item.hasDeclaration).length)} />
                <KpiCard label="Fără declarație" value={String(packages.filter(item => !item.hasDeclaration).length)} />
                <KpiCard label="Utilizatori" value={String(new Set(packages.map(item => item.userId).filter(Boolean)).size)} />
            </div>

            <PackagesTable packages={packages} emptyMessage="Nu există colete scanate." recipientType="admin" showUserId />
        </div>
    )
}
