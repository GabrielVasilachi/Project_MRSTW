import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { getDocumentsByUserId } from '../../api/documentsApi'
import { getPackagesByUserId } from '../../api/packagesApi'
import type { PackageResponse } from '../../api/types/package'
import { getPhysicalDeclarationsByUserId } from '../../api/physicalDeclarationsApi'
import type { PhysicalDeclarationResponse } from '../../api/types/physicalDeclaration'
import { getPhysicalProfileByUserId } from '../../api/profilesApi'
import type { PhysicalProfileResponse } from '../../api/types/profile'
import type { DocumentInfo } from '../../api/types/document'
import { getSession } from '../../auth/auth.session'
import AccountVerificationBanner from '../../components/dashboard/AccountVerificationBanner'
import KpiCard from '../../components/dashboard/KpiCard'
import ProfileInfoRow from '../../components/dashboard/ProfileInfoRow'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { paths } from '../../routes/paths'
import { fmt, formatBytes } from '../../utils/format'
import { hasMissingPhysicalProfileData } from '../../utils/profileValidation'

type DashboardState = {
    profile: PhysicalProfileResponse | null
    declarations: PhysicalDeclarationResponse[]
    packages: PackageResponse[]
    documents: DocumentInfo[]
}

const STATUS_BY_ENUM: Record<number, string> = {
    0: 'Under Review',
    1: 'Approved',
    2: 'Rejected',
    3: 'Pending Documents',
}

const PACKAGE_STATUS_LABELS: Record<number, string> = {
    0: 'Așteaptă documente',
    1: 'În procesare',
    2: 'Finalizat',
}

export default function DashboardIndividual() {
    const session = getSession()
    const parsedUserId = session?.userId ? Number(session.userId) : null
    const userId = parsedUserId && Number.isFinite(parsedUserId) ? parsedUserId : null
    const [data, setData] = useState<DashboardState>({
        profile: null,
        declarations: [],
        packages: [],
        documents: [],
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            setError('Sesiunea nu conține id-ul utilizatorului.')
            return
        }

        const currentUserId = userId
        let ignore = false

        async function loadDashboard() {
            try {
                const [profile, declarations, packages, documents] = await Promise.all([
                    getPhysicalProfileByUserId(currentUserId),
                    getPhysicalDeclarationsByUserId(currentUserId),
                    getPackagesByUserId(currentUserId),
                    getDocumentsByUserId(currentUserId),
                ])

                if (!ignore) {
                    setData({
                        profile,
                        declarations: declarations ?? [],
                        packages: packages ?? [],
                        documents: documents ?? [],
                    })
                    setError(null)
                }
            } catch (err: unknown) {
                if (!ignore) {
                    if (axios.isAxiosError(err) && typeof err.response?.data === 'string') {
                        setError(err.response.data)
                    } else {
                        setError('Nu s-au putut încărca datele dashboard-ului.')
                    }
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        loadDashboard()

        return () => {
            ignore = true
        }
    }, [userId])

    const profile = data.profile
    const totalValue = useMemo(
        () => data.declarations.reduce((sum, declaration) => sum + Number(declaration.totalCost), 0),
        [data.declarations],
    )
    const recentDeclarations = data.declarations.slice(0, 4)
    const recentPackages = data.packages.slice(0, 3)
    const recentDocuments = data.documents.slice(0, 3)

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Se încarcă dashboard-ul...
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {error ?? 'Profilul fizic nu a fost găsit.'}
            </div>
        )
    }

    const needsVerification = hasMissingPhysicalProfileData(profile)
    const requiredFields: [string, string | null | undefined, boolean][] = [
        ['IDNP', profile.idnp, true],
        ['Email', profile.email, true],
        ['Telefon', profile.phoneNumber, true],
        ['Adresă', profile.locationAddress, true],
    ]

    return (
        <div className="space-y-8">
            {needsVerification ? <AccountVerificationBanner /> : null}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">Dashboard persoană fizică</p>
                    <h1 className="mt-1 text-2xl font-bold" style={{ color: '#1B3A5F' }}>{profile.fullName}</h1>
                    <p className="mt-1 text-sm text-gray-500">{profile.email ?? 'email necompletat'} · {profile.phoneNumber}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link to={paths.Individual_Declarations} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        Declarații
                    </Link>
                    <Link to={paths.Individual_Documents} className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50">
                        Documente
                    </Link>
                    <Link to={paths.Individual_Settings} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Setări
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <KpiCard label="Declarații" value={String(data.declarations.length)} />
                <KpiCard label="Colete asociate" value={String(data.packages.length)} />
                <KpiCard label="Documente" value={String(data.documents.length)} sub={formatBytes(data.documents.reduce((sum, document) => sum + document.fileSize, 0))} />
                <KpiCard label="Valoare declarată" value={fmt(totalValue)} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <div>
                            <p className="text-base font-semibold text-gray-900">Declarații recente</p>
                            <p className="mt-0.5 text-sm text-gray-500">Ultimele declarații create pe cont.</p>
                        </div>
                        <Link to={paths.Individual_Declarations} className="text-sm font-medium text-blue-600 hover:underline">
                            Vezi toate
                        </Link>
                    </div>
                    {recentDeclarations.length === 0 ? (
                        <p className="px-6 py-8 text-center text-sm text-gray-400">Nu aveți declarații create.</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {recentDeclarations.map(declaration => (
                                <div key={declaration.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{declaration.productName}</p>
                                        <p className="mt-1 font-mono text-xs text-gray-500">{declaration.trackingCode}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-700">{fmt(Number(declaration.totalCost))}</span>
                                        <StatusBadge status={STATUS_BY_ENUM[declaration.status] ?? 'Under Review'} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 divide-y divide-gray-100">
                    <p className="pb-3 text-base font-semibold text-gray-900">Date esențiale cont</p>
                    {requiredFields.map(([label, value, isRequired]) => (
                        <ProfileInfoRow key={label} label={label} value={value} required={isRequired} />
                    ))}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <p className="text-base font-semibold text-gray-900">Colete recente</p>
                    </div>
                    {recentPackages.length === 0 ? (
                        <p className="px-6 py-8 text-center text-sm text-gray-400">Nu există colete asociate.</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {recentPackages.map(packageItem => (
                                <div key={packageItem.id} className="flex items-center justify-between gap-3 px-6 py-4">
                                    <div>
                                        <p className="font-mono text-sm font-semibold text-gray-900">{packageItem.trackingCode}</p>
                                        <p className="mt-1 text-xs text-gray-500">{packageItem.locationAdress}</p>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">{PACKAGE_STATUS_LABELS[packageItem.status] ?? `Status ${packageItem.status}`}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <p className="text-base font-semibold text-gray-900">Documente recente</p>
                        <Link to={paths.Individual_Documents} className="text-sm font-medium text-blue-600 hover:underline">
                            Gestionează
                        </Link>
                    </div>
                    {recentDocuments.length === 0 ? (
                        <p className="px-6 py-8 text-center text-sm text-gray-400">Nu aveți documente încărcate.</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {recentDocuments.map(document => (
                                <div key={document.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                                    <p className="max-w-xs truncate text-sm font-medium text-gray-900">{document.fileName}</p>
                                    <span className="text-xs text-gray-500">{formatBytes(document.fileSize)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
