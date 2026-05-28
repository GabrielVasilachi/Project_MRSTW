import axios from 'axios'
import { useEffect, useState } from 'react'
import { getPackagesByUserId } from '../../../api/packagesApi'
import type { PackageResponse } from '../../../api/types/package'
import { getSession } from '../../../auth/auth.session'
import KpiCard from '../../../components/dashboard/KpiCard'
import PackagesTable from '../../../components/dashboard/PackagesTable'

export default function IndividualPackages() {
    const session = getSession()
    const userId = session?.userId
        ? (parseInt(session.userId) || parseInt(session.userId.replace(/\D/g, '')) || null)
        : null

    const [packages, setPackages] = useState<PackageResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            setError('Sesiunea nu conține id-ul utilizatorului.')
            return
        }

        getPackagesByUserId(userId)
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
    }, [userId])

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
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Coletele mele</h1>
                <p className="mt-1 text-sm text-gray-500">Coletele scanate și informațiile preluate pentru contul dumneavoastră.</p>
            </div>

            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Total colete" value={String(packages.length)} />
                <KpiCard label="Cu declarație" value={String(packages.filter(item => item.hasDeclaration).length)} />
                <KpiCard label="Fără declarație" value={String(packages.filter(item => !item.hasDeclaration).length)} />
            </div>

            <PackagesTable packages={packages} emptyMessage="Nu există colete asociate contului." recipientType="individual" />
        </div>
    )
}
