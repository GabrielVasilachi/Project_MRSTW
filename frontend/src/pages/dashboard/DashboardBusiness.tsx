import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { getBusinessDeclarationsByUserId } from '../../api/businessDeclarationsApi'
import type { BusinessDeclarationResponse } from '../../api/types/businessDeclaration'
import { getDocumentsByUserId } from '../../api/documentsApi'
import { getPackagesByUserId } from '../../api/packagesApi'
import type { PackageResponse } from '../../api/types/package'
import { getBusinessProfileByUserId } from '../../api/profilesApi'
import type { BusinessProfileResponse } from '../../api/types/profile'
import type { DocumentInfo } from '../../api/types/document'
import { getSession } from '../../auth/auth.session'
import BusinessVerificationBanner from '../../components/dashboard/BusinessVerificationBanner'
import KpiCard from '../../components/dashboard/KpiCard'
import ProfileInfoRow from '../../components/dashboard/ProfileInfoRow'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { STATUS_LABELS_RO } from '../../components/dashboard/statusColors'
import { paths } from '../../routes/paths'
import { fmt, formatBytes } from '../../utils/format'
import { hasMissingBusinessProfileData } from '../../utils/profileValidation'

type DashboardState = {
    profile: BusinessProfileResponse | null
    declarations: BusinessDeclarationResponse[]
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
    0: 'În așteptare',
    1: 'Așteaptă documente',
    2: 'În verificare',
    3: 'Taxe calculate',
    4: 'Gata de plată',
    5: 'Plătit',
    6: 'Eliberat',
    7: 'Respins',
}

function getStatusLabel(status: number) {
    const key = STATUS_BY_ENUM[status] ?? 'Under Review'
    return STATUS_LABELS_RO[key] ?? key
}

export default function DashboardBusiness() {
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
                    getBusinessProfileByUserId(currentUserId),
                    getBusinessDeclarationsByUserId(currentUserId),
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
    const pendingDocumentsCount = data.declarations.filter(declaration => getStatusLabel(declaration.status) === 'Documente necesare').length
    const recentDeclarations = data.declarations.slice(0, 4)
    const recentPackages = data.packages.slice(0, 5)
    const recentDocuments = data.documents.slice(0, 3)
    const packagesWithDeclaration = data.packages.filter(packageItem => packageItem.hasDeclaration)
    const packagesWithoutDeclaration = data.packages.filter(packageItem => !packageItem.hasDeclaration)

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
                {error ?? 'Profilul business nu a fost găsit.'}
            </div>
        )
    }

    const needsVerification = hasMissingBusinessProfileData(profile)
    const requiredFields: [string, string | null | undefined, boolean][] = [
        ['Companie', profile.companyName, true],
        ['EORI', profile.eoriCode, true],
        ['Email', profile.email, true],
        ['Telefon', profile.phoneNumber, true],
        ['IDNO', profile.idnoCode, false],
        ['Cod TVA', profile.tvaCode, false],
        ['Persoană contact', profile.contactPerson, false],
    ]

    return (
        <div className="space-y-8">
            {needsVerification ? <BusinessVerificationBanner /> : null}

            <div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Dashboard persoană juridică</p>
                    <h1 className="mt-1 text-2xl font-bold" style={{ color: '#1B3A5F' }}>{profile.companyName}</h1>
                    <p className="mt-1 text-sm text-gray-500">{profile.email ?? 'email necompletat'} · {profile.phoneNumber}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <KpiCard label="Colete companie" value={String(data.packages.length)} sub={`${packagesWithoutDeclaration.length} fără declarație`} />
                <KpiCard label="Cu declarație" value={String(packagesWithDeclaration.length)} sub={`${pendingDocumentsCount} cer documente`} />
                <KpiCard label="Documente" value={String(data.documents.length)} sub={formatBytes(data.documents.reduce((sum, document) => sum + document.fileSize, 0))} />
                <KpiCard label="Valoare declarată" value={fmt(totalValue)} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <div>
                            <p className="text-base font-semibold text-gray-900">Colete recente</p>
                            <p className="mt-0.5 text-sm text-gray-500">Coletele scanate pentru companie și statusul declarației.</p>
                        </div>
                        <Link to={paths.Business_Packages} className="text-sm font-medium text-blue-600 hover:underline">
                            Vezi toate
                        </Link>
                    </div>
                    {recentPackages.length === 0 ? (
                        <p className="px-6 py-8 text-center text-sm text-gray-400">Nu există colete asociate.</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {recentPackages.map(packageItem => (
                                <div key={packageItem.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{packageItem.companyName || packageItem.fullName || packageItem.trackingCode}</p>
                                        <p className="mt-1 font-mono text-xs text-gray-500">{packageItem.trackingCode}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-medium text-gray-500">{PACKAGE_STATUS_LABELS[packageItem.status] ?? `Status ${packageItem.status}`}</span>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${packageItem.hasDeclaration ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {packageItem.hasDeclaration ? 'Declarație creată' : 'Fără declarație'}
                                        </span>
                                        {!packageItem.hasDeclaration ? (
                                            <Link to={`${paths.Business_Declarations}?packageId=${packageItem.id}`} className="text-xs font-medium text-blue-600 hover:underline">
                                                Adaugă
                                            </Link>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 divide-y divide-gray-100">
                    <p className="pb-3 text-base font-semibold text-gray-900">Date esențiale companie</p>
                    {requiredFields.map(([label, value, isRequired]) => (
                        <ProfileInfoRow key={label} label={label} value={value} required={isRequired} labelClassName="w-40" />
                    ))}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <p className="text-base font-semibold text-gray-900">Declarații recente</p>
                        <Link to={paths.Business_Declarations} className="text-sm font-medium text-blue-600 hover:underline">
                            Vezi toate
                        </Link>
                    </div>
                    {recentDeclarations.length === 0 ? (
                        <p className="px-6 py-8 text-center text-sm text-gray-400">Nu există declarații create.</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {recentDeclarations.map(declaration => (
                                <div key={declaration.id} className="flex items-center justify-between gap-3 px-6 py-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{declaration.productName}</p>
                                        <p className="mt-1 font-mono text-xs text-gray-500">{declaration.trackingCode}</p>
                                    </div>
                                    <StatusBadge status={STATUS_BY_ENUM[declaration.status] ?? 'Under Review'} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <p className="text-base font-semibold text-gray-900">Documente recente</p>
                        <Link to={paths.Business_Documents} className="text-sm font-medium text-blue-600 hover:underline">
                            Gestionează
                        </Link>
                    </div>
                    {recentDocuments.length === 0 ? (
                        <p className="px-6 py-8 text-center text-sm text-gray-400">Nu există documente încărcate.</p>
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
